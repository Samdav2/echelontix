"use client"; // 👈 This line tells Next.js it's a client component

import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="bg-gradient-to-r from-black to-gray-900 text-white py-2 px-4 shadow-md border-b border-yellow-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo or Title (optional) */}
          {/* <div className="text-yellow-400 font-bold text-lg">MyEventVR</div> */}

          {/* Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-yellow-400 focus:outline-none text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center w-full">
            <ul className="flex space-x-6 items-center bg-gradient-to-r from-black to-gray-900 py-2 px-6 rounded-full border border-yellow-400 shadow-md">
              <li>
                <a href="#" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full">Home</a>
              </li>
              <li><a href="#" className="hover:text-yellow-400">Event</a></li>
              <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-400">Contacts</a></li>
              <li><a href="#" className="hover:text-yellow-400">Book Tickets</a></li>
              <li><a href="#" className="hover:text-yellow-400">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="flex flex-col mt-4 space-y-2 md:hidden">
            <li><a href="#" className="block text-center py-2 bg-yellow-400 text-black font-bold rounded">Home</a></li>
            <li><a href="#" className="block text-center py-2 hover:text-yellow-400">Event</a></li>
            <li><a href="#" className="block text-center py-2 hover:text-yellow-400">About Us</a></li>
            <li><a href="#" className="block text-center py-2 hover:text-yellow-400">Contacts</a></li>
            <li><a href="#" className="block text-center py-2 hover:text-yellow-400">Book Tickets</a></li>
            <li><a href="#" className="block text-center py-2 hover:text-yellow-400">Terms</a></li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
