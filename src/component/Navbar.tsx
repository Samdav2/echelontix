"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const goToAbout = () => router.push('/about');
  const explore = () => router.push('/explore');
  const chooseRole = () => router.push("/choose-role");

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="bg-gradient-to-r from-black to-gray-900 text-white py-2 px-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">

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

              {/* ✅ Logo as the first menu item, hidden on mobile */}
              <li className="hidden md:block ">
                <img
                  src="/assets/logo.svg"
                  alt="Echelontix Logo"
                  className="h-10 w-auto cursor-pointer border border-yellow-400 rounded-full object-cover"
                  onClick={() => router.push('/')}
                />
              </li>

              <li>
                <a href="#" className="text-white hover:text-yellow-400 py-2 px-4">Home</a>
              </li>
              <li>
                <button onClick={goToAbout} className="hover:text-yellow-400">About Us</button>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">Contacts</a>
              </li>
              <li>
                <button onClick={explore} className="hover:text-yellow-400">Book Tickets</button>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">Terms</a>
              </li>
              <li>
                <button onClick={chooseRole} className="hover:text-yellow-400">SignUp</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="flex flex-col mt-4 space-y-2 md:hidden">
            <li>
              <a href="#" className="block text-center py-2 bg-yellow-400 text-black font-bold rounded">Home</a>
            </li>
            <li>
              <button onClick={goToAbout} className="block w-full text-center py-2 hover:text-yellow-400">About Us</button>
            </li>
            <li>
              <a href="#" className="block text-center py-2 hover:text-yellow-400">Contacts</a>
            </li>
            <li>
              <button onClick={explore} className="block w-full text-center py-2 hover:text-yellow-400">Book Tickets</button>
            </li>
            <li>
              <a href="#" className="block text-center py-2 hover:text-yellow-400">Terms</a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
