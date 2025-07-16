'use client';

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { Calendar, Clock, MapPin, Ticket, TrendingUp, Users, Star, CheckCircle } from "lucide-react";

// Define the structure for the user data we expect from localStorage
interface UserData {
=======
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
>>>>>>> 0e06c72388c013d9beef6a27ad9fcb0e3e23a211
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

<<<<<<< HEAD
// --- MOCK DATA (In a real app, this would be fetched from an API) ---
const attendedEvents: AttendedEvent[] = [
  { id: '1', title: 'Summer Music Festival', date: '2024-05-15', location: 'Central Park, NYC', category: 'Music', rating: 5 },
  { id: '2', title: 'Tech Innovation Summit', date: '2024-04-20', location: 'Convention Center', category: 'Tech', rating: 4 },
  { id: '3', title: 'Modern Art Exhibition', date: '2024-03-30', location: 'Metropolitan Museum', category: 'Art', rating: 5 }
];

const upcomingEvents: UpcomingEvent[] = [
  { id: '4', title: 'Food & Wine Tasting', date: '2024-09-10', time: '07:00 PM', location: 'Rooftop Restaurant', ticketType: 'VIP', price: 120, category: 'Food' },
  { id: '5', title: 'Basketball Championship', date: '2024-07-25', time: '08:00 PM', location: 'Sports Arena', ticketType: 'General', price: 85, category: 'Sports' }
];
// --- END MOCK DATA ---
=======
// --- UI Sub-components ---

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg"
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className={`p-2 rounded-full bg-gray-800/50 ${colorClass}`}>{icon}</div>
        </div>
        <p className="text-4xl font-bold text-white mt-4">{value}</p>
    </motion.div>
);

const EventCard = ({ event, status }: { event: EventData, status: EventStatus }) => {
    const router = useRouter();
    const handleEventClick = () => {
        if (status !== 'ended') {
            router.push(`/registration?eventId=${event.id}`);
        }
    };
>>>>>>> 0e06c72388c013d9beef6a27ad9fcb0e3e23a211

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
            <div className="relative w-full h-40">
                <img src={event.picture ? `https://app.samdavweb.org.ng/${event.picture}` : 'https://placehold.co/400x300/1a1a1a/ffffff?text=Event'} alt={event.event_name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
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

<<<<<<< HEAD
  const getCategoryColor = (category: string) => {
    const colors = {
      Music: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Tech: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Art: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Sports: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
=======
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
        if (parsedData && parsedData.user_id) {
          setUserData(parsedData);
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
  const url = process.env.NEXT_PUBLIC_API_URL
  const fetchInitialData = useCallback(async () => {
    if (!userData) return;
    setIsLoading(true);
    setError(null);
    try {
        const interestsUrl = `${url}user/events/${userData.user_id}`;
        const allEventsUrl = `${url}event/getAllEvent`;

        // Fetch both user interests and all events at the same time
        const [interestsResponse, eventsResponse] = await Promise.all([
            axios.get(interestsUrl),
            axios.get(allEventsUrl)
        ]);

        // Safely parse interests, defaulting to an empty array
        const interestsData = interestsResponse.data?.interests;
        const interestsArray = interestsData ? JSON.parse(interestsData) : [];
        setUserInterests(interestsArray);

        const events = eventsResponse.data?.event || [];
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
>>>>>>> 0e06c72388c013d9beef6a27ad9fcb0e3e23a211
  };

  // This logic now filters all events based on the user's interests
  const {} = useMemo(() => {
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

  const router = useRouter();

  return (
<<<<<<< HEAD
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {userData.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            {/* Display the user's name and email dynamically */}
            <div className="font-semibold text-foreground">{userData.name}</div>
            <div className="text-sm text-muted-foreground">{userData.email}</div>
=======
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {userData.name}!</p>
>>>>>>> 0e06c72388c013d9beef6a27ad9fcb0e3e23a211
          </div>
          <div className="flex items-center gap-3">
                <button onClick={() => router.push('/interest')} className="flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full font-semibold hover:bg-purple-500/20 hover:text-white transition-colors">
                    <Heart className="w-4 h-4"/> My Interests
                </button>
                <button onClick={() => router.push('/update')} className="flex items-center gap-2 bg-yellow-500/70 text-white-300 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500/85 hover:text-white transition-colors">
                    <UserCog className="w-4 h-4"/> Edit Profile
                </button>
                <button onClick={() => router.push('/explore')} className="flex items-center gap-2 bg-green-500/10 text-green-300 px-4 py-2 rounded-full font-semibold hover:bg-green-500/20 hover:text-white transition-colors">
                    <Compass className="w-4 h-4"/> Explore
                </button>

                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50">
                  <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50">
                 <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                </div>
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

        {error && <div className="text-center py-4 my-4 bg-red-500/20 text-red-300 rounded-lg flex items-center justify-center gap-2"><AlertCircle/> {error}</div>}

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Upcoming For You</h2>
          {upcomingEvents.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
              {upcomingEvents.map((event) => <EventCard key={event.id} event={event} status={getEventStatus(event.date)} />)}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-black/20 border border-white/10 rounded-2xl">
                <Compass className="w-12 h-12 mx-auto text-gray-500 mb-4"/>
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
