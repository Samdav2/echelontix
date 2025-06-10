"use client";

import React, { useState } from 'react';

const TicketValidation = () => {
  const [ticketCode, setTicketCode] = useState("220403736");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">🎫 Ticket Validation</h2>

        <input
          type="text"
          value={ticketCode}
          disabled
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 text-center font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-200">
            ✅ Validate & Date
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-800 text-yellow-400 font-semibold rounded-lg transition-all duration-200">
            📷 Scan QR Code
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl text-yellow-400 p-5 text-sm space-y-2 shadow-inner">
          <p><strong>Status:</strong> Token Verified Successfully</p>
          <p><strong>Attendee:</strong> Akanji Taiwo</p>
          <p><strong>Email:</strong> akanjitaiwo2222@gmail.com</p>
          <p><strong>Event:</strong> Lasu food festival</p>
          <p><strong>Location:</strong> First Gate, off 23, lala</p>
          <p><strong>Date:</strong> 1/31/2025</p>
        </div>

        <p className="text-center text-green-600 font-medium">
          ✅ Ticket Code Verified & Deleted Successfully!
        </p>
      </div>
    </div>
  );
};

export default TicketValidation;
