"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ---------------- Types & Data ----------------

type Event = {
  title: string;
  image: string;
  location?: string;
};

type EventsByCategory = {
  [category: string]: Event[];
};

const events: EventsByCategory = {
  Concert: [
    { title: "HEARTBEAT & RHYTHM", image: "/assets/love.svg", location: "Lagos, NG" },
    { title: "LASU FOOD FEST", image: "/assets/food.svg", location: "Ojo Campus" },
    { title: "UNLEASH 2.0", image: "/assets/love.svg", location: "Surulere" },
    { title: "HEARTBEAT & RHYTHM", image: "/assets/food.svg", location: "Mainland" },
  ],
  "House Party": [],
  "Pool Party": [],
  "Club Party": [],
  "Beach Party": [],
};

const categories = Object.keys(events);

// ---------------- Main Landing Page ----------------

const LandingPage = () => {
  const router = useRouter();
  const [active, setActive] = useState<string>("Concert");

  const Register = () => router.push("/choose-role");
  const login = () => router.push("/auth/signin");

  const handleEventClick = () => {
    // router.push("/registration");
    router.push("/#")
  };

  return (
    <main className="w-full bg-black text-white font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-20 pb-4 bg-black">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">ECHELONTIX</h1>
          <p className="text-lg mb-6">
            Your trusted partner in innovation and event management.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button
              className="border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all"
              onClick={login}
            >
              Log in
            </button>
            <button
              className="text-white border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all"
              onClick={Register}
            >
              Register
            </button>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0 w-80 h-80">
          <Image
            src="/assets/booth.png"
            alt="Tickets Booth"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* CATEGORIES & EVENTS */}
      <section className="bg-black text-white pt-8 pb-16 px-4">
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition ${
                active === cat
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{active}</h2>
          <div className="mt-1 h-1 w-12 bg-yellow-400 mx-auto rounded" />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {events[active]?.map((event, idx) => (
            <div
              key={idx}
              className="text-center cursor-pointer"
              onClick={handleEventClick}
            >
              <div className="w-[180px] h-[280px] bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={180}
                  height={280}
                  className="object-cover w-full h-full"
                />
              </div>
              <h4 className="text-md font-semibold mt-3">{event.title}</h4>
              <p className="text-sm text-gray-400">{event.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT BANNER */}
      <section className="relative w-full h-[550px] bg-black text-white overflow-hidden">
        <Image
          src="/assets/stage.svg"
          alt="Event Background"
          fill
          className="object-cover opacity-70"
          priority
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h3 className="text-lg md:text-xl font-semibold uppercase">
            The Lewistage Theatre Event
          </h3>
          <h1 className="text-3xl md:text-5xl font-bold mt-2">
            May 30th – June 5th
          </h1>

          <div className="mt-8 bg-white text-black rounded-md p-4 md:p-6 max-w-4xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-l-[8px] border-yellow-400">
            <div className="flex flex-col gap-2 w-full md:w-2/3">
              <p className="text-sm text-gray-500 uppercase font-medium">
                Event
              </p>
              <h2 className="text-xl md:text-2xl font-bold">
                LASU Food Festival
              </h2>
              <div className="flex items-center gap-6 text-sm text-gray-600 mt-2">
                <span>📅 Jan 30</span>
                <span>🕖 7:00pm</span>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button className="bg-yellow-400 hover:bg-yellow-500 transition px-5 py-2 text-sm font-semibold rounded">
                  Get Tickets
                </button>
                <a href="#" className="text-blue-600 text-sm hover:underline">
                  View Details
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <Image
                src="/assets/lasu-food.svg"
                alt="LASU Food Festival"
                width={300}
                height={200}
                className="w-full h-auto rounded"
              />
            </div>
          </div>

          {/* Arrows */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
            <span className="text-black font-bold text-xl">&larr;</span>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer">
            <span className="text-black font-bold text-xl">&rarr;</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
