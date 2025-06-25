"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../component/Header";
// import EventCard from "../../component/EventCard"; // Commented out properly

const categories = [
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

const sampleEvents = {
  upcoming: [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      location: "Central Park, NYC",
      date: "July 15-17, 2024",
      time: "6:00 PM",
      image: "🎸",
      price: "From $89",
      attendees: "12.5K going",
      category: "Music & Concerts",
      status: "upcoming" as const,
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      location: "San Francisco, CA",
      date: "August 5, 2024",
      time: "9:00 AM",
      image: "💻",
      price: "From $150",
      attendees: "3.2K going",
      category: "Technology",
      status: "upcoming" as const,
    },
    {
      id: 3,
      title: "Comedy Night Spectacular",
      location: "Los Angeles, CA",
      date: "June 28, 2024",
      time: "8:00 PM",
      image: "🎭",
      price: "From $35",
      attendees: "800 going",
      category: "Comedy",
      status: "upcoming" as const,
    },
    {
      id: 4,
      title: "Basketball Championship",
      location: "Madison Square Garden, NYC",
      date: "July 20, 2024",
      time: "7:30 PM",
      image: "🏀",
      price: "From $120",
      attendees: "18K going",
      category: "Sports",
      status: "upcoming" as const,
    },
  ],
  live: [
    {
      id: 5,
      title: "Jazz Night Live",
      location: "Blue Note, NYC",
      date: "Today",
      time: "Live Now",
      image: "🎷",
      price: "From $45",
      attendees: "200 watching",
      category: "Music & Concerts",
      status: "live" as const,
    },
    {
      id: 6,
      title: "Food Festival Downtown",
      location: "Downtown Plaza",
      date: "Today",
      time: "Live Now",
      image: "🍕",
      price: "Free Entry",
      attendees: "1.5K attending",
      category: "Food & Drink",
      status: "live" as const,
    },
  ],
  past: [
    {
      id: 7,
      title: "Spring Art Exhibition",
      location: "Modern Art Museum",
      date: "May 15, 2024",
      time: "Ended",
      image: "🎨",
      price: "Was $25",
      attendees: "5K attended",
      category: "Theater & Arts",
      status: "past" as const,
    },
    {
      id: 8,
      title: "Rock Concert 2024",
      location: "Stadium Arena",
      date: "April 20, 2024",
      time: "Ended",
      image: "🎸",
      price: "Was $95",
      attendees: "25K attended",
      category: "Music & Concerts",
      status: "past" as const,
    },
    {
      id: 9,
      title: "Family Fun Day",
      location: "City Park",
      date: "March 10, 2024",
      time: "Ended",
      image: "🎠",
      price: "Was Free",
      attendees: "2K attended",
      category: "Family & Kids",
      status: "past" as const,
    },
  ],
};

const EventCard = ({
  id,
  title,
  location,
  date,
  time,
  image,
  price,
  attendees,
  category,
  status,
  onGetTicket,
}: {
  id: number;
  title: string;
  location: string;
  date: string;
  time?: string;
  image: string;
  price: string;
  attendees: string;
  category: string;
  status: "upcoming" | "live" | "past";
  onGetTicket: () => void;
}) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 transition rounded-lg p-4 text-white shadow-lg">
      <div>
        <div className="text-5xl">{image}</div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        <p className="text-sm text-gray-300">{location}</p>
        <p className="text-sm">
          {date} • {time}
        </p>
        <p className="text-yellow-400 font-medium mt-1">{price}</p>
        <p className="text-xs text-gray-400">{attendees}</p>
      </div>
      {status !== "past" && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onGetTicket}
            className="px-4 py-2 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
            Get Ticket
          </button>
        </div>
      )}
    </div>
  );
};

const InterestSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "past">("upcoming");
  const router = useRouter();

  const handleEventClick = (eventId: number) => {
    router.push("/registration"); // Optionally: `/registration/${eventId}`
  };

  const filterEventsByCategory = (
    events: Array<{
      id: number;
      title: string;
      location: string;
      date: string;
      time?: string;
      image: string;
      price: string;
      attendees: string;
      category: string;
      status: "upcoming" | "live" | "past";
    }>
  ) => {
    if (selectedCategory === "All Categories") return events;
    return events.filter((event) => event.category === selectedCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header isSignedIn={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {["upcoming", "live", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "upcoming" | "live" | "past")}
              className={`py-2 text-center text-sm font-medium ${
                activeTab === tab
                  ? tab === "live"
                    ? "bg-red-600 text-white"
                    : tab === "past"
                    ? "bg-gray-600 text-white"
                    : "bg-yellow-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab === "upcoming" ? "Upcoming" : tab === "live" ? "Live Now" : "Past Events"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterEventsByCategory(sampleEvents[activeTab]).map((event) => (
            <EventCard key={event.id} {...event} onGetTicket={() => handleEventClick(event.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterestSelection;
