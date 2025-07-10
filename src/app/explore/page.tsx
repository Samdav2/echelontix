"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Calendar, MapPin, Search, User } from "lucide-react";

// --- Header Component ---
const Header: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">ECHELONTIX</h1>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
             <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
             <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Events</a>
             <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-gray-400 hover:text-white">
              <Search className="h-6 w-6" />
            </button>
            {isSignedIn && (
              <button className="ml-4 p-2 text-gray-400 hover:text-white">
                <User className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


// --- Event Card Component ---
interface EventCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  image: string;
  price: string;
  category: string;
  status: 'upcoming' | 'live' | 'past';
}

const EventCard = ({
  id,
  title,
  location,
  date,
  image,
  price,
  category,
  status,
}: EventCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (status !== 'past') {
      router.push(`/registration?eventId=${id}`);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse z-10">LIVE</span>;
      case 'past':
        return <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full z-10">PAST</span>;
      default:
        return null;
    }
  };

  const getButtonStyle = () => {
    if (status === 'past') return 'bg-gray-600 text-gray-300 cursor-not-allowed';
    if (status === 'live') return 'bg-red-600 text-white';
    return 'bg-purple-600 text-white';
  };

  const getButtonText = () => {
    if (status === 'past') return 'Event Ended';
    if (status === 'live') return 'Join Now';
    return 'Get Tickets';
  };

  const placeholderImg = "https://placehold.co/400x300/1a1a1a/ffffff?text=Event";

  return (
    <div
      onClick={handleCardClick}
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 group flex flex-col ${status !== 'past' ? 'cursor-pointer' : ''} ${status === 'past' ? 'opacity-60' : ''}`}
    >
      <div className="relative w-full h-40">
        {getStatusBadge()}
        <img
          src={image ? `https://app.samdavweb.org.ng/${image}` : placeholderImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = placeholderImg }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full self-start mb-2">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-white mb-3 flex-grow">{title}</h3>
        <div className="space-y-2 mb-4 text-sm text-gray-300">
          <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{location}</span></div>
          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" /><span>{date}</span></div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-700/50">
          <span className="text-purple-400 font-semibold text-lg">{price}</span>
          <button
            className={`px-4 py-2 text-sm font-semibold rounded transition-all duration-300 ${getButtonStyle()}`}
            disabled={status === 'past'}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- API Event Structure ---
type EventFromAPI = {
  id: number;
  event_name: string;
  picture: string;
  event_address: string;
  category: string;
  date: string;
  time_in: string;
  price: string;
};

// --- Main Page Component ---
const predefinedCategories = [
    "All Categories",
    "Music & Concerts",
    "Sports",
    "Theater & Arts",
    "Comedy",
    "Food & Drink",
    "Technology",
    "Family & Kids",
    "Nightlife",
];

const InterestSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "past">("upcoming");
  const [allEvents, setAllEvents] = useState<EventFromAPI[]>([]);
  const [categories, setCategories] = useState<string[]>(predefinedCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = process.env.NEXT_PUBLIC_GET_ALL_EVENT!;
        const response = await axios.get(url);

        const apiEvents: EventFromAPI[] = response.data.event || [];
        setAllEvents(apiEvents);

        const uniqueApiCategories = new Set<string>(apiEvents.map(e => e.category).filter(Boolean));
        const combinedCategories = new Set([...predefinedCategories, ...Array.from(uniqueApiCategories)]);
        setCategories(Array.from(combinedCategories));

      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Could not load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessEvents();
  }, []);

  const getEventStatus = (eventDate: string): 'upcoming' | 'live' | 'past' => {
    const now = new Date();
    const date = new Date(eventDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDayOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (eventDayOnly < today) return 'past';
    if (eventDayOnly.getTime() === today.getTime()) return 'live';
    return 'upcoming';
  };

  const filteredEvents = allEvents
    .map(event => ({
        ...event,
        status: getEventStatus(event.date)
    }))
    .filter(event => event.status === activeTab)
    .filter(event => selectedCategory === "All Categories" || event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header isSignedIn={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Explore Events</h1>
            <p className="text-gray-300">Discover amazing events happening around you</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[200px] bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="text-white bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 bg-gray-800 border border-gray-700 rounded overflow-hidden mb-6">
          {(["upcoming", "live", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-center text-sm font-medium transition-colors ${
                activeTab === tab
                  ? tab === "live"
                    ? "bg-red-600 text-white"
                    : tab === "past"
                    ? "bg-gray-600 text-white"
                    : "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center text-white py-10">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.event_name}
                location={event.event_address}
                date={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                time={event.time_in}
                image={event.picture}
                price={parseFloat(event.price) > 0 ? `N${parseFloat(event.price).toFixed(2)}` : 'Free'}
                category={event.category}
                status={event.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">No events found for this filter.</div>
        )}
      </div>
    </div>
  );
};

export default InterestSelection;
