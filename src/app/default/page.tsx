"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const Home: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] =useState(0);
 
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev ===0? featuredEvents.length-1:prev-1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev ===0? featuredEvents.length-1:prev+1))
  }

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/signup");
  };

  const featuredEvents = [
  {
    id: 1,
    name: "Tech Summit 2025",
    date: "2025-09-20",
    location: "LASU Main Hall",
    image: "/assets/love.svg"
  },
  {
    id: 2,
    name: "AI & Innovation Fair",
    date: "2025-10-05",
    location: "Virtual (Google Meet)",
    image: "/assests/lasu-food.svg"
  },
];


   return (
    <main className="min-h bg-black text-white font-sans p-4 sm:px-6 lg:px-10">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-20 pb-4">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-yellow-400">
            ECHELONTIX
          </h1>
          <p className="text-lg mb-6 text-gray-300">
            Your trusted partner in innovation and event management.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button
              onClick={handleLogin}
              className="border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all"
            >
              Log in
            </button>
            <button
              onClick={handleRegister}
              className="text-white border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all"
            >
              Register
            </button>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0 w-80 h-80">
          <img
            src="/assets/booth.png"
            alt="Tickets Booth"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </section>

      {/*Featured Events*/}
         <section className="max-w-screen-xl max-auto bg-black py-10 relative text-white">
          
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
             Featured Events
          </h2>

      <div className="flex items-center justify-center gap-4 px-4 no-scrollbar">
        {featuredEvents.map((event, index) => (
          <div
            key={index}
            className="relative w-[120px]  h-[120px] sm:grid-cols-2 rounded overflow-hidden shrink-0"
          >
            <img
              src={"/assets/love.svg"}
              alt={event.name}
              className="w-full h-[80px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-black text-center py-2 text-sm font-medium">
            {event.name}
            </div>
          </div>
             ))}
      </div>

      {/* Optional Left/Right arrows */}
      <button 
      onClick={prevSlide} 
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/50 text-white rounded-full p-2">
        ← 
      </button>
      <button 
      onClick={nextSlide} 
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/50 text-white rounded-full p-2">
        →
      </button>
    </section>

    {/*Nomination and event Section*/}
<section className="max-w-screen-xl max-auto bg-gradient-to-br from-purple-700 to-pink-400 text-white py-10 px-6 flex flex-col ">
      <h1 className="text-3xl sm:text-3xl lg:text-5xl text-yellow-400 mb-4 text-center">
        Create Event
      </h1>
      <p className="text-gray-200 text-center mb-6">
        See what's coming.
      </p>

      <div className="max-w-[500px] grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2">
      <div className="bg-black rounded-2xl p-6 w-50 text-center shadow-lg">
        <img src="/assets/lasu-food.svg" 
        alt="preview"
        className="w-full h-auto"
        />
        <div className="p-4 text-left">
          <h2 className="text-lg font-semibold text-yellow-700 whitespace-nowrap">Create Events</h2>
          <p className="text-white-400 text-sm">
            Bring Your Party and Creativity to life
          </p>
        </div>
      </div>

      {/*Create Nomination Link*/}
        <div className="bg-cover bg-[url('/assets/nomination.jpg')] bg-center rounded-xl p-6 w-50 text-center shadow-lg">
          <div className="p-4 text-left">
            <h2 className="text-lg font-semibold text-yellow-600">Create Nomination Link</h2>
            <p className="text-black-600 text-sm">
              Allow people to nominate candidates online
            </p>
         </div>
        </div>
      </div>
    </section>

      {/*upcoming Events section*/}
<div className="bg-black-100 px-4 py-8">
  <h1 className="text-2xl font-bold text-yellow-600 text-center mb-8">Upcoming Events</h1>

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
    {/* Event Card 1 */}
    <div className="bg-white rounded shadow p-3">
      <img src="/assets/love.svg" alt="DEEONE" className="w-full h-35 object-cover rounded" />
      <h2 className="mt-3 font-semibold text-sm text-gray-800">DEEONE – Failed Comedian at TBS</h2>
      <p className="text-sm text-gray-600 mt-1">₦5000 – ₦100000</p>
    </div>

    {/* Event Card 2 */}
    <div className="bg-white rounded shadow p-3">
      <img src="/assets/lasu-food.svg" alt="AY LIVE" className="w-full h-35 object-cover rounded" />
      <h2 className="mt-3 font-semibold text-sm text-gray-800">AY LIVE IN PORT HARCOURT 2025</h2>
      <p className="text-sm text-gray-600 mt-1">₦5000 – ₦3000000</p>
    </div>

     {/* Event Card 2 */}
    <div className="bg-white rounded shadow p-3">
      <img src="/assets/lasu-food.svg" alt="AY LIVE" className="w-full h-35 object-cover rounded" />
      <h2 className="mt-3 font-semibold text-sm text-gray-800">AY LIVE IN PORT HARCOURT 2025</h2>
      <p className="text-sm text-gray-600 mt-1">₦5000 – ₦3000000</p>
    </div>


       {/* Event Card 4 */}
    <div className="bg-white rounded shadow p-3">
      <img src="/assets/lasu-food.svg" alt="ASIRI" className="w-full h-35 object-cover rounded" />
      <h2 className="mt-3 font-semibold text-sm text-gray-800">ASIRI – I DON'T NEED YOUR OPINION</h2>
      <p className="text-sm text-gray-600 mt-1">₦5000 – ₦5000000</p>
    </div>
    </div>

    <div className="flex justify-center mt-8">
     <button className="bg-yellow-700 text-white px-6 py-2 rounded hover:bg-purple-900">
      Explore
     </button>
    </div>
    </div>

      {/* Join Us */}
      <div className="flex flex-col items-center justify-center bg-black p-6 md:p-12 rounded-lg shadow-xl max-w-xl mx-auto text-left">
      <h1 className="text-2xl md:text-4xl font-bold text-yellow-200 mb-4 text-left">
        Effortless Event Hosting, Exceptional Experiences!
      </h1>
      <p className="text-white-200 text-left sm:text-xl md:text-lg mb-6">
        Planning an event? List it on FunZ and give your guests a smooth, exciting, and stress-free ticketing experience.
      </p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-55 mr-auto py-2 px-6 rounded transition duration-300">
        Get Started
      </button>
    </div>

    {/*Subscribe*/}
    {/*<hr className="border-gray-100 mb-2" />*/}
<div className="shadow-md p-2 max-w-md mx-auto text-center">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stay Updated</h2>
  <p className="text-sm text-gray-500 mb-6">
    Get event alerts and exclusive updates straight to your inbox.
  </p>

  <form className="space-y-3">
    <input
      type="text"
      placeholder="Your name"
      className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
    <input
      type="email"
      placeholder="Email address"
      className="w-full px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
    <button
      type="submit"
      className="w-55 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-md transition"
    >
      Subscribe
    </button>
  </form>
</div>
      
    </main>
  );
};
export default Home;
