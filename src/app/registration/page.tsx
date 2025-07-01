'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

// Type definitions
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
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  selectedTicket: string;
}

const EventForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    selectedTicket: '',
  });

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
        const getEventUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${getEventUrl}event/getEvent?${eventId}`);
        if (response.data?.event?.length > 0) {
          setEventDetails(response.data.event[0]);
        } else {
          throw new Error("Event not found.");
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Could not load event details. Please try again later.");
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    alert("Registration submitted! (See console for data)");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();
    return { day, month, year };
  };

  const getTicketOptions = () => {
    if (!eventDetails) return [];

    const options = [];
    if (parseFloat(eventDetails.price) > 0) options.push({ label: `Regular - ₦${eventDetails.price}`, value: 'regular' });
    if (parseFloat(eventDetails.vip_price) > 0) options.push({ label: `VIP - ₦${eventDetails.vip_price}`, value: 'vip' });
    if (parseFloat(eventDetails.vvip_price) > 0) options.push({ label: `VVIP - ₦${eventDetails.vvip_price}`, value: 'vvip' });
    if (parseFloat(eventDetails.vvvip_price) > 0) options.push({ label: `VVVIP - ₦${eventDetails.vvvip_price}`, value: 'vvvip' });
    if (parseFloat(eventDetails.table_price) > 0) options.push({ label: `Table - ₦${eventDetails.table_price}`, value: 'table' });

    return options;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Event...</div>;
  }

  if (error || !eventDetails) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error || "Could not find event."}</div>;
  }

  const formattedDate = formatDate(eventDetails.date);

  return (
    <section
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat text-white relative"
      style={{ backgroundImage: "url('/assets/dj-deck.svg')" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
        <div className="text-white max-w-lg space-y-6">
          <img
            src={`https://app.samdavweb.org.ng/${eventDetails.picture}`}
            alt={eventDetails.event_name}
            className="w-full sm:w-80 border-4 border-yellow-400 rounded-lg shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/lasu-food.svg' }}
          />
          <div className="space-y-2">
            <p className="text-4xl font-extrabold">{formattedDate.day}
              <span className="text-lg block font-semibold">{formattedDate.month} {formattedDate.year}</span>
            </p>
            <p className="text-sm uppercase">Entry at {eventDetails.time_in}</p>
            <p className="text-sm">Venue: {eventDetails.event_address}</p>
            <div className="mt-4">
              <p className="font-semibold">Event Summary</p>
              <p className="text-sm">{eventDetails.summary}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1f1f1f] bg-opacity-90 p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h2 className="text-xl font-bold text-center uppercase mb-1">{eventDetails.event_name}</h2>
          <p className="text-sm text-center text-gray-300 mb-6">Attendee Information</p>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                placeholder="First Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                placeholder="Last Name" className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
              placeholder="Email Address" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:ring-yellow-400" required />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" value="male" onChange={handleInputChange} className="accent-yellow-500" /> Male
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" value="female" onChange={handleInputChange} className="accent-yellow-500" /> Female
              </label>
            </div>
            <select name="selectedTicket" value={formData.selectedTicket} onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 focus:ring-yellow-400" required>
              <option value="">Select a Ticket to purchase</option>
              {getTicketOptions().map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button type="submit" className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// 🔁 Page component with Suspense wrapper
export default function RegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading registration...</div>}>
      <EventForm />
    </Suspense>
  );
}
