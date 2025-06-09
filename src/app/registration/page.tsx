import React from "react";

const EventForm: React.FC = () => {
  return (
   <section
  className="w-full min-h-screen bg-cover bg-center bg-no-repeat text-white relative"
  style={{ backgroundImage: "url('/assets/dj-deck.svg')" }}
>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-10 items-center justify-between">
        
        {/* Left: Event Info */}
        <div className="text-white max-w-lg space-y-6">
          <img src="/assets/lasu-food.svg" alt="Event Flyer" className="w-72 border-4 border-orange-500" />
          <div className="space-y-2">
            <p className="text-4xl font-extrabold">30 <span className="text-lg block">JUNE 2025</span></p>
            <p className="text-sm uppercase">Entry at 8:30 PM</p>
            <p className="text-sm">Venue: Buba Maruwa Open Space, Lagos State University</p>
            <div className="mt-4">
              <p className="font-semibold">DJ Sessions</p>
              <ul className="text-sm list-disc list-inside">
                <li>John Doe</li>
                <li>John Doe</li>
                
              </ul>    
            </div>
          
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="bg-[#1f1f1f] bg-opacity-90 p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h2 className="text-xl font-bold text-center uppercase mb-1">Event Registration Form</h2>
          <p className="text-sm text-center text-gray-300 mb-6">Attendee Information</p>
          <form className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First Name"
                className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-1/2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" className="accent-yellow-500" /> Male
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" className="accent-yellow-500" /> Female
              </label>
            </div>
            <select
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 focus:outline-none"
            >
              <option>Select a Ticket to purchase</option>
              <option>Regular - ₦1,000</option>
              <option>VIP - ₦5,000</option>
            </select>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EventForm;