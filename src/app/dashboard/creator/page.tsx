'use client';

import { useEffect, useState, useMemo, ChangeEvent, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  AlertCircle,
  BarChart2,
  X,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Banknote,
  Ticket
} from "lucide-react";

// --- Type Definitions ---
interface CreatorData {
  name: string;
  email: string;
  brandname: string;
}

interface EventListData {
  id: string;
  event_name: string;
  date: string;
  time_in: string;
  event_address: string;
  attendees?: number;
  maxAttendees?: number;
  revenue?: number;
  picture?: string;
}

interface EventDetails {
    id: string;
    brand_name: string;
    event_name: string;
    event_address: string;
    time_in: string;
    time_out: string;
    summary: string;
    picture: string | null;
    price: string;
    category: string;
    date: string;
    account_name: string;
    account_number: string;
    bank: string;
    vip_price: string;
    vvip_price: string;
    vvvip_price: string;
    table_price: string;
}

interface TableData {
    id: number;
    name: string;
    capacity: number;
    price: string;
}

interface FullEventData {
    events: EventDetails;
    table: TableData[];
}

interface AdminData {
    brand: string;
    event: [];
    totalEvents: number;
    totalRevenue: number;
    totalTicket: number;
}

let revenue_core = 0
let totalAttendees_core = 0
let map_event = Array()

type EventStatus = 'live' | 'upcoming' | 'ended';

// --- UI Sub-components ---

const StatCard = ({ title, value, icon, colorClass, trend }: { title: string; value: string; icon: React.ReactNode; colorClass: string, trend?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
  >
    <div className="flex justify-between items-center">
      <p className="font-medium text-gray-300">{title}</p>
      <div className={`text-2xl ${colorClass}`}>{icon}</div>
    </div>
    <div>
      <p className="text-4xl font-bold text-white mt-2">{value}</p>
      {trend && <p className={`text-sm mt-1 ${colorClass}`}>{trend}</p>}
    </div>
  </motion.div>
);

const EventListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl animate-pulse">
                <div className="w-24 h-24 rounded-lg bg-gray-700/50"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700/50 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-24 bg-gray-700/50 rounded-lg"></div>
            </div>
        ))}
    </div>
);


