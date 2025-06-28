'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  AlertCircle,
  BarChart2
} from "lucide-react";

// --- Type Definitions ---
interface CreatorData {
  name: string;
  email: string;
  brandname: string;
}

interface EventData {
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

type EventStatus = 'live' | 'upcoming' | 'ended';

// --- UI Sub-components ---

// Advanced Stat Card with Glassmorphism
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

// Skeleton Loader for Events List
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


// Main Dashboard Component
export default function CreatorDashboard() {
  const router = useRouter();
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authenticate and load creator data
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      if (parsedData && parsedData.brandname) {
        setCreatorData(parsedData);
      } else {
        router.push('/auth/signin');
      }
    } else {
      router.push('/auth/signin');
    }
    setIsLoading(false);
  }, [router]);

  // Fetch events when creator data is available
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
      const brandEventUrl = process.env.NEXT_PUBLIC_GET_BRAND_EVENTS!;
      const encodedBrandName = encodeURIComponent(creatorData.brandname);
      const response = await axios.get(`${brandEventUrl}${encodedBrandName}`);
      setEvents(response.data && Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Could not load your events.");
      setEvents([]);
    } finally {
      setIsEventsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    // A more modern confirmation dialog could be implemented here
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    const originalEvents = [...events];
    setEvents(events.filter(e => e.id !== eventId)); // Optimistic UI update
    try {
      const deleteEventUrl = process.env.NEXT_PUBLIC_DELETE_EVENT!;
      await axios.delete(deleteEventUrl, { data: { eventId } });
      // fetchEvents(); // Or just let the optimistic update stand
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Error deleting event. Restoring list.');
      setEvents(originalEvents); // Revert on error
    }
  };

  // --- Helper Functions & Memoized Calculations ---
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

  // Directly calculate stats on each render.
  // useMemo is removed to resolve a potential build tool parsing issue.
  const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
  const totalAttendees = events.reduce((sum, event) => sum + (event.attendees || 0), 0);
  const activeEvents = events.filter(event => getEventStatus(event.date) !== 'ended').length;
  const stats = { totalRevenue, totalAttendees, activeEvents };

  if (isLoading || !creatorData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          <button
            onClick={handleCreateEventClick}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <StatCard title="Total Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp />} colorClass="text-green-400" trend="+12% this month" />
          <StatCard title="Total Attendees" value={stats.totalAttendees.toLocaleString()} icon={<Users />} colorClass="text-blue-400" />
          <StatCard title="Active Events" value={stats.activeEvents.toString()} icon={<Calendar />} colorClass="text-purple-400" />
        </div>

        {/* Events List Section */}
        <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="bg-black/20 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"> </motion.div>
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
                {events.map(event => {
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
                        src={event.picture ? `https://app.samdavweb.org.ng/${event.picture}` : 'https://placehold.co/128x128/1a1a1a/ffffff?text=Event'}
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
                        <p className="text-xl font-bold text-white">${(event.revenue || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition">
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
        </div>
      </div>
  );
}
