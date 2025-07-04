'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// --- Type Definitions ---
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
  table_price: string;
  account_name: string;
  account_number: string;
  bank: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  selectedTicket: {
    type: string;
    price: number;
  };
}

// --- Main Form Component ---
const EventForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    selectedTicket: { type: 'regular', price: 0 },
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [generatedTicketData, setGeneratedTicketData] = useState<any>(null);

  // Effect to dynamically load the Paystack script
  const url = process.env.NEXT_PUBLIC_API_URL
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
      try {
        const getEventUrl = `${url}event/getEvent?eventId=`;
        const response = await axios.get(`${getEventUrl}${eventId}`);
        if (response.data?.event?.length > 0) {
          const details = response.data.event[0];
          setEventDetails(details);
          // Set default ticket price
          setFormData(prev => ({ ...prev, selectedTicket: { type: 'regular', price: parseFloat(details.price) || 0 } }));
        } else {
          throw new Error("Event not found.");
        }
      } catch (err) {
        setError("Could not load event details.");
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

  const generateTicketToken = (name: string, eventName: string) => {
    const nameParts = name.split(' ');
    const initials = (nameParts[0]?.charAt(0) || 'X') + (nameParts[1]?.charAt(0) || 'X');
    const brandPrefix = eventName.substring(0, 5).toUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${initials}${brandPrefix}${randomNumbers}`;
  };

  const createStyledPDF = (ticketData: any) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [400, 200] });
    const ticketType = ticketData.ticketType.toUpperCase();

    const colors = {
      REGULAR: '#6366F1', VIP: '#D97706', VVIP: '#7E22CE', TABLE: '#DC2626', DEFAULT: '#4B5563'
    };
    const ticketColor = colors[ticketType as keyof typeof colors] || colors.DEFAULT;

    doc.addImage(ticketData.eventImage, 'JPEG', 0, 0, 400, 200);
    doc.setFillColor(0, 0, 0, 0.6);
    doc.rect(0, 0, 400, 200, 'F');
    doc.setFillColor(ticketColor);
    doc.rect(0, 0, 10, 200, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(ticketData.eventName, 20, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ATTENDEE: ${ticketData.attendeeName}`, 20, 50);
    doc.text(`DATE: ${new Date(ticketData.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 65);
    doc.text(`TIME: ${ticketData.eventTime}`, 20, 80);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(ticketColor);
    doc.roundedRect(20, 95, ticketType.length * 5 + 15, 15, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(ticketType, 25, 105);
    doc.addImage(ticketData.qrCodeUrl, 'PNG', 280, 50, 100, 100);
    doc.setFontSize(10);
    doc.text(ticketData.ticketToken, 280, 165);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Powered by ECHELONTIX', 20, 185);
    doc.save(`${ticketData.ticketToken}-ticket.pdf`);
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      // --- User ID Logic ---
      let userId;
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          // Check for various possible keys where user ID might be stored
          userId = parsedData.userID || parsedData.user_id || parsedData.profile?.user_id;
      }

      // If no user ID was found (user is not logged in), generate a unique one
      if (!userId) {
          userId = crypto.randomUUID();
          console.log("No logged-in user found. Generated temporary ID:", userId);
      }
      // --- End User ID Logic ---

      const fullName = `${formData.firstName} ${formData.lastName}`;
      const token = generateTicketToken(fullName, eventDetails!.event_name);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}`;

      const ticketDataForPDF = {
        attendeeName: fullName, eventName: eventDetails!.event_name, eventDate: eventDetails!.date,
        eventTime: eventDetails!.time_in, ticketType: formData.selectedTicket.type, ticketToken: token,
        qrCodeUrl: qrCodeUrl, eventImage: `https://app.samdavweb.org.ng/${eventDetails!.picture}`
      };

      setGeneratedTicketData(ticketDataForPDF);

      const attendUrl = `${url}event/attendevent`;
      await axios.post(attendUrl, {
          userId: userId, // Use the determined or generated user ID
          eventId: eventDetails!.id,
          email: formData.email,
          token: token,
          ticketType: formData.selectedTicket.type,
          userName: fullName
      });

      setTicketGenerated(true);

    } catch (err) {
      setError("Failed to generate ticket after payment. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = () => {
    // @ts-ignore
    if (!window.PaystackPop) {
      setError("Payment service failed to load. Please refresh.");
      return;
    }

    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: formData.email,
      amount: formData.selectedTicket.price * 100, // Amount in Kobo
      ref: (new Date()).getTime().toString(), // Unique reference
      onClose: () => {
        setError("Payment was cancelled.");
      },
      callback: (response: any) => {
        // This callback is called after a successful transaction
        handlePaymentSuccess();
      },
    });
    handler.openIframe();
  };

  const getTicketOptions = () => {
    if (!eventDetails) return [];
    const options = [];
    if (parseFloat(eventDetails.price) >= 0) options.push({ label: `1 Headset - ₦${eventDetails.price}`, value: `regular-${eventDetails.price}` });
    if (parseFloat(eventDetails.vip_price) > 0) options.push({ label: `2 Headset - ₦${eventDetails.vip_price}`, value: `vip-${eventDetails.vip_price}` });
    if (parseFloat(eventDetails.vvip_price) > 0) options.push({ label: `3 Headset - ₦${eventDetails.vvip_price}`, value: `vvip-${eventDetails.vvip_price}` });
    if (parseFloat(eventDetails.vvvip_price) > 0) options.push({ label: `VVVIP - ₦${eventDetails.vvvip_price}`, value: `vvvip-${eventDetails.vvvip_price}` });
    if (parseFloat(eventDetails.table_price) > 0) options.push({ label: `Table - ₦${eventDetails.table_price}`, value: `table-${eventDetails.table_price}` });
    return options;
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /> Loading Event...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500"><AlertCircle className="mr-2"/>{error}</div>;
  if (!eventDetails) return null;

  const formattedDate = {
    day: new Date(eventDetails.date).getDate(),
    month: new Date(eventDetails.date).toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    year: new Date(eventDetails.date).getFullYear()
  };

  return (
    <section className="w-full min-h-screen bg-cover bg-center bg-no-repeat text-white relative" style={{ backgroundImage: "url('/assets/ba.jpg')" }}>
      <AnimatePresence>
        {ticketGenerated ? (
            <motion.div key="success" initial={{opacity: 0}} animate={{opacity: 1}} className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl text-center border border-yellow-400/50 max-w-lg">
                    <CheckCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Registration Complete!</h2>
                    <p className="text-gray-300 mb-6">Your ticket has been generated. Download it now and get ready for an amazing experience.</p>
                    <button onClick={() => createStyledPDF(generatedTicketData)} className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300">
                        <Download />
                        Download Your Ticket (PDF)
                    </button>
                </div>
            </motion.div>
        ) : (
            <motion.div key="form" initial={{opacity: 0}} animate={{opacity: 1}} className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
                <div className="text-white max-w-lg space-y-6">
                    <img src={`https://app.samdavweb.org.ng/${eventDetails.picture}`} alt={eventDetails.event_name} className="w-full sm:w-80 border-4 border-yellow-400 rounded-lg shadow-lg" />
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
                    <form className="space-y-4">
                        <div className="flex gap-3">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
                        </div>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
                        <select name="selectedTicket" value={`${formData.selectedTicket.type}-${formData.selectedTicket.price}`} onChange={handleTicketSelection} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 focus:ring-yellow-400" required>
                            <option value="">Select a Ticket - {formData.selectedTicket.type}</option>
                            {getTicketOptions().map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>

                        {isProcessing ? (
                            <button disabled className="w-full flex justify-center bg-yellow-500/50 text-black font-semibold py-2 rounded transition"><Loader2 className="animate-spin" />Processing...</button>
                        ) : formData.selectedTicket.price > 0 ? (
                            <button type="button" onClick={handlePaystackPayment} className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition">Proceed to Payment</button>
                        ) : (
                            <button type="button" onClick={handlePaymentSuccess} className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition">Get Free Ticket</button>
                        )}
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Page component with Suspense wrapper
export default function RegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <EventForm />
    </Suspense>
  );
}
