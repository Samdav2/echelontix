"use client";

import Image from "next/image";
import React from "react";

const EventRegistrationPage = () => {
  return (
    <main className="min-h-screen w-full bg-black text-white font-sans relative overflow-hidden">
      {/* Background Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full">
        {/* Left - Event Poster */}
        <div className="relative h-[400px] lg:h-screen w-full">
          <Image
            src="/assets/lasu-food.svg"
            alt="Event Poster"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-10 left-10 w-60 h-60 bg-black bg-opacity-70 p-2 rounded shadow-lg">
            <Image
              src="/assets/lasu-food.svg"
              alt="Event Flyer"
              width={200}
              height={200}
              className="rounded"
            />
          </div>
        </div>

        {/* Right - Info and DJ List */}
        <div className="relative bg-black text-white p-8 lg:p-16 flex flex-col justify-center">
          <div className="text-5xl font-bold">30</div>
          <div className="text-2xl font-light">JUNE</div>
          <p className="mt-4 text-sm font-medium">
            ENTRY AT: 8:30 PM
            <br />
            VENUE: BUBA MARUWA OPEN SPACE, LAGOS STATE UNIVERSITY
          </p>

          <div className="mt-8">
            <p className="font-semibold text-yellow-400 uppercase">DJ Sessions</p>
            <ul className="text-sm mt-1 space-y-1">
              <li>- John Doe</li>
              <li>- John Doe</li>
              <li>- John Doe</li>
            </ul>

            <p className="mt-4 font-semibold text-yellow-400 uppercase">Special Guest</p>
            <ul className="text-sm mt-1 space-y-1">
              <li>- Demilade Dav</li>
              <li>- Samuel Dav</li>
            </ul>
          </div>

          <div className="mt-8 text-sm">Follow us on</div>
          <div className="flex space-x-3 mt-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Floating Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-800 to-black text-white p-8 rounded-lg shadow-2xl w-[90%] max-w-2xl z-10 border-t-4 border-yellow-400">
        <h2 className="text-xl font-bold text-center mb-1">EVENT REGISTRATION FORM</h2>
        <p className="text-center text-sm text-gray-300 mb-6">
          Attendee Information<br />Please fill the correct information
        </p>

        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
          />

          <div className="flex gap-4 items-center">
            <span className="text-sm">Gender:</span>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="gender" value="male" /> Male
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="gender" value="female" /> Female
            </label>
          </div>

          <select className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-sm">
            <option value="">Select a Ticket Type</option>
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
          </select>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-500 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default EventRegistrationPage;
