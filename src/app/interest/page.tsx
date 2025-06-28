'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  MapPin,
  AlertCircle,
  Compass,
  Check,
  PlusCircle,
  Loader2,
  X,
  Dribbble, // Icon for Sports
  Music,    // Icon for Music
  Cpu,      // Icon for Technology
  Paintbrush2, // Icon for Art
  Disc2,    // Icon for Rave
  Gamepad2, // Icon for Gaming
  Shirt,    // Icon for Fashion
  Utensils, // Icon for Food
  Users     // Icon for Meet & Greet
} from "lucide-react";

// --- Data & Type Definitions ---

const availableInterests = [
    { key: "sports", name: "Sports", description: "Activities involving physical exertion and skill.", icon: <Dribbble /> },
    { key: "music", name: "Music", description: "Art of arranging sounds in time to produce a composition.", icon: <Music /> },
    { key: "technology", name: "Technology", description: "Application of scientific knowledge for practical purposes.", icon: <Cpu /> },
    { key: "art", name: "Art", description: "Expression or application of human creative skill and imagination.", icon: <Paintbrush2 /> },
    { key: "Rave", name: "Rave", description: "A large dance party featuring DJ performances.", icon: <Disc2 /> },
    { key: "gaming", name: "Gaming", description: "The action or practice of playing video games.", icon: <Gamepad2 /> },
    { key: "fashion", name: "Fashion", description: "A popular trend, especially in styles of dress.", icon: <Shirt /> },
    { key: "food", name: "Food", description: "Any nutritious substance that people or animals eat or drink.", icon: <Utensils /> },
    { key: "Meet&Greet", name: "Meet & Greet", description: "An informal event where people can meet others.", icon: <Users /> }
];

interface UserData {
  userID: string;
  name: string;
}

interface EventData {
  id: string;
  event_name: string;
  date: string;
  time_in: string;
  event_address: string;
  price: string;
  category: string;
  picture?: string;
}

type EventStatus = 'live' | 'upcoming' | 'ended';

