'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { Search, Ticket, Music, Dribbble, Clapperboard, Twitter, Instagram, Facebook, ArrowRight, Zap, ShieldCheck, Gem, BrainCircuit, Star } from "lucide-react";

// --- Reusable Components ---
const NavLink = ({ children, href }: { children: React.ReactNode; href:string }) => (
  <a href={href} className="px-4 py-2 text-sm text-gray-300 rounded-full hover:text-white hover:bg-white/10 transition-colors duration-300">
    {children}
  </a>
);

const CategoryCard = ({ category, index }: { category: any, index: number }) => {
  const router = useRouter();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const handleCardClick = () => {
    router.push(`/explore?category=${category.name}`);
  }

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      onClick={handleCardClick}
      className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
    >
      {/* Solid Gradient Background */}
      <div className={`absolute inset-0 z-[-1] ${category.gradient}`}></div>

      {/* Unique animated background for each card */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {category.animation}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full inline-block mb-3 border border-white/20 transition-transform duration-300 group-hover:scale-110">
            {React.cloneElement(category.icon, { className: "w-6 h-6 text-white" })}
          </div>
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        </motion.div>
      </div>
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500 rounded-3xl transition-all duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

const InteractiveSpotlight = () => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    let maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, white, transparent)`;
    let style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative w-full h-[500px] max-w-6xl mx-auto rounded-3xl border border-white/10 p-1"
        >
            <div className="absolute inset-[-1px] rounded-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div style={style} className="absolute inset-[-1px] rounded-3xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative w-full h-full rounded-[22px] bg-black flex flex-col items-center justify-center text-center p-4">
                 <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Unlock Premier Access</h2>
                 <p className="text-lg text-gray-400 mt-4 max-w-xl">Step into a world of curated events and unforgettable moments. Your next story begins here.</p>
                 <button className="mt-8 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors">
                    Explore Premier Events
                 </button>
            </div>
        </motion.div>
    )
}

const BenefitCard = ({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center"
    >
        <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4 border border-purple-500/30">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </motion.div>
);

// --- Main Landing Page Component ---
const LandingPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const navY = useTransform(scrollYProgress, [0, 0.05], ["0%", "-150%"]);
  const springNavY = useSpring(navY, { stiffness: 100, damping: 20 });

  const eventCategories = [
    { name: "Concerts", icon: <Music />, gradient: "bg-gradient-to-br from-purple-500 to-pink-500", animation: <div className="absolute inset-0"><div className="absolute bottom-0 left-1/4 w-1 h-full bg-white/10 animate-[equalizer_1s_ease-in-out_infinite_alternate]"></div><div className="absolute bottom-0 left-2/4 w-1 h-full bg-white/10 animate-[equalizer_1.2s_ease-in-out_infinite_alternate]"></div><div className="absolute bottom-0 left-3/4 w-1 h-full bg-white/10 animate-[equalizer_0.8s_ease-in-out_infinite_alternate]"></div></div> },
    { name: "Sports", icon: <Dribbble />, gradient: "bg-gradient-to-br from-orange-500 to-yellow-500", animation: <motion.div className="absolute w-4 h-4 bg-white/50 rounded-full" animate={{ x: [20, 180, 20], y: [150, 40, 150], scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}></motion.div> },
    { name: "Cinema", icon: <Clapperboard />, gradient: "bg-gradient-to-br from-red-500 to-orange-500", animation: <><div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><filter id="bnoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23bnoise)"/></svg>')`}} /><motion.div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 60%)' }} animate={{ opacity: [0.1, 0.4, 0.15, 0.3, 0.1] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} /><motion.div className="absolute top-0 left-[25%] w-px h-full bg-white/10" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.3 }} /><motion.div className="absolute top-0 left-[65%] w-px h-full bg-white/10" animate={{ y: ['100%', '-100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.1 }} /></> },
    { name: "Theatre", icon: <Ticket />, gradient: "bg-gradient-to-br from-cyan-500 to-blue-500", animation: <motion.div className="absolute top-1/2 left-1/2" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><Star className="w-48 h-48 text-white/10" /></motion.div> },
  ];

  const benefits = [
    { icon: <Zap className="w-8 h-8 text-yellow-400" />, title: "Instant Access", description: "Get your digital tickets in seconds. No queues, no waiting." },
    { icon: <ShieldCheck className="w-8 h-8 text-green-400" />, title: "Unmatched Security", description: "Your tickets are secured with cutting-edge encryption technology." },
    { icon: <Gem className="w-8 h-8 text-cyan-400" />, title: "Exclusive Events", description: "Access a curated list of premier events you won't find anywhere else." },
    { icon: <BrainCircuit className="w-8 h-8 text-purple-400" />, title: "AI Recommendations", description: "Our smart algorithm suggests events you'll love based on your activity." },
  ];

  if (!isClient) {
    return <div className="min-h-screen w-full bg-black" />;
  }

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden antialiased">
      {/* Background Visuals */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_10%,rgba(93,56,233,0.3),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:18px_18px]"></div>
      </div>


      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="h-screen flex flex-col items-center justify-center text-center px-4"
        >

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-400"
            >
              ECHELONTIX
            </motion.h1>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
            >
              Enter the Future of Experiences
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="max-w-2xl mx-auto mt-6 text-lg text-gray-400"
            >
              Discover and book tickets for the most exclusive events. Seamless, secure, and instantaneous. Your next adventure awaits.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="group relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_40px_rgba(93,56,233,0.5)]">
                <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></span>
                Buy Tickets
              </button>
              <button onClick={() => router.push('/explore')} className="px-8 py-4 text-lg text-gray-300 hover:text-white transition-colors group flex items-center gap-2">
                Explore Events <ArrowRight className="inline transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Search & Categories Section */}
        <section className="py-24 px-4 space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Find Your Next Obsession</h2>
            <div className="relative mt-6 cursor-pointer" onClick={() => router.push('/explore')}>
              <div className="w-full pl-12 pr-4 py-4 bg-black/30 backdrop-blur-lg border border-white/20 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-[0_0_20px_rgba(128,90,233,0.2)] flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <span>Search for events, artists, or venues...</span>
              </div>
            </div>
          </motion.div>

          {/* Corrected: Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-8 max-w-7xl mx-auto">
            {eventCategories.map((cat, i) => (
              <CategoryCard key={cat.name} category={cat} index={i} />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Why Echelontix?</h2>
                <p className="text-gray-400">We're not just a ticketing platform; we're an experience engine built for the modern world.</p>
            </motion.div>
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, i) => (
                    <BenefitCard key={benefit.title} {...benefit} index={i} />
                ))}
            </div>
        </section>

        {/* Interactive Spotlight Section */}
        <section className="py-24 px-4">
            <InteractiveSpotlight />
        </section>

        {/* Footer Section */}
        {/* <footer className="relative z-10 border-t border-white/10 mt-24 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Get Started Today</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Download the app and never miss a moment. The future of live events is in your pocket.</p>
            <div className="flex justify-center gap-6 mt-8">
              <a href="#" className="text-gray-400 hover:text-white"><Twitter/></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram/></a>
              <a href="#" className="text-gray-400 hover:text-white"><Facebook/></a>
            </div>
            <div className="text-center text-gray-500 text-sm mt-12 border-t border-white/10 pt-8">
              &copy; {new Date().getFullYear()} Echelontix. All Rights Reserved.
            </div>
          </div>
        </footer> */}
      </main>
    </div>
  );
};


