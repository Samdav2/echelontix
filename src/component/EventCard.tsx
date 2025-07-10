import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  time?: string;
  image: string;
  price: string;
  attendees: string;
  category: string;
  status: 'upcoming' | 'live' | 'past';
}

const EventCard = ({
  title,
  location,
  date,
  time,
  image,
  price,
  attendees,
  category,
  status,
}: EventCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        );
      case 'past':
        return (
          <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            PAST
          </span>
        );
      default:
        return null;
    }
  };

  const getButtonStyle = () => {
    if (status === 'past') {
      return 'bg-gray-600 hover:bg-gray-700 text-gray-300 cursor-not-allowed';
    } else if (status === 'live') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    } else {
      return 'bg-purple-600 hover:bg-purple-700 text-white';
    }
  };

  const getButtonText = () => {
    if (status === 'past') return 'Event Ended';
    if (status === 'live') return 'Join Now';
    return 'Get Tickets';
  };

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm border border-white-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer relative ${
        status === 'past' ? 'opacity-70' : ''
      }`}
    >
      {getStatusBadge()}
      <div className="p-6">
        <div className="text-4xl mb-4 text-center">{image}</div>

        <div className="mb-2">
          <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{date}</span>
          </div>
          {time && (
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{time}</span>
            </div>
          )}
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{attendees}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-purple-400 font-semibold text-lg">{price}</span>
          <button
            className={`px-4 py-2 rounded transition-all duration-300 ${getButtonStyle()}`}
            disabled={status === 'past'}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
