"use client";

import React, { useState } from "react";
import Image from "next/image";

// ---------------- Types & Data ----------------

type Event = {
  title: string;
  image: string;
};

type EventsByCategory = {
  [category: string]: Event[];
};

const events: EventsByCategory = {
  Concert: [
    { title: "HEARTBEAT & RHYTHM", image: "/assets/love.svg" },
    { title: "LASU FOOD FEST", image: "/assets/food.svg" },
    { title: "UNLEASH 2.0", image: "/assets/love.svg" },
    { title: "HEARTBEAT & RHYTHM", image: "/assets/food.svg" },
  ],
  "House Party": [],
  "Pool Party": [],
  "Club Party": [],
  "Beach Party": [],
};

const categories = Object.keys(events);

// ---------------- Featured Events Component ----------------

const FeaturedEvents = () => {
  const [active, setActive] = useState<string>("Concert");

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="flex justify-center gap-4 flex-wrap mb-12">
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

      <div className="flex flex-wrap justify-center gap-6">
        {events[active]?.map((event, idx) => (
          <div
            key={idx}
            className="w-[180px] h-[280px] bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <Image
              src={event.image}
              alt={event.title}
              width={180}
              height={280}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-10 tracking-wider">
        FEATURED EVENTS
      </p>
    </section>
  );
};

// ---------------- Main Landing Page ----------------

const LandingPage = () => {
  return (
    <main className="w-full bg-black text-white font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 pt-20 pb-16 bg-black">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">ECHELONTIX</h1>
          <p className="text-lg mb-6">
            Your trusted partner in innovation and event management.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all">
              Log in
            </button>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition-all">
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

      

      {/* FEATURED EVENTS */}
      <FeaturedEvents />

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
              <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
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

      {/* NEW EVENTS */}
      <section className="bg-black py-16 px-6 lg:px-24">
        <h2 className="text-2xl font-bold text-center mb-10">NEW EVENTS</h2>
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="max-w-md w-full">
            <Image
              src="/assets/lasu-food.svg"
              alt="Featured Event"
              width={400}
              height={300}
              className="rounded-lg w-full"
            />
            <h3 className="text-lg font-semibold mt-4">
              Heartbeat & Rhythm (Love Fest)
            </h3>
            <p className="text-sm text-gray-400">Location & time details here</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} className="text-sm">
                <Image
                  src="/assets/lasu-food.svg"
                  alt="Small Event"
                  width={120}
                  height={90}
                  className="rounded-lg"
                />
                <h4 className="font-semibold mt-2">LASU FOOD FESTIVAL</h4>
                <p className="text-gray-400">Quick details</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="bg-white text-black py-16 px-6 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 p-3 rounded"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 p-3 rounded"
          />
          <textarea
            placeholder="Message"
            rows={5}
            className="w-full border border-gray-300 p-3 rounded"
          ></textarea>
          <button
            type="submit"
            className="bg-yellow-400 px-6 py-3 rounded hover:bg-yellow-300"
          >
            Send Message
          </button>
        </form>
        <div className="hidden md:block">
          <Image
            src="/assets/OIP.svg"
            alt="Contact Visual"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