// ---------------- Main Landing Page ----------------

type EventFromAPI = {
  id: number;
  event_name: string;
  picture: string;
  event_address: string;
  category: string;
  date: string; // ISO string
  time_in: string;
  price: string;
};

type EventsByCategory = {
  [category: string]: EventCardProps[];
};

const predefinedCategories = ["Concert", "Party"];

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [events, setEvents] = useState<EventsByCategory>({});
  const [categories, setCategories] = useState<string[]>(["All", ...predefinedCategories]);
  const [isLoading, setIsLoading] = useState(true);

  const url = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {

        const response = await axios.get(`${url}event/getAllEvent`);

        const data = response.data as { event: EventFromAPI[] };
        const apiEvents: EventFromAPI[] = data.event;

        const processedEvents: EventsByCategory = {};
        predefinedCategories.forEach(cat => {
            processedEvents[cat] = [];
        });

        const uniqueApiCategories = new Set<string>();

        apiEvents.forEach(event => {
          const now = new Date();
          const eventDate = new Date(event.date);
          let status: 'upcoming' | 'live' | 'past' = 'upcoming';

          if (eventDate < now) {
              status = 'past';
          }
          if (eventDate.toDateString() === now.toDateString()) {
              status = 'live';
          }

          const eventCategory = event.category || "General";

          const cardData: EventCardProps = {
            id: event.id,
            title: event.event_name,
            location: event.event_address,
            date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: event.time_in,
            image: event.picture,
            price: event.price,
            attendees: 0,
            category: eventCategory,
            status: status,
          };

          if (!processedEvents[eventCategory]) {
            processedEvents[eventCategory] = [];
          }
          processedEvents[eventCategory].push(cardData);
          uniqueApiCategories.add(eventCategory);
        });

        const allCategories = ["All", ...Array.from(new Set([...predefinedCategories, ...uniqueApiCategories]))];

        processedEvents["All"] = Object.values(processedEvents).flat();

        setEvents(processedEvents);
        setCategories(allCategories);
        setActiveCategory("All");

      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /**
   * Navigates to the registration page if the event is not in the past.
   * @param eventId - The ID of the event to register for.
   * @param status - The status of the event ('upcoming', 'live', or 'past').
   */
  const handleEventClick = (eventId: number, status: 'upcoming' | 'live' | 'past') => {
    // Only navigate if the event is not 'past'.
    if (status !== 'past') {
      // Navigate to the registration page with the eventId as a query parameter.
      window.location.href = `/registration?eventId=${eventId}`;
    }
  };

  const login = () => window.location.href = "/auth/signin";
  const Register = () => window.location.href = "/choose-role";

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
          <img
            src="/assets/booth.png"
            alt="Tickets Booth"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </section>

      {/* CATEGORIES & EVENTS */}
      <section className="bg-black text-white pt-8 pb-16 px-4">
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition ${
                activeCategory === cat
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{activeCategory}</h2>
          <div className="mt-1 h-1 w-12 bg-yellow-400 mx-auto rounded" />
        </div>

        {isLoading ? (
          <div className="text-center">Loading Events...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {events[activeCategory]?.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event.id, event.status)}>
                <EventCard {...event} />
              </div>
            ))}
            {(!events[activeCategory] || events[activeCategory].length === 0) && !isLoading && (
              <p>No events found in this category.</p>
            )}
          </div>
        )}
      </section>

      {/* SPOTLIGHT BANNER (Keeping this static for now) */}
      <section className="relative w-full h-[550px] bg-black text-white overflow-hidden">
        <img
          src="/assets/stage.svg"
          alt="Event Background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
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
              <p className="text-sm text-gray-500 uppercase font-medium">Event</p>
              <h2 className="text-xl md:text-2d`xl font-bold">LASU Food Festival</h2>
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
              <img
                src="/assets/lasu-food.svg"
                alt="LASU Food Festival"
                width="300"
                height="200"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
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
