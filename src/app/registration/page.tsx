'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { eventNames } from "process";

// --- Type Definitions ---
// Represents a single table from the API
interface Table {
  id: number;
  name: string;
  capacity: number;
  price: string;
}


// Updated to match the 'events' object from the API
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

// Represents the entire API response - flexible to handle different formats
interface EventApiResponse {
    events?: EventDetails;
    event?: EventDetails | EventDetails[];
    table?: Table[];
    tables?: Table[];
    [key: string]: any;
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
  const [tables, setTables] = useState<Table[]>([]); // State to hold table data
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
  const [generatedTicketData, setGeneratedTicketData] = useState<any>(null);
          const api_url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');




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
        console.log("Testing API", api_url)
      try {
        const getEventUrl = `${api_url}/event/getEvent?eventId=`;
        // The response is now expected to be an object with 'events' and 'table' properties
        const response = await axios.get<EventApiResponse>(`${getEventUrl}${eventId}`);

        console.log("Event API Response:", response.data);

        // Handle different response structures
        let details: EventDetails | null = null;
        let tableData: Table[] = [];

        if (response.data && response.data.events) {
          details = response.data.events;
          tableData = response.data.table || [];
        } else if (response.data && response.data.event) {
          // Handle single event response
          details = Array.isArray(response.data.event) ? response.data.event[0] : (response.data.event as EventDetails);
          tableData = response.data.table || response.data.tables || [];
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // Handle direct event object
          details = response.data as EventDetails;
          tableData = [];
        } else {
          throw new Error(`Event data is not in the expected format. Received: ${JSON.stringify(response.data)}`);
        }

        setEventDetails(details);
        setTables(tableData);

        // Set default ticket price from the main event price
        setFormData(prev => ({ ...prev, selectedTicket: { type: 'regular', price: parseFloat(details!.price) || 0 } }));
      } catch (err) {
        setError("Could not load event details. Please check the event ID and try again.");
        console.error(err);
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
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- LUXURY COLORS ---
    const colors = {
      black: [0, 0, 0],
      deepCharcoal: [10, 10, 10],
      gold: [197, 160, 89],
      lightGold: [231, 209, 146],
      subtleGray: [26, 26, 26],
      white: [255, 255, 255]
    };

    // 1. Master Background Canvas
    doc.setFillColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. The Ticket Card - Centered
    const ticketX = (pageWidth - 260) / 2;
    const ticketY = (pageHeight - 130) / 2;
    const ticketWidth = 260;
    const ticketHeight = 130;

    doc.setFillColor(colors.deepCharcoal[0], colors.deepCharcoal[1], colors.deepCharcoal[2]);
    doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(ticketX, ticketY, ticketWidth, ticketHeight, 3, 3, 'FD');

    // 3. Cyber Background Grid (subtle decorative lines)
    // Removed because they overlapped with the text and caused visual clutter.

    // 4. Left Aesthetic Border with Member Rank
    doc.setFillColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.rect(ticketX, ticketY, 4, ticketHeight, 'F');
    // Removed rotated text that was mispositioned and illegible


    // 5. Header - ECHELONTIX Logo
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('ECHELON', ticketX + 8, ticketY + 8);
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.text('TIX', ticketX + 8 + doc.getTextWidth('ECHELON'), ticketY + 8);

    // Certificate of Authenticity (top right)
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    const authCode = `#ECH-VIP-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}-ALPHA`;
    doc.text(`CERTIFICATE OF AUTHENTICITY: ${authCode}`, ticketX + ticketWidth - 8, ticketY + 6, { align: 'right' });

    // 6. Personalization Section - "WE HAVE BEEN EXPECTING YOU"
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('WE HAVE BEEN EXPECTING YOU,', ticketX + 8, ticketY + 18);

    // Guest Name (Large & Bold)
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    const guestName = ticketData.attendeeName.toUpperCase();
    doc.text(guestName, ticketX + 8, ticketY + 30);

    // Welcome Message
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.text('Your presence defines the evening. Welcome to the Inner Circle.', ticketX + 8, ticketY + 36);

    // 7. Main Event Title
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    const eventTitle = ticketData.eventName.substring(0, 25).toUpperCase();
    doc.text(eventTitle, ticketX + 8, ticketY + 48);

    // Gold underline
    doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setLineWidth(1.5);
    doc.line(ticketX + 8, ticketY + 50, ticketX + 50, ticketY + 50);

    // Event Subtitle
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('A SUPREME ASSEMBLY OF GLOBAL VISIONARIES', ticketX + 8, ticketY + 55);

    // 8. Data Grid (Arrival Date, Seating Category, Privilege Level)
    const dataY = ticketY + 72;
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text('ARRIVAL DATE', ticketX + 8, dataY);
    doc.text('SEATING CATEGORY', ticketX + 85, dataY);
    doc.text('PRIVILEGE LEVEL', ticketX + 160, dataY);

    // Data values
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const formattedDate = new Date(ticketData.eventDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
    doc.text(formattedDate, ticketX + 8, dataY + 8);
    doc.text('PRIVATE BALCONY', ticketX + 85, dataY + 8);
    doc.text('UNRESTRICTED', ticketX + 160, dataY + 8);

    // 9. Vertical Perforation Line (The "Stub" separator)
    doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setLineWidth(0.3);
    const perfLineX = ticketX + ticketWidth - 65;
    // Dashed line effect
    for (let y = ticketY + 2; y < ticketY + ticketHeight - 2; y += 2.5) {
      doc.line(perfLineX, y, perfLineX, y + 1.5);
    }

    // 10. QR Code Section (Right stub)
    const qrX = ticketX + ticketWidth - 55;
    const qrY = ticketY + 10;
    const qrSize = 48;

    // QR Frame (Gold border)
    doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setLineWidth(1.5);
    doc.rect(qrX, qrY, qrSize, qrSize);

    // Add the actual QR image
    if (ticketData.qrCodeUrl) {
      doc.addImage(ticketData.qrCodeUrl, 'PNG', qrX + 2, qrY + 2, qrSize - 4, qrSize - 4);
    }

    // "VERIFY SCAN AT ENTRY" text
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('VERIFY SCAN AT ENTRY', qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' });

    // Valid for one entry
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5);
    doc.text('VALID FOR ONE PRESTIGIOUS ENTRY', qrX + qrSize / 2, qrY + qrSize + 10, { align: 'center' });

    // 11. Digital URL & Slogan at bottom
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    // Center it in the main stub (between left border and right stub)
    const mainSectionWidth = ticketWidth - 65;
    doc.text('WWW.ECHELONTIX.COM.NG', ticketX + mainSectionWidth / 2, ticketY + ticketHeight - 8, { align: 'center' });

    // Brand Slogan
    doc.setTextColor(colors.subtleGray[0], colors.subtleGray[1], colors.subtleGray[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5);
    doc.text('EXCELLENCE IS NOT AN ACT, BUT A HABIT.', ticketX + mainSectionWidth / 2, ticketY + ticketHeight - 4, { align: 'center' });

    // 12. Authorization text
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    // Move to the left corner to avoid overlap with URL
    doc.text('Authorized By Echelon Executive Board', ticketX + 8, ticketY + ticketHeight - 8);

    // Save the PDF
    doc.save(`${ticketData.ticketToken}-ticket.pdf`);
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      let userId;
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          userId = parsedData.userID || parsedData.user_id || parsedData.profile?.user_id;
      }
      if (!userId) {
          userId = crypto.randomUUID();
      }

      const fullName = `${formData.firstName} ${formData.lastName}`;
      const token = generateTicketToken(fullName, eventDetails!.event_name);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}`;

      // Process image URL for Cloudinary/legacy support
      const processedImageUrl = eventDetails!.picture
        ? (eventDetails!.picture.startsWith("http") ? eventDetails!.picture : `${process.env.NEXT_PUBLIC_API_URL}/${eventDetails!.picture}`)
        : '/placeholder-image.png';

      const ticketDataForPDF = {
        attendeeName: fullName, eventName: eventDetails!.event_name, eventDate: eventDetails!.date,
        eventTime: eventDetails!.time_in, ticketType: formData.selectedTicket.type, ticketToken: token,
        qrCodeUrl: qrCodeUrl, eventImage: processedImageUrl
      };

      setGeneratedTicketData(ticketDataForPDF);

      const attendUrl = `${api_url}/event/attendEvent`;
      const attendPayload = new URLSearchParams({
          event_id: eventDetails!.id.toString(),
          email: formData.email,
          ticket_type: formData.selectedTicket.type,
          token: token,
      });
      // qrcode_url is optional but schema says it exists
      attendPayload.append("qrcode_url", `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}`);

      await axios.post(attendUrl, attendPayload.toString(), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
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
      amount: formData.selectedTicket.price * 100,
      ref: (new Date()).getTime().toString(),
      onClose: () => {
        // setError("Payment was cancelled."); // Optional: show message on close
      },
      callback: () => {
        handlePaymentSuccess();
      },
    });
    handler.openIframe();
  };

  // This function now dynamically generates all ticket options
  const getTicketOptions = () => {
    if (!eventDetails) return [];

    const options = [];

    // Standard tickets
    if (parseFloat(eventDetails.price) >= 0) options.push({ label: `Regular - ₦${eventDetails.price}`, value: `regular-${eventDetails.price}` });
    if (parseFloat(eventDetails.vip_price) > 0) options.push({ label: `VIP - ₦${eventDetails.vip_price}`, value: `vip-${eventDetails.vip_price}` });
    if (parseFloat(eventDetails.vvip_price) > 0) options.push({ label: `VVIP - ₦${eventDetails.vvip_price}`, value: `vvip-${eventDetails.vvip_price}` });
    if (parseFloat(eventDetails.vvvip_price) > 0) options.push({ label: `VVVIP - ₦${eventDetails.vvvip_price}`, value: `vvvip-${eventDetails.vvvip_price}` });

    // Dynamic tables from the API
    if (tables.length > 0) {
        tables.forEach(table => {
            options.push({
                label: `${table.name} (Capacity: ${table.capacity}) - ₦${table.price}`,
                // Use table name as type for simplicity
                value: `${table.name.replace(/\s+/g, '_')}-${table.price}`
            });
        });
    }

    return options;
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /> Loading Event...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500"><AlertCircle className="mr-2"/>{error}</div>;
  if (!eventDetails) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Event not found.</div>;

  const formattedDate = {
    day: new Date(eventDetails.date).getDate(),
    month: new Date(eventDetails.date).toLocaleString('en-US', { month: 'long' }).toUpperCase(),
    year: new Date(eventDetails.date).getFullYear()
  };

  return (
    <section className="w-full min-h-screen bg-contain bg-top bg-repeat text-white relative" style={{ backgroundImage: "url('/assets/echelontix.jpeg')" }}>
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
