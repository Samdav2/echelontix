'use client';

import Image from 'next/image';

const teamMembers = [
  { name: 'Fredrick', role: 'Lead Developer' },
  { name: 'Tolu', role: 'UI/UX Designer' },
  { name: 'Bisi', role: 'Content Strategist' },
  { name: 'Ada', role: 'Product Manager' },
  //{ name: 'Yusuf', role: 'Frontend Engineer' },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* About Section */}
<section className="bg-pink-100 px-6 py-12">
  <div className="max-w-3xl">
    <h2 className="text-4xl font-bold mb-4 pt-10">Who we are...</h2>
    <p className="text-lg font-medium text-black space-y-2">
      <strong>ECHELONTIX</strong> is an event hub where anyone can discover new events, read about past events, and get tickets. We handle the ticketing system for events, both online and offline, for event planners across Nigeria.
         Nigeria’s all-in-one digital ticketing solution for bold creators, curious audiences, and unforgettable experiences.
    </p>
  </div>
</section>


      {/* Mission Section */}
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Mission</h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-black">
          <li>Creating a more streamlined approach to event hosting and ticketing</li>
          <li>Building a community of creative youths</li>
          <li>Promoting Nigeria's pop culture</li>
        </ul>
      </section>

      {/* Vision Section */}
      <section className="bg-pink-100 px-6 py-12 text-right pr-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Vision</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>To be the go-to site for every buzzing event nationwide</li>
          <li>To be the best ticketing platform</li>
          <li>To build a network of creative youths</li>
        </ul>
      </section>

      {/* History Section */}
      <section className="bg-pink-100 px-6 py-12 ">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">History</h2>
        <p className="max-w-3xl text-lg text-left">
          <strong>ECHELONTIX</strong> started in 2024 as an extension. was born out of a need to make event ticketing more accessible, transparent,
            and delightful for creators and attendees alike. Whether managing entry for intimate gatherings or high-impact festivals,
            we equip event organizers with intuitive tools to sell, validate, and scale—fast. It was a straightforward plan to create a ticket managing platform where event planners can sell tickets for any kind of event ranging from small house parties to large-scale music festivals.
        </p>
      </section>


       {/* Platform Features */}
      <section className="px-6 py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="font-semibold text-lg mb-2">🛠️ Event Tools</h4>
              <p className="text-sm text-gray-700">Organizers get instant access to event dashboards, QR check-in, guest tracking, and promotional modules.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🎟️ Ticketing Simplified</h4>
              <p className="text-sm text-gray-700">From early bird passes to VIP seats—we make tickets flexible, secure, and easy to distribute.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">📈 Analytics</h4>
              <p className="text-sm text-gray-700">Real-time metrics help organizers optimize performance, understand guests, and scale their impact.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🔒 Fraud Protection</h4>
              <p className="text-sm text-gray-700">Every ticket is verified. Every entry is authenticated. We take guest security seriously.</p>
            </div>
          </div>
        </div>
      </section>

       
      {/* Team Section */}
      <section className="px-6 py-16 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-8">Meet the Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
          {teamMembers.map(({ name, role }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-24 h-24 relative">
                <Image
                  src="/assets/user.svg"
                  alt={name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm font-bold">{name}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
