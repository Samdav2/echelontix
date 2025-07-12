"use client";

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  time?: string;
  image: string;
  price: string;
  attendees: number;
  category: string;
  status: 'upcoming' | 'live' | 'past';
}

const EventCard = ({ title, location, date, time, image, price, status, category }: EventCardProps) => {
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
    if (status === 'past') return 'bg-gray-600 hover:bg-gray-700 text-gray-300 cursor-not-allowed';
    if (status === 'live') return 'bg-red-600 hover:bg-red-700 text-white';
    return 'bg-yellow-400 hover:bg-yellow-500 text-black font-semibold';
  };

  const getButtonText = () => {
    if (status === 'past') return 'Event Ended';
    if (status === 'live') return 'Join Now';
    return 'Get Tickets';
  };

  const placeholderImg = "https://placehold.co/180x280/1a1a1a/ffffff?text=Event";

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative w-[240px] h-[380px] flex flex-col ${status === 'past' ? 'opacity-70' : ''}`}> 
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
        <span className="text-xs text-black bg-yellow-400 font-semibold px-2 py-1 rounded-full self-start mb-2">{category}</span>
        <h3 className="text-md font-semibold text-white mb-2 flex-grow">{title}</h3>
        <div className="space-y-1 mb-3 text-xs text-gray-300">
          <div className="flex items-center"><MapPin className="w-3 h-3 mr-2 flex-shrink-0" /><span>{location}</span></div>
          <div className="flex items-center"><Calendar className="w-3 h-3 mr-2 flex-shrink-0" /><span>{date}</span></div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700">
          <span className="text-yellow-400 font-semibold text-lg">{parseFloat(price) > 0 ? `N${price}` : 'Free'}</span>
          <button className={`px-3 py-1.5 text-xs rounded transition-all duration-300 ${getButtonStyle()}`} disabled={status === 'past'}>{getButtonText()}</button>
        </div>
      </div>
    </div>
  );
};

interface EventFromAPI {
  id: number;
  event_name: string;
  picture: string;
  event_address: string;
  category: string;
  date: string;
  time_in: string;
  price: string;
}

type EventsByCategory = {
  [category: string]: EventCardProps[];
};

const predefinedCategories = ["Concert", "Party"];

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [events, setEvents] = useState<EventsByCategory>({});
  const [categories, setCategories] = useState<string[]>(["All", ...predefinedCategories]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const url = process.env.NEXT_PUBLIC_GET_ALL_EVENT!;
        const response = await axios.get(url);
        const apiEvents: EventFromAPI[] = response.data.event;
        const processedEvents: EventsByCategory = {};
        const uniqueApiCategories = new Set<string>();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const event of apiEvents) {
          const eventDate = new Date(event.date);
          const eventDayOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

          let status: 'upcoming' | 'live' | 'past' = 'upcoming';
          if (eventDayOnly < today) status = 'past';
          else if (eventDayOnly.getTime() === today.getTime()) status = 'live';

          const eventCategory = event.category || "General";

          const cardData: EventCardProps = {
            id: event.id,
            title: event.event_name,
            location: event.event_address,
            date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: event.time_in,
            image: event.picture,
            price: event.price,
            attendees: 0,
            category: eventCategory,
            status: status,
          };

          if (!processedEvents[eventCategory]) processedEvents[eventCategory] = [];
          processedEvents[eventCategory].push(cardData);
          uniqueApiCategories.add(eventCategory);
        }

        const allCategories = ["All", ...Array.from(new Set([...predefinedCategories, ...uniqueApiCategories]))];
        processedEvents["All"] = Object.values(processedEvents).flat();

        setEvents(processedEvents);
        setCategories(allCategories);
        setActiveCategory("All");
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: number, status: 'upcoming' | 'live' | 'past') => {
    if (status !== 'past') window.location.href = `/registration?eventId=${eventId}`;
  };

  const login = () => window.location.href = "/auth/signin";
  const Register = () => window.location.href = "/choose-role";

  return (
    <main className="w-full bg-black text-white font-sans">
      <section className="relative w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-20 pb-4 bg-black">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">ECHELONTIX</h1>
          <p className="text-lg mb-6">Your trusted partner in innovation and event management.</p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all" onClick={login}>Log in</button>
            <button className="text-white border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all" onClick={Register}>Register</button>
          </div>
        </div>
        <div className="relative mt-10 lg:mt-0 w-80 h-80">
          <img src="/assets/booth.png" alt="Tickets Booth" className="absolute inset-0 w-full h-full object-contain" />
        </div>
      </section>

      <section className="bg-black text-white pt-8 pb-16 px-4">
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 text-sm font-semibold rounded-full transition ${activeCategory === cat ? "bg-yellow-400 text-black" : "bg-gray-800 hover:bg-gray-700"}`}>{cat}</button>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{activeCategory}</h2>
          <div className="mt-1 h-1 w-12 bg-yellow-400 mx-auto rounded" />
        </div>

        {isLoading ? (
          <div className="text-center">Loading Events...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {events[activeCategory]?.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event.id, event.status)}>
                <EventCard {...event} />
              </div>
            ))}
            {(!events[activeCategory] || events[activeCategory].length === 0) && !isLoading && (
              <p>No events found in this category.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default LandingPage;
