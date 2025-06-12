'use client';

import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Edit,
  Trash2
} from "lucide-react";

type EventStatus = 'published' | 'draft' | 'ended';

const mockEvents = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    date: '2024-07-15',
    time: '09:00 AM',
    location: 'Convention Center',
    attendees: 245,
    maxAttendees: 300,
    revenue: 12250,
    status: 'published' as EventStatus,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Music Festival',
    date: '2024-08-20',
    time: '06:00 PM',
    location: 'City Park',
    attendees: 1200,
    maxAttendees: 1500,
    revenue: 48000,
    status: 'published' as EventStatus,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Art Exhibition',
    date: '2024-06-30',
    time: '02:00 PM',
    location: 'Art Gallery',
    attendees: 0,
    maxAttendees: 100,
    revenue: 0,
    status: 'draft' as EventStatus,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  }
];

export default function CreatorDashboard() {
  const totalRevenue = mockEvents.reduce((sum, event) => sum + event.revenue, 0);
  const totalAttendees = mockEvents.reduce((sum, event) => sum + event.attendees, 0);
  const publishedEvents = mockEvents.filter(event => event.status === 'published').length;

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: EventStatus): string => {
    switch (status) {
      case 'published': return 'Live';
      case 'draft': return 'Draft';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your events and track performance</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg shadow bg-blue-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-blue-700">Total Revenue</p>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-green-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-green-700">Total Attendees</p>
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{totalAttendees.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">+18% from last month</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-purple-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-purple-700">Active Events</p>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{publishedEvents}</p>
          <p className="text-xs text-purple-600 mt-1">Events currently live</p>
        </div>
      </div>

      {/* Events List */}
      <div className="rounded-lg shadow p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Your Events</h2>
        <div className="space-y-4">
          {mockEvents.map(event => (
            <div key={event.id} className="flex items-center gap-4 p-4 border rounded hover:shadow transition">
              <img src={event.image} alt={event.title} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded text-white ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Attendees</p>
                <p className="text-lg font-semibold">{event.attendees}/{event.maxAttendees}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-lg font-semibold">${event.revenue.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:underline flex items-center text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="text-red-600 hover:underline flex items-center text-sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