// --- Edit Modal Component ---
const EditEventModal = ({
    isOpen,
    onClose,
    eventData,
    onUpdate
}: {
    isOpen: boolean;
    onClose: () => void;
    eventData: FullEventData | null;
    onUpdate: (eventDetails: EventDetails, tables: TableData[], imageFile: File | null) => Promise<void>;
}) => {
    const [details, setDetails] = useState<EventDetails | null>(null);
    const [tables, setTables] = useState<TableData[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (eventData) {
            const formattedDate = new Date(eventData.events.date).toISOString().split('T')[0];
            setDetails({ ...eventData.events, date: formattedDate });
            setTables(eventData.table || []);
            if (eventData.events.picture) {
                setImagePreview(`https://app.echelontix.com.ng/${eventData.events.picture}`);
            } else {
                setImagePreview(null);
            }
            setImageFile(null); // Reset file on new data
        }
    }, [eventData]);

    const handleDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (details) {
            setDetails({ ...details, [e.target.name]: e.target.value });
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleTableChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const newTables = [...tables];
        (newTables[index] as any)[e.target.name] = e.target.value;
        setTables(newTables);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!details) return;
        setIsUpdating(true);
        await onUpdate(details, tables, imageFile);
        setIsUpdating(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: -20 }}
                    className="bg-gray-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                    <header className="p-6 flex justify-between items-center sticky top-0 bg-gray-900/80 backdrop-blur-lg z-10 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Edit Event Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X /></button>
                    </header>
                    {details ? (
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* --- Image Upload Section --- */}
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2"><ImageIcon size={20}/> Event Picture</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Event Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="text-gray-500" size={40}/>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden"/>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
                                            Change Image
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2">Upload a new image to replace the current one.</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- Core Event Details --- */}
                             <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Calendar size={20}/> Event Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="event_name" value={details.event_name} onChange={handleDetailChange} placeholder="Event Name" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-transparent focus:border-yellow-400 outline-none" />
                                    <select name="category" value={details.category} onChange={handleDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white border border-transparent focus:border-yellow-400 outline-none">
                                        <option value="">Select Category</option>
                                        <option value="Music">Music</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Party">Party</option>
                                        <option value="Sport">Sport</option>
                                        <option value="Art">Art</option>
                                    </select>
                                    <input type="date" name="date" value={details.date} onChange={handleDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="time" name="time_in" value={details.time_in} onChange={handleDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="time" name="time_out" value={details.time_out} onChange={handleDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="text" name="event_address" value={details.event_address} onChange={handleDetailChange} placeholder="Event Address" className="w-full p-3 rounded-lg bg-gray-800 text-white md:col-span-2" />
                                </div>
                                <textarea name="summary" value={details.summary} onChange={handleDetailChange} placeholder="Event Summary" rows={4} className="w-full p-3 mt-4 rounded-lg bg-gray-800 text-white" />
                            </div>

                            {/* --- Ticket Pricing Section --- */}
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Ticket size={20}/> Ticket Pricing (₦)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <input type="number" name="price" value={details.price} onChange={handleDetailChange} placeholder="Regular" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="number" name="vip_price" value={details.vip_price} onChange={handleDetailChange} placeholder="VIP" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="number" name="vvip_price" value={details.vvip_price} onChange={handleDetailChange} placeholder="VVIP" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="number" name="vvvip_price" value={details.vvvip_price} onChange={handleDetailChange} placeholder="VVVIP" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="number" name="table_price" value={details.table_price} onChange={handleDetailChange} placeholder="General Table" className="w-full p-3 rounded-lg bg-gray-800 text-white col-span-2 md:col-span-4" />
                                </div>
                            </div>

                            {/* --- Payout Information --- */}
                             <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Banknote size={20}/> Payout Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" name="bank" value={details.bank} onChange={handleDetailChange} placeholder="Bank Name" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="text" name="account_name" value={details.account_name} onChange={handleDetailChange} placeholder="Account Name" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                    <input type="text" name="account_number" value={details.account_number} onChange={handleDetailChange} placeholder="Account Number" className="w-full p-3 rounded-lg bg-gray-800 text-white" />
                                </div>
                            </div>

                            {/* --- Table Details Section --- */}
                            {tables.length > 0 && (
                                <div className="border-t border-gray-700 pt-6">
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-4">Edit Specific Tables</h3>
                                    <div className="space-y-4">
                                        {tables.map((table, index) => (
                                            <div key={table.id} className="p-3 bg-gray-800/50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <input type="text" name="name" value={table.name} onChange={(e) => handleTableChange(index, e)} placeholder="Table Name" className="w-full p-2 rounded bg-gray-700 text-white" />
                                                <input type="number" name="price" value={table.price} onChange={(e) => handleTableChange(index, e)} placeholder="Price" className="w-full p-2 rounded bg-gray-700 text-white" />
                                                <input type="number" name="capacity" value={table.capacity} onChange={(e) => handleTableChange(index, e)} placeholder="Capacity" className="w-full p-2 rounded bg-gray-700 text-white" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={isUpdating} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-600 flex items-center justify-center">
                                {isUpdating ? <Loader2 className="animate-spin" /> : 'Save All Changes'}
                            </button>
                        </form>
                    ) : (
                         <div className="h-96 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white text-4xl"/>
                         </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// Main Dashboard Component
export default function CreatorDashboard() {
  const router = useRouter();
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [events, setEvents] = useState<EventListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminData[]>([]);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FullEventData | null>(null);

  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      if (parsedData?.brandname) {
        setCreatorData(parsedData);
      } else {
        router.push('/auth/signin');
      }
    } else {
      router.push('/auth/signin');
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (creatorData) {
      fetchEvents();
    }
  }, [creatorData]);

  const fetchEvents = async () => {
    if (!creatorData) return;
    setIsEventsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}event/getEventCreated?brand=${encodeURIComponent(creatorData.brandname)}`);
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Could not load your events.");
      setEvents([]);
    } finally {
      setIsEventsLoading(false);
    }
  };
  const fetchDash = async () => {
    if (!creatorData) return;
    setError(null);
    try {
      const response = await axios.get(`${url}event/getDashboard?brand=${encodeURIComponent(creatorData.brandname)}`);
      console.log(response.data);
      revenue_core = response.data.totalRevenue
      totalAttendees_core = response.data.totalTickets
      map_event = response.data.events

      setAdmin(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Could not load your events.");
      setAdmin([]);
    } finally {
      // setIsEventsLoading(false);
    }
  };
  useEffect(() => {
    fetchDash();
  }, [creatorData]);

  // // // // /**

   const handleEditClick = async (eventId: string) => {
     try {
       const response = await axios.get<FullEventData>(`${url}event/getEvent?eventId=${eventId}`);
       if (response.data) {
           setEditingEvent(response.data);
           setIsEditModalOpen(true);
       } else {
          throw new Error("Event data not found in response");
        }
    } catch (err) {
         console.error("Failed to fetch event details for editing:", err);
         alert("Could not load event details. Please try again.");
   }
  };

  // // // // /**
  // // // //  * Professionally handles the event update process by making two distinct API calls.
  // // // //  * This version sends event data as a standard JSON object and does not handle file uploads.

  const handleUpdateEvent = async (eventDetails: EventDetails, tables: TableData[], imageFile: File | null) => {
    try {
        // --- Step 1: Update Event Tables (Using User's Provided Logic) ---
        if (tables.length > 0) {
            console.log(`Updating ${tables.length} tables for event ID: ${eventDetails.id}`);
            // RESTORED: This logic is exactly as provided by the user.
            // Note: The backend route for this should be '/updateTableCreation' and it should
            // expect the eventId within the payload if it's not in the URL.
            const updateTablesUrl = `${url}event/updateTableCreation/`;
            const tablesPayload = {
                eventId: eventDetails.id, // Ensure the eventId is sent if the backend needs it
                tables: tables.map(t => ({
                    id: t.id,
                    tableName: t.name,
                    tablePrice: t.price,
                    tableCapacity: t.capacity
                }))
            };
            await axios.put(updateTablesUrl, tablesPayload);
        }

        // --- Step 2: Update Core Event Details via JSON ---
        if (imageFile) {
            // If an image is being uploaded, we must use FormData.
            // This requires a separate endpoint or a backend that can handle mixed content.
            console.warn("Image upload is being skipped because the current implementation uses JSON. A separate endpoint is required for file uploads.");
        }

        console.log(`Updating event details (JSON) for event ID: ${eventDetails.id}`);
        // The URL must contain the event ID for a RESTful PUT request.
        const updateEventUrl = `${url}event/updateEvent/`;

        const eventDetailsPayload = {
            // We no longer send the eventId in the body, as it's in the URL.
            eventId: eventDetails.id,
            brand_name: eventDetails.brand_name,
            eventName: eventDetails.event_name,
            eventAddress: eventDetails.event_address,
            timeIn: eventDetails.time_in,
            timeOut: eventDetails.time_out,
            summary: eventDetails.summary,
            price: eventDetails.price || '0',
            category: eventDetails.category,
            date: eventDetails.date,
            account_name: eventDetails.account_name,
            account_number: eventDetails.account_number,
            bank: eventDetails.bank,
            vip_price: eventDetails.vip_price || '0',
            vvip_price: eventDetails.vvip_price || '0',
            table_price: eventDetails.table_price || '0',
            vvvip_price: eventDetails.vvvip_price || '0',
        };

        // Axios will automatically set the Content-Type to 'application/json' for this object.
        await axios.put(updateEventUrl, eventDetailsPayload);

        alert("Event updated successfully!");
        setIsEditModalOpen(false);
        setEditingEvent(null);
        fetchEvents(); // Refresh data to reflect changes.

    } catch (err) {
        console.error("Failed to update event:", err);
        const error = err as AxiosError<{ message: string }>;
        const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
        alert(`Update Failed: ${errorMessage}`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    const originalEvents = [...events];
    setEvents(events.filter(e => e.id !== eventId));
    try {
      await axios.delete(`${url}event/deleteEvent`, { data: { eventId } });
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Error deleting event. Restoring list.');
      setEvents(originalEvents);
    }
  };

  const getEventStatus = (eventDate: string): EventStatus => {
    const now = new Date();
    const date = new Date(eventDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (eventDay < today) return 'ended';
    if (eventDay.getTime() === today.getTime()) return 'live';
    return 'upcoming';
  };

  const getStatusInfo = (status: EventStatus) => {
    switch (status) {
      case 'live': return { text: 'Live', color: 'bg-red-500/80 border-red-400' };
      case 'upcoming': return { text: 'Upcoming', color: 'bg-green-500/80 border-green-400' };
      case 'ended': return { text: 'Ended', color: 'bg-gray-500/80 border-gray-400' };
      default: return { text: 'Draft', color: 'bg-yellow-500/80 border-yellow-400' };
    }
  };

  const handleCreateEventClick = () => router.push('/create-event');
  const handleVerifyEventClick = () => router.push('/ticket-validation');
  const handleExploreEventClick = () => router.push('/explore');
  const handleProfileUpdateClick = () => router.push('/update');

  const totalRevenue = revenue_core
  const totalAttendees = totalAttendees_core
  const activeEvents = useMemo(() => events.filter(event => getEventStatus(event.date) !== 'ended').length, [events]);
  const stats = { totalRevenue, totalAttendees, activeEvents };

  if (isLoading || !creatorData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500"/>
      </div>
    );
  }

  return (
    <>
      <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          eventData={editingEvent}
          onUpdate={handleUpdateEvent}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-4xl font-bold">Creator Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {creatorData.name}!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                onClick={handleCreateEventClick}
                className="flex items-center justify-center w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
                >
                <Plus className="w-5 h-5" />
                Create New Event
                </button>
                <button
                onClick={handleVerifyEventClick}
                className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
                >
                Verify Ticket
                </button>
                <button
                onClick={handleProfileUpdateClick}
                className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
                >
                Edit Profile
                </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={<TrendingUp />} colorClass="text-green-400" trend="+12% this month" />
            <StatCard title="Total Attendees" value={totalAttendees.toLocaleString()} icon={<Users />} colorClass="text-blue-400" />
            <StatCard title="Active Events" value={stats.activeEvents.toString()} icon={<Calendar />} colorClass="text-purple-400" />
          </div>

          <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="bg-black/20 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-semibold">Your Events</h2>
               <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                  <BarChart2 className="w-4 h-4"/>
                  View Analytics
               </button>
            </div>

            {isEventsLoading ? (
              <EventListSkeleton />
            ) : error ? (
              <div className="text-center py-10 text-red-400 flex flex-col items-center gap-2">
                <AlertCircle/>
                <p>{error}</p>
                <button onClick={fetchEvents} className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Try Again</button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>You haven't created any events yet.</p>
                <button onClick={handleCreateEventClick} className="mt-4 text-blue-400 font-semibold hover:underline">Create your first event</button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {map_event.map(event => {
                    const status = getEventStatus(event.date);
                    const statusInfo = getStatusInfo(status);
                    return (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col md:flex-row items-center gap-6 p-4 bg-black/20 border border-white/10 rounded-2xl hover:bg-black/40 transition-colors duration-300"
                      >
                        <img
                          src={event.picture ? `https://app.echelontix.com.ng/${event.picture}` : 'https://placehold.co/128x128/1a1a1a/ffffff?text=Event'}
                          alt={event.event_name}
                          className="w-full md:w-32 h-32 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/128x128/1a1a1a/ffffff?text=Event' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg text-white">{event.event_name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full border ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {event.time_in}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Attendees</p>
                          <p className="text-xl font-bold text-white">{event.attendees || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Revenue</p>
                          <p className="text-xl font-bold text-white">₦{(event.revenue || 0).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(event.id)} className="text-gray-400 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-400 hover:text-red-500 p-3 rounded-full bg-white/5 hover:bg-white/10 transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
          <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center mb-10">
              <button
              onClick={handleExploreEventClick}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gradient-to-l transform hover:scale-105 transition-all duration-300 font-semibold"
              >
              🧭 Explore
              </button>
          </div>
        </div>
      </div>
    </>
  );
};
