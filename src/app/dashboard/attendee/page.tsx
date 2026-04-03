'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  MapPin,
  AlertCircle,
  Compass,
  Ticket,
  TrendingUp,
  CheckCircle,
  UserCog
} from "lucide-react";

// --- Type Definitions ---
interface UserProfile {
  name: string;
  email: string;
  user_id: string;
}

// This interface now correctly matches the API response for an event
interface EventData {
  id: string;
  event_name: string;
  date: string;
  event_address: string;
  category: string;
  price: string;
  picture?: string;
}

type EventStatus = 'live' | 'upcoming' | 'ended';

// --- UI Sub-components ---

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:border-white/20 transition-all duration-300 group"
  >
    <div className="flex justify-between items-start">
      <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors uppercase tracking-wider">{title}</p>
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${colorClass} group-hover:scale-110 transition-transform shadow-inner`}>{icon}</div>
    </div>
    <p className="text-4xl font-bold text-white mt-4 tracking-tighter">{value}</p>
  </motion.div>
);

const EventCard = ({ event, status }: { event: EventData, status: EventStatus }) => {
  const router = useRouter();
  const handleEventClick = () => {
    if (status !== 'ended') {
      router.push(`/registration?eventId=${event.id}`);
    }
  };

  const statusStyles = {
    live: 'bg-red-500/20 text-red-400 border-red-500/30',
    upcoming: 'bg-green-500/20 text-green-400 border-green-500/30',
    ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)' }}
      onClick={handleEventClick}
      className={`rounded-2xl overflow-hidden bg-black/30 border border-white/10 shadow-lg group transition-all duration-300 flex flex-col ${status !== 'ended' ? 'cursor-pointer hover:border-white/30 hover:shadow-2xl' : 'opacity-60'}`}
    >
      <div className="relative w-full h-48">
        <img src={event.picture ? (event.picture.startsWith("http") ? event.picture : `${process.env.NEXT_PUBLIC_API_URL}/${event.picture}`) : 'https://placehold.co/400x300/1a1a1a/ffffff?text=Event'} alt={event.event_name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-xs text-purple-400 font-semibold mb-1">{event.category}</p>
          <h3 className="font-bold text-white mb-2 truncate" title={event.event_name}>{event.event_name}</h3>
          <p className="text-sm text-gray-400 flex items-center gap-2 truncate" title={event.event_address}><MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" /> {event.event_address}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
          <p className="text-lg font-bold text-white">{parseFloat(event.price) > 0 ? `₦${parseFloat(event.price).toLocaleString()}` : 'Free'}</p>
          <span className="text-sm text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <div className="h-10 w-64 bg-gray-700/50 rounded-lg"></div>
        <div className="h-4 w-48 bg-gray-700/50 rounded-lg mt-3"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-700/50"></div>
        <div className="w-32 h-10 bg-gray-700/50 rounded-full"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-gray-700/50 rounded-2xl"></div>)}
    </div>
    <div>
      <div className="h-8 w-48 bg-gray-700/50 rounded-lg mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="h-56 bg-gray-700/50 rounded-2xl"></div>)}
      </div>
    </div>
  </div>
);

// --- Main Dashboard Component ---

export default function AttendeeDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<EventData[]>([]);


  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const hasBrand = parsedData?.brandname && String(parsedData.brandname).trim() !== '';
        if (parsedData && parsedData.user_id && !hasBrand) {
          setUserData(parsedData);
        } else if (hasBrand) {
          router.push('/dashboard/creator');
        } else {
          router.push('/auth/signin');
        }
      } catch (e) {
        router.push('/auth/signin');
      }
    } else {
      router.push('/auth/signin');
    }
  }, [router]);
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  const fetchInitialData = useCallback(async () => {
    if (!userData) return;
    setIsLoading(true);
    setError(null);
    try {
      const interestsUrl = `${url}/user/interestedEvents`;
      const allEventsUrl = `${url}/event/getAllEvent`;

      // Fetch both user interests and all events at the same time
      const [interestsResponse, eventsResponse] = await Promise.all([
        axios.get(interestsUrl),
        axios.get(allEventsUrl)
      ]);

      // Safely parse interests, defaulting to an empty array
      const responseData = interestsResponse.data;
      const interestsData = responseData?.interests;
      let interestsArray = [];
      if (interestsData) {
        try {
          interestsArray = typeof interestsData === 'string' ? JSON.parse(interestsData) : interestsData;
        } catch (e) {
          interestsArray = interestsData;
        }
      } else if (Array.isArray(responseData)) {
        // If it returns events directly, perhaps extract unique categories?
        interestsArray = Array.from(new Set(responseData.map(r => r.category).filter(Boolean)));
      }
      setUserInterests(interestsArray); const events = eventsResponse.data?.event || [];
      setAllEvents(events);

    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      setError("Could not load your event data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchInitialData();
    }
  }, [userData, fetchInitialData]);

  const getEventStatus = (eventDate: string): EventStatus => {
    const now = new Date();
    const date = new Date(eventDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (eventDay < today) return 'ended';
    if (eventDay.getTime() === today.getTime()) return 'live';
    return 'upcoming';
  };

  // This logic now filters all events based on the user's interests
  const { } = useMemo(() => {
    // if (!userInterests.length) {
    //     return { upcomingEvents: [], attendedEvents: [] };
    // }

    const upcoming = allEvents.filter(e => getEventStatus(e.date) !== 'ended').slice(0, 5);
    const attended = allEvents.filter(e => getEventStatus(e.date) === 'ended').slice(0, 5);
    setUpcomingEvents(upcoming)
    setAttendedEvents(attended)
    return { upcoming, attended };
  }, [allEvents, userInterests]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 mb-12 shadow-2xl"
        >
          {/* Background Decorative Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-md opacity-30 animate-pulse" />
                <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                  My Dashboard
                </h1>
                <p className="text-gray-400 mt-2 text-lg font-medium">
                  Welcome back, <span className="text-purple-400">{userData.name}</span>!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
              <button onClick={() => router.push('/interest')} className="group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                <Heart className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Interests</span>
              </button>
              <button onClick={() => router.push('/update')} className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all hover:-translate-y-1 w-full sm:w-auto">
                <UserCog className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
              <button onClick={() => router.push('/explore')} className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold border border-emerald-400/50 shadow-[0_0_20px_rgba(10,185,129,0.3)] hover:shadow-[0_0_30px_rgba(10,185,129,0.5)] transition-all hover:-translate-y-1 w-full sm:w-auto">
                <Compass className="w-5 h-5" />
                <span>Explore</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
          <StatCard title="Events Attended" value={attendedEvents.length.toString()} icon={<CheckCircle />} colorClass="text-blue-400" />
          <StatCard title="Upcoming For You" value={upcomingEvents.length.toString()} icon={<Calendar />} colorClass="text-green-400" />
          <StatCard title="Favorite Category" value={userInterests[0] || 'N/A'} icon={<TrendingUp />} colorClass="text-purple-400" />
          <StatCard title="Tickets" value="View All" icon={<Ticket />} colorClass="text-orange-400" />
        </motion.div>

        {error && <div className="text-center py-4 my-4 bg-red-500/20 text-red-300 rounded-lg flex items-center justify-center gap-2"><AlertCircle /> {error}</div>}

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Upcoming For You</h2>
          {upcomingEvents.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {upcomingEvents.map((event) => <EventCard key={event.id} event={event} status={getEventStatus(event.date)} />)}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-black/20 border border-white/10 rounded-2xl">
              <Compass className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold">No upcoming events match your interests.</h3>
              <p className="text-gray-400 mt-2">Why not explore what's out there?</p>
              <button onClick={() => router.push('/explore')} className="mt-4 bg-purple-600 px-5 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors">Explore Events</button>
            </div>
          )}
        </div>

        {/* Event History */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Your Event History</h2>
          {attendedEvents.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {attendedEvents.map((event) => <EventCard key={event.id} event={event} status={getEventStatus(event.date)} />)}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 py-10">Your event history is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