// --- UI Sub-components ---

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
            layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={handleEventClick}
            className={`rounded-2xl overflow-hidden bg-black/30 border border-white/10 shadow-lg group transition-all duration-300 ${status !== 'ended' ? 'cursor-pointer hover:border-white/30 hover:shadow-2xl hover:-translate-y-1' : 'opacity-60'}`}
        >
            <div className="relative w-full h-48">
                <img src={event.picture ? `https://app.samdavweb.org.ng/${event.picture}` : 'https://placehold.co/400x300/1a1a1a/ffffff?text=Event'} alt={event.event_name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border ${statusStyles[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-purple-400 font-semibold mb-1">{event.category}</p>
                <h3 className="font-bold text-white text-lg mb-2 truncate">{event.event_name}</h3>
                <div className="text-sm text-gray-400 space-y-1">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    <p className="flex items-center gap-2 truncate"><MapPin className="w-4 h-4 text-gray-500" /> {event.event_address}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                    <p className="text-lg font-bold text-white">{parseFloat(event.price) > 0 ? `₦${parseFloat(event.price).toLocaleString()}` : 'Free'}</p>
                    <button disabled={status === 'ended'} className="text-sm font-semibold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Get Ticket
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const SkeletonCard = () => (
    <div className="rounded-2xl bg-black/30 border border-white/10 p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-700/50 rounded-lg"></div>
        <div className="mt-4 space-y-3">
            <div className="h-3 w-1/4 bg-gray-700/50 rounded"></div>
            <div className="h-5 w-3/4 bg-gray-700/50 rounded"></div>
            <div className="h-4 w-full bg-gray-700/50 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-700/50 rounded"></div>
        </div>
    </div>
);

const InterestModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: () => void }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInterestToggle = (interestName: string) => {
        setSelectedInterests(prev =>
            prev.includes(interestName)
                ? prev.filter(item => item !== interestName)
                : [...prev, interestName]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const storedUserData = localStorage.getItem('userData');
            if (!storedUserData) {
                throw new Error("User not found. Please log in again.");
            }
            const parsedData = JSON.parse(storedUserData);

            // Get user_id from localStorage as requested
            const userId = parsedData.user_id || parsedData.userID || parsedData.profile?.user_id;

            if (!userId) {
                throw new Error("User ID is missing from your session. Please log in again.");
            }

            const url = process.env.NEXT_PUBLIC_ADD_USER_INTERESTS!;
            await axios.post(url, {
                user_id: userId,
                interests: selectedInterests,
            });
            onSave(); // This will trigger a re-fetch on the main page
            onClose();
        } catch (err: any) {
            console.error("Failed to save interests:", err);
            setError(err.response?.data?.message || err.message || "Could not save your interests. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-gray-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    >
                        <header className="p-6 flex justify-between items-center border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Select Your Interests</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X /></button>
                        </header>
                        <div className="p-6 overflow-y-auto">
                            <p className="text-gray-400 mb-6">Choose topics that you're passionate about to get personalized event suggestions.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableInterests.map(interest => {
                                    const isSelected = selectedInterests.includes(interest.name);
                                    return (
                                        <motion.div
                                            key={interest.key}
                                            onClick={() => handleInterestToggle(interest.name)}
                                            className={`p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${isSelected ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-2xl ${isSelected ? 'text-purple-400' : 'text-gray-500'}`}>{interest.icon}</span>
                                                    <h4 className="font-semibold text-white">{interest.name}</h4>
                                                </div>
                                                {isSelected && <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">{interest.description}</p>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                        <footer className="p-6 mt-auto border-t border-white/10">
                            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
                            <button
                                onClick={handleSave}
                                disabled={isSaving || selectedInterests.length === 0}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : "Save Interests"}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export default function EventSuggestionsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [suggestedEvents, setSuggestedEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            if (parsedData && (parsedData.userID || parsedData.user_id)) {
                setUserData(parsedData);
            } else {
                router.push('/auth/signin');
            }
        } else {
            router.push('/auth/signin');
        }
    }, [router]);

    useEffect(() => {
        if (userData) {
            fetchSuggestedEvents();
        }
    }, [userData]);

    const fetchSuggestedEvents = async () => {
        if (!userData) return;

        // Get the user ID, checking for both possible keys
        const userId = userData.user_id || userData.userID;
        if (!userId) {
            setError("User ID not found.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const url = `${process.env.NEXT_PUBLIC_GET_USER_INTERESTED_EVENTS!}${userId}`;
            const response = await axios.get(url);

            if (response.data && Array.isArray(response.data.events)) {
                setSuggestedEvents(response.data.events);
            } else {
                setSuggestedEvents([]);
            }
        } catch (err) {
            console.error("Failed to fetch suggested events:", err);
            setError("Could not load your event suggestions.");
        } finally {
            setIsLoading(false);
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

    return (
        <>
            <InterestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchSuggestedEvents}
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 mt-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-12 gap-4"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Events For You</h1>
                            <p className="text-gray-400 mt-2">Discover events tailored to your interests.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full font-semibold hover:bg-white/20 transition-colors flex-shrink-0"
                        >
                            <PlusCircle className="w-5 h-5 text-purple-400" />
                            Update Interests
                        </motion.button>
                    </motion.div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-400 flex flex-col items-center gap-2">
                            <AlertCircle />
                            <p>{error}</p>
                            <button onClick={fetchSuggestedEvents} className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Try Again</button>
                        </div>
                    ) : suggestedEvents.length === 0 ? (
                        <div className="text-center py-20 bg-black/20 border border-white/10 rounded-2xl">
                            <Compass className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Nothing to see here... yet!</h3>
                            <p className="text-gray-400 mb-6">Update your interests to get personalized event suggestions.</p>
                            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transform transition-transform">
                                Select Your Interests
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial="hidden" animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                           <AnimatePresence>
                               {suggestedEvents.map(event => (
                                   <EventCard key={event.id} event={event} status={getEventStatus(event.date)} />
                               ))}
                           </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
