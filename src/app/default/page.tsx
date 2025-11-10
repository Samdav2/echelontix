"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ChevronLeft, ChevronRight, Ticket, Star, Mail } from "lucide-react";

const Home: React.FC = () => {
  const router = useRouter();

  // --- MOCK DATA (Expanded for slider functionality) ---
  const featuredEvents = [
    { id: 1, name: "Tech Summit 2025", date: "2025-09-20", location: "LASU Main Hall", image: "/assets/love.svg" },
    { id: 2, name: "AI & Innovation Fair", date: "2025-10-05", location: "Virtual (Google Meet)", image: "/assets/lasu-food.svg" },
    { id: 3, name: "Lagos Music Fest", date: "2025-11-12", location: "Eko Atlantic", image: "/assets/love.svg" },
    { id: 4, name: "Startup Pitch Night", date: "2025-12-01", location: "The Zone Tech Park", image: "/assets/lasu-food.svg" },
    { id: 5, name: "Future of Work Conf", date: "2026-01-15", location: "Landmark Centre", image: "/assets/love.svg" },
  ];

  const upcomingEvents = [
    { id: 1, name: "DEEONE – Failed Comedian at TBS", price: "₦5,000 – ₦100,000", image: "/assets/love.svg" },
    { id: 2, name: "AY LIVE IN PORT HARCOURT 2025", price: "₦5,000 – ₦3,000,000", image: "/assets/lasu-food.svg" },
    { id: 3, name: "BASKETMOUTH UNCENSORED", price: "₦10,000 – ₦5,000,000", image: "/assets/love.svg" },
    { id: 4, name: "ASIRI – I DON'T NEED YOUR OPINION", price: "₦5,000 – ₦5,000,000", image: "/assets/lasu-food.svg" },
  ];

  // --- CAROUSEL STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  // Number of items to show at once on desktop.
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      // Ensure we don't scroll past the end of real data
      (prev + 1 > featuredEvents.length - itemsPerPage) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 < 0) ? Math.max(0, featuredEvents.length - itemsPerPage) : prev - 1
    );
  };

  // --- HANDLERS ---
  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/signup");

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-yellow-500 selection:text-black">

      {/* === HERO SECTION === */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            <span className="text-white">Experience</span>
            <br />
            <span className="text-yellow-400">ECHELONTIX</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Your trusted partner in innovation and premium event management. Discover, host, and experience events like never before.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <button onClick={handleLogin} className="px-8 py-3 rounded-full font-semibold bg-yellow-400 text-black hover:bg-yellow-300 transition-transform hover:scale-105 active:scale-95">
              Log In
            </button>
            <button onClick={handleRegister} className="px-8 py-3 rounded-full font-semibold border-2 border-zinc-700 hover:border-yellow-400 hover:text-yellow-400 transition-all">
              Register
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-md lg:max-w-xl">
          {/* Decorative blob behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/20 blur-[100px] rounded-full -z-10"></div>
          <img
            src="/assets/booth.png"
            alt="Tickets Booth"
            className="w-full h-auto object-contain drop-shadow-2xl animate-float" // Assuming you might add a float animation in globals.css
          />
        </div>
      </section>


      {/* === FEATURED EVENTS CAROUSEL === */}
      <section className="w-full bg-zinc-900/50 py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" /> Featured Events
            </h2>
            <div className="flex gap-2">
               <button onClick={prevSlide} className="p-2 rounded-full border border-zinc-700 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentIndex === 0}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} className="p-2 rounded-full border border-zinc-700 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentIndex >= featuredEvents.length - itemsPerPage}>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Slider Viewport */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {featuredEvents.map((event) => (
                <div key={event.id} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] px-3">
                  <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 md:opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{event.name}</h3>
                      <div className="flex flex-col gap-1 text-sm text-zinc-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-yellow-400"/> {event.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-yellow-400"/> {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* === CREATE / NOMINATE SECTION === */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">Bring Your Vision to Life</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Whether it's a massive concert or an exclusive voting event, we have the tools you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          {/* Create Event Card */}
          <div className="group relative bg-zinc-900 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-zinc-950 rounded-[22px] p-8 flex flex-col items-start border border-zinc-800 group-hover:border-yellow-500/50 transition-colors">
              <div className="p-4 bg-yellow-400/10 text-yellow-400 rounded-2xl mb-6">
                <Ticket size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create an Event</h3>
              <p className="text-zinc-400 mb-8 flex-grow">
                Set up ticketing, manage attendees, and track sales with our powerful dashboard.
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-yellow-400 hover:gap-4 transition-all">
                Get Started <ChevronRight size={16} />
              </button>
            </div>
          </div>

           {/* Create Nomination Card */}
           <div className="group relative bg-zinc-900 rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-zinc-950 rounded-[22px] p-8 flex flex-col items-start border border-zinc-800 group-hover:border-purple-500/50 transition-colors">
              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create Nomination Link</h3>
              <p className="text-zinc-400 mb-8 flex-grow">
                Allow your community to nominate and vote for their favorites seamlessly.
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:gap-4 transition-all">
                Create Link <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* === UPCOMING EVENTS GRID === */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <button className="hidden sm:flex px-6 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors text-sm font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg line-clamp-2 mb-2 leading-tight min-h-[3rem]">
                    {event.name}
                  </h3>
                  <p className="text-yellow-400 font-medium text-sm">
                    {event.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex sm:hidden justify-center">
            <button className="px-8 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors">
              Explore All Events
            </button>
          </div>
        </div>
      </section>


      {/* === CALL TO ACTION & SUBSCRIBE === */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Join Us Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 md:p-12 text-black text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to host your next big event?
            </h2>
            <p className="text-black/80 text-lg font-medium">
              List it on ECHELONTIX for a smooth, stress-free ticketing experience.
            </p>
          </div>
          <button className="shrink-0 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-transform hover:scale-105 active:scale-95">
            Get Started Now
          </button>
        </div>

        {/* Subscribe Form */}
        <div className="text-center space-y-8 max-w-md mx-auto">
          <div className="space-y-3">
             <Mail size={40} className="mx-auto text-zinc-500 mb-4" />
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-zinc-400">
              Get exclusive event alerts and early-bird offers straight to your inbox.
            </p>
          </div>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder:text-zinc-600"
            />
            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </main>
  );
};

export default Home;
