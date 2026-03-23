'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Target,
  Lightbulb,
  History,
  Users,
  ShieldCheck,
  Ticket,
  BarChart3,
  Wrench
} from 'lucide-react';

const teamMembers = [
  { name: 'Fredrick', role: 'Lead Developer', image: '/assets/user.svg' },
  { name: 'Tolu', role: 'UI/UX Designer', image: '/assets/user.svg' },
  { name: 'Bisi', role: 'Content Strategist', image: '/assets/user.svg' },
  { name: 'Ada', role: 'Product Manager', image: '/assets/user.svg' },
];

const features = [
  {
    icon: <Wrench className="w-6 h-6 text-yellow-500" />,
    title: "Event Tools",
    description: "Organizers get instant access to event dashboards, QR check-in, guest tracking, and promotional modules."
  },
  {
    icon: <Ticket className="w-6 h-6 text-yellow-500" />,
    title: "Ticketing Simplified",
    description: "From early bird passes to VIP seats—we make tickets flexible, secure, and easy to distribute."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-yellow-500" />,
    title: "Analytics",
    description: "Real-time metrics help organizers optimize performance, understand guests, and scale their impact."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-yellow-500" />,
    title: "Fraud Protection",
    description: "Every ticket is verified. Every entry is authenticated. We take guest security seriously."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-yellow-500/30">

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0" />
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20 z-0" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600"
          >
            We Are Echelontix
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Nigeria’s premier digital ticketing solution. We bridge the gap between bold creators and curious audiences, crafting unforgettable experiences.
          </motion.p>
        </div>
      </section>

      {/* Mission, Vision, History Grid */}
      <section className="py-10 px-6 bg-zinc-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Mission */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors duration-300 group">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <Target className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  Streamlining event hosting and ticketing
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  Building a community of creative youths
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  Promoting Nigeria's pop culture
                </li>
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 transition-colors duration-300 group">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  To be the go-to site for every buzzing event
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  To be the best ticketing platform
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                  To build a network of creative youths
                </li>
              </ul>
            </motion.div>

            {/* History */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/50 transition-colors duration-300 group">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <History className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our History</h3>
              <p className="text-gray-400 leading-relaxed">
                Born in 2024, <strong className="text-yellow-500">ECHELONTIX</strong> emerged from a need to make event ticketing accessible, transparent, and delightful. From intimate gatherings to high-impact festivals, we equip organizers with intuitive tools to sell, validate, and scale.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">What Makes Us Different</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We don't just sell tickets; we provide a complete ecosystem for event success.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="mt-1 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet the Team</h2>
            <p className="text-gray-400">The creative minds behind the platform.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 relative mb-4 overflow-hidden rounded-full border-2 border-zinc-800 group-hover:border-yellow-500 transition-colors duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
