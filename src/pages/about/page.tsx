'use client';

import Image from 'next/image';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Echelotix Logo" width={40} height={40} />
          <span className="text-xl font-bold">ECHELONTIX</span>
        </div>
        <ul className="hidden md:flex space-x-6">
          <li><a href="/" className="hover:text-yellow-400">Home</a></li>
          <li><a href="#" className="hover:text-yellow-400">Event</a></li>
          <li><a href="#" className="text-yellow-400 font-semibold">About</a></li>
          <li><a href="#" className="hover:text-yellow-400">Contacts</a></li>
          <li><a href="#" className="hover:text-yellow-400">Book Tickets</a></li>
        </ul>
      </nav>

      {/* About Section */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Who we are...</h2>
        <p className="max-w-3xl mx-auto text-lg">
          <strong>ECHELONTIX</strong> is an event hub where anyone can discover new events, read about past events, and get tickets. We handle the ticketing system for events, both online and offline, for event planners across Nigeria.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Mission</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Creating a more streamlined approach to event hosting and ticketing</li>
          <li>Building a community of creative youths</li>
          <li>Promoting Nigeria's pop culture</li>
        </ul>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Vision</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>To be the go-to site for every buzzing event nationwide</li>
          <li>To be the best ticketing platform</li>
          <li>To build a network of creative youths</li>
        </ul>
      </section>

      {/* History Section */}
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">History</h2>
        <p className="max-w-3xl mx-auto text-lg">
          <strong>ECHELONTIX</strong> started in 2024 as an extension. It was a straightforward plan to create a ticket managing platform where event planners can sell tickets for any kind of event ranging from small house parties to large-scale music festivals.
        </p>
      </section>

      {/* Team Section */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">OUR TEAM</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-28 h-28">
              <Image
                src="/user.jpg"
                alt={`Team Member ${i + 1}`}
                width={112}
                height={112}
                className="rounded-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
