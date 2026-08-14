'use client';

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, CheckCircle, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { MobileTicketView } from '../../component/ticket/MobileTicketView';
import { generateMobileTicketPdf } from '../../services/pdfService';
import { EchelontixTicketData, TicketTier } from '../../types/ticket';

interface Table {
  id: number;
  name: string;
  capacity: number;
  price: string;
}

interface EventDetails {
  id: number;
  event_name: string;
  event_address: string;
  time_in: string;
  summary: string;
  picture: string;
  date: string;
  price: string;
  vip_price: string;
  vvip_price: string;
  vvvip_price: string;
  account_name: string;
  account_number: string;
  bank: string;
}

interface EventApiResponse {
  events?: EventDetails;
  event?: EventDetails | EventDetails[];
  table?: Table[];
  tables?: Table[];
  [key: string]: any;
}

const EventForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    selectedTicket: { type: 'regular', price: 0 },
  });
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [generatedTicketData, setGeneratedTicketData] = useState<EchelontixTicketData | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const api_url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  // Guard: Determine if the event date has already passed
  const isPastEvent = useMemo(() => {
    if (!eventDetails?.date) return false;
    try {
      const eventDate = new Date(eventDetails.date);
      // Set guard cutoff to end of event date (23:59:59)
      eventDate.setHours(23, 59, 59, 999);
      return eventDate < new Date();
    } catch (e) {
      return false;
    }
  }, [eventDetails?.date]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      setError("No event ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      setIsLoading(true);
      setError(null);
      const api_url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      try {
        const getEventUrl = `${api_url}/event/getEvent?eventId=`;
        const response = await axios.get<EventApiResponse>(`${getEventUrl}${eventId}`);

        let details: EventDetails | null = null;
        let tableData: Table[] = [];

        if (response.data && response.data.events) {
          details = response.data.events;
          tableData = response.data.table || [];
        } else if (response.data && response.data.event) {
          details = Array.isArray(response.data.event) ? response.data.event[0] : (response.data.event as EventDetails);
          tableData = response.data.table || response.data.tables || [];
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          details = response.data as EventDetails;
          tableData = [];
        } else {
          throw new Error(`Event data format invalid.`);
        }

        setEventDetails(details);
        setTables(tableData);
        setFormData(prev => ({ ...prev, selectedTicket: { type: 'regular', price: parseFloat(details!.price) || 0 } }));
      } catch (err) {
        setError("Could not load event details. Please check the event ID and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventDetails();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [type, priceStr] = e.target.value.split('-');
    const price = parseFloat(priceStr);
    setFormData(prev => ({ ...prev, selectedTicket: { type, price } }));
  };

  const handleDownloadPdf = async () => {
    if (!generatedTicketData) return;
    setIsDownloadingPdf(true);
    try {
      await generateMobileTicketPdf(
        'registration-ticket-pass',
        `${generatedTicketData.ticket.ticketId}_Pass.pdf`
      );
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (isPastEvent) {
      setError("Registration is closed. Tickets cannot be acquired for a past event.");
      return;
    }

    setIsProcessing(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const attendUrl = `${api_url}/event/attendEvent`;
      const attendPayload = new URLSearchParams({
        event_id: eventDetails!.id.toString(),
        email: formData.email,
        ticket_type: formData.selectedTicket.type,
      });

      const response = await axios.post(attendUrl, attendPayload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseData = response.data;
      const ticketObj = responseData.ticket || responseData;

      const token = ticketObj.token || ticketObj.ticket_code || `ETX-${Date.now().toString().slice(-6)}`;
      const ticketCode = ticketObj.ticket_code || token;

      const processedImageUrl = eventDetails!.picture
        ? (eventDetails!.picture.startsWith("http") ? eventDetails!.picture : `${process.env.NEXT_PUBLIC_API_URL}/${eventDetails!.picture}`)
        : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop';

      const tier: TicketTier = (formData.selectedTicket.type.toUpperCase() as TicketTier) || 'VIP';

      const fullTicketData: EchelontixTicketData = {
        event: {
          name: eventDetails!.event_name,
          tagline: `Admit One • ₦${formData.selectedTicket.price.toLocaleString()}`,
          artwork: processedImageUrl,
          date: eventDetails!.date || '20 AUG 2026',
          time: eventDetails!.time_in || '8:00 PM',
          venue: eventDetails!.event_address || 'Main Venue',
          location: 'Gate A • Main Entrance',
        },
        attendee: {
          name: fullName,
          seatNumber: `Tier Access: ${tier}`,
        },
        ticket: {
          tier: tier,
          ticketId: token,
          securityCode: ticketCode.length > 12 ? `${ticketCode.slice(-4)}-SEC` : ticketCode,
          status: 'VALID',
        },
      };

      setGeneratedTicketData(fullTicketData);
      setTicketGenerated(true);

    } catch (err) {
      console.error("Attendance failed:", err);
      setError("Failed to generate ticket after payment. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = () => {
    if (isPastEvent) {
      setError("Registration is closed. Cannot purchase tickets for a past event.");
      return;
    }

    // @ts-ignore
    if (!window.PaystackPop) {
      setError("Payment service failed to load. Please refresh.");
      return;
    }

    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: formData.email,
      amount: formData.selectedTicket.price * 100,
      ref: (new Date()).getTime().toString(),
      onClose: () => {},
      callback: () => {
        handlePaymentSuccess();
      },
    });
    handler.openIframe();
  };

  const getTicketOptions = () => {
    if (!eventDetails) return [];
    const options: { label: string; value: string }[] = [];
    const tableNames = new Set(tables.map(t => t.name.toLowerCase().trim()));

    if (parseFloat(eventDetails.price) >= 0 && !tableNames.has('regular')) {
      options.push({ label: `Regular - ₦${eventDetails.price}`, value: `regular-${eventDetails.price}` });
    }
    if (parseFloat(eventDetails.vip_price) > 0 && !tableNames.has('vip')) {
      options.push({ label: `VIP - ₦${eventDetails.vip_price}`, value: `vip-${eventDetails.vip_price}` });
    }
    if (parseFloat(eventDetails.vvip_price) > 0 && !tableNames.has('vvip')) {
      options.push({ label: `VVIP - ₦${eventDetails.vvip_price}`, value: `vvip-${eventDetails.vvip_price}` });
    }
    if (parseFloat(eventDetails.vvvip_price) > 0 && !tableNames.has('vvvip')) {
      options.push({ label: `VVVIP - ₦${eventDetails.vvvip_price}`, value: `vvvip-${eventDetails.vvvip_price}` });
    }

    if (tables.length > 0) {
      tables.forEach(table => {
        options.push({
          label: `${table.name} (Capacity: ${table.capacity}) - ₦${table.price}`,
          value: `${table.name.replace(/\s+/g, '_')}-${table.price}`
        });
      });
    }

    return options;
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /> Loading Event...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500"><AlertCircle className="mr-2" />{error}</div>;
  if (!eventDetails) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Event not found.</div>;

  const parsedDate = new Date(eventDetails.date);
  const isValidDate = !isNaN(parsedDate.getTime());
  const formattedDate = {
    day: isValidDate ? parsedDate.getDate() : '--',
    month: isValidDate ? parsedDate.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'EVENT',
    year: isValidDate ? parsedDate.getFullYear() : 'DATE'
  };

  return (
    <section className="w-full min-h-screen bg-contain bg-top bg-repeat text-white relative" style={{ backgroundImage: "url('/assets/echelontix.jpeg')" }}>
      <AnimatePresence>
        {ticketGenerated && generatedTicketData ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 py-12">
            <div className="bg-[#0C0C0E]/95 backdrop-blur-xl p-8 rounded-3xl text-center border border-[#C8A96B]/50 max-w-xl w-full shadow-2xl flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#C8A96B]/20 border border-[#C8A96B] flex items-center justify-center mb-4 text-[#C8A96B]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-mono text-[#C8A96B] tracking-[0.25em] uppercase mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> CONFIRMED CREDENTIAL
              </span>
              <h2 className="text-2xl font-bold font-serif-display mb-1 text-white">Registration Complete</h2>
              <p className="text-xs text-gray-400 mb-6 max-w-md">Your luxury mobile pass has been generated. Present barcode at entry or save as high-DPI PDF.</p>

              {/* LIVE LUXURY MOBILE TICKET VIEW */}
              <div className="mb-6 w-full flex justify-center scale-95">
                <MobileTicketView ticketData={generatedTicketData} elementId="registration-ticket-pass" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold py-3.5 px-6 rounded-xl hover:brightness-110 transition-all duration-300 uppercase tracking-widest text-xs font-mono shadow-lg disabled:opacity-50"
                >
                  {isDownloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloadingPdf ? 'Exporting PDF...' : 'Download Pass (PDF)'}</span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/attendee')}
                  className="px-6 py-3.5 bg-[#1C1C1F] hover:bg-[#28282D] text-white font-semibold text-xs rounded-xl border border-white/10 transition-all font-mono uppercase tracking-wider"
                >
                  Go To Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
            <div className="text-white max-w-lg space-y-6">
              <img src={eventDetails.picture ? (eventDetails.picture.startsWith("http") ? eventDetails.picture : `${process.env.NEXT_PUBLIC_API_URL}/${eventDetails.picture}`) : '/placeholder-image.png'} alt={eventDetails.event_name} className="w-full sm:w-80 border-4 border-yellow-400 rounded-lg shadow-lg" />
              <div className="space-y-2">
                <p className="text-4xl font-extrabold">{formattedDate.day}<span className="text-lg block font-semibold">{formattedDate.month} {formattedDate.year}</span></p>
                <p className="text-sm uppercase">Entry at {eventDetails.time_in}</p>
                <p className="text-sm">Venue: {eventDetails.event_address}</p>
                <div className="mt-4"><p className="font-semibold">Event Summary</p><p className="text-sm">{eventDetails.summary}</p></div>
              </div>
            </div>

            <div className="bg-[#1f1f1f] bg-opacity-90 p-8 rounded-lg shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-center uppercase mb-1">{eventDetails.event_name}</h2>
              <p className="text-sm text-center text-gray-300 mb-6">Attendee Information</p>

              {/* Past Event Banner Guard */}
              {isPastEvent && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 flex items-start gap-3 text-red-200">
                  <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">Registration Closed</h4>
                    <p className="text-xs mt-1 text-red-200/90 leading-relaxed">
                      This event took place on {formattedDate.day} {formattedDate.month} {formattedDate.year}. Tickets are no longer available for purchase.
                    </p>
                  </div>
                </div>
              )}

              <form className="space-y-4">
                <div className="flex gap-3">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={isPastEvent} placeholder="First Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed" required />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={isPastEvent} placeholder="Last Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed" required />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isPastEvent} placeholder="Email Address" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed" required />
                <select name="selectedTicket" value={`${formData.selectedTicket.type}-${formData.selectedTicket.price}`} onChange={handleTicketSelection} disabled={isPastEvent} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed" required>
                  <option value="">Select a Ticket - {formData.selectedTicket.type}</option>
                  {getTicketOptions().map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>

                {isPastEvent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-red-950/60 border border-red-500/40 text-red-300 font-semibold py-3 rounded-xl cursor-not-allowed uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Registration Closed (Past Event)</span>
                  </button>
                ) : isProcessing ? (
                  <button disabled className="w-full flex items-center justify-center gap-2 bg-yellow-500/50 text-black font-semibold py-3 rounded-xl transition"><Loader2 className="w-4 h-4 animate-spin" />Processing...</button>
                ) : formData.selectedTicket.price > 0 ? (
                  <button type="button" onClick={handlePaystackPayment} className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl hover:bg-yellow-400 transition font-mono uppercase tracking-wider text-xs">Proceed to Payment</button>
                ) : (
                  <button type="button" onClick={handlePaymentSuccess} className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl hover:bg-yellow-400 transition font-mono uppercase tracking-wider text-xs">Get Free Ticket</button>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <EventForm />
    </Suspense>
  );
}
