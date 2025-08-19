"use client";

import React from "react";

const PricingPage = () => {
  return (
    <main className="bg-black text-white font-sans min-h-screen px-6 py-16 lg:px-24">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold">Our Services & Pricing</h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Everything you need to manage, promote, and sell out your event.
        </p>
      </section>

      {/* Services Section */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Service 1 */}
          <div className="border border-yellow-400 rounded-lg p-6 text-center bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">🎤 Online Event Promotion</h3>
            <p className="text-gray-300 text-sm">
              Amplify your event's reach with targeted campaigns across platforms and our user base.
            </p>
          </div>
          {/* Service 2 */}
          <div className="border border-yellow-400 rounded-lg p-6 text-center bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">🎟️ Secure Ticket Sales</h3>
            <p className="text-gray-300 text-sm">
              Sell tickets seamlessly with real-time tracking, fraud protection, and easy check-ins.
            </p>
          </div>
          {/* Service 3 */}
          <div className="border border-yellow-400 rounded-lg p-6 text-center bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">📈 Analytics & Insights</h3>
            <p className="text-gray-300 text-sm">
              Gain insights into your attendees, sales trends, and performance through our dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="text-center mb-24">
        <h2 className="text-3xl font-bold mb-10">Pricing Plans</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Free Plan */}
          <div className="border border-yellow-400 rounded-lg p-8 text-center w-full max-w-sm bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Free</h3>
            <p className="text-gray-300 mb-6">Ideal for individuals and small events</p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✔️ Basic Event Listing</li>
              <li>✔️ Standard Promotion</li>
              <li>✔️ Ticket Sales Integration</li>
              <li>❌ Premium Placement</li>
            </ul>
            <p className="text-yellow-400 text-xl font-semibold mb-4">0% Fee</p>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border border-yellow-400 rounded-lg p-8 text-center w-full max-w-sm bg-gradient-to-br from-yellow-900 to-yellow-700 hover:scale-105 transition">
            <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
            <p className="text-black mb-6">Best for organizations and large events</p>
            <ul className="text-sm text-black space-y-2 mb-6">
              <li>✔️ Priority Event Placement</li>
              <li>✔️ Targeted Social Media Push</li>
              <li>✔️ Analytics Dashboard</li>
              <li>✔️ Dedicated Support</li>
            </ul>
            <p className="text-white text-xl font-semibold mb-4">10% Fee</p>
            /*<button className="bg-black text-yellow-400 px-6 py-2 rounded-full hover:bg-gray-800 transition">
              Upgrade Now
            </button>*/
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Need Help or Custom Plans?</h2>
        <p className="text-gray-400 mb-6">
          Reach out for tailored event solutions or to discuss enterprise packages.
        </p>
        <a
          href="mailto:support@echelontix.com"
          className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-300 transition font-medium"
        >
          Contact Support
        </a>
      </section>
    </main>
  );
};

export default PricingPage;
