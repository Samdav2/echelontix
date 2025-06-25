'use client';

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Ticket, TrendingUp, Users, Star, CheckCircle } from "lucide-react";

// Define the structure for the user data we expect from localStorage
interface UserData {
  name: string;
  email: string;
  // Add any other user properties you expect, e.g., avatarUrl
}

interface AttendedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  rating?: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  price: number;
  category: string;
}

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


export default function AttendeeDashboard() {
  // State to hold the user data retrieved from localStorage
  const [userData, setUserData] = useState<UserData | null>(null);

  // useEffect runs once when the component mounts to get data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      // Parse the stored string back into a JavaScript object
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    }
  }, []); // The empty dependency array ensures this effect runs only once


  const getCategoryColor = (category: string) => {
    const colors = {
      'Music': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Tech': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Art': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Food': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  // Display a loading message while user data is being fetched from localStorage
  if (!userData) {
    return (
      <div className="p-6 text-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
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
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-lg shadow-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Events Attended</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{attendedEvents.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Upcoming Events</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{upcomingEvents.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Favorite Category</p>
              <p className="text-xl font-bold text-purple-700 dark:text-purple-300">Music</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="rounded-lg shadow-lg p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Spent</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">$485</p>
            </div>
            <Ticket className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="rounded-lg shadow-lg p-6 bg-white dark:bg-zinc-900 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {event.ticketType}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(event.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{event.time}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">${event.price}</div>
                    <div className="text-sm text-muted-foreground">Paid</div>
                  </div>
                  <button className="px-4 py-2 border rounded hover:bg-primary hover:text-white transition">View Ticket</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event History */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Event History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendedEvents.map((event) => (
            <div key={event.id} className="rounded-lg shadow-lg p-6 bg-white dark:bg-zinc-900 hover:shadow-xl transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <div className="flex items-center gap-1">{event.rating && renderStars(event.rating)}</div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(event.date).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Attended</span>
                  </div>
                  <button className="text-sm text-primary hover:text-white hover:bg-primary px-3 py-1 rounded">Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
