'use-client'

import React from 'react'



export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: September 2025
        </p>

        <p className="text-gray-700 mb-8">
          Welcome to <span className="font-semibold">Echelontix</span>. By accessing our website
          or purchasing tickets through our platform, you agree to the following Terms & Conditions.
          Please read them carefully.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {/* 1. Scope of Service */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Scope of Service</h2>
            <p className="text-gray-700">
              Echelontix provides a platform for the purchase and management of tickets for
              luxury events, including Regular, VIP, VVIP, and Table packages.
            </p>
          </section>

          {/* 2. Ticket Purchase & Validity */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Ticket Purchase & Validity</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All tickets must be purchased through official Echelontix channels.</li>
              <li>Tickets are valid only for the specific event, date, and venue indicated.</li>
              <li>QR codes or ticket IDs must be presented for entry.</li>
            </ul>
          </section>

          {/* 3. Restrictions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Restrictions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Tickets cannot be duplicated, resold for profit, or transferred without authorization.</li>
              <li>Any fraudulent activity will result in ticket cancellation without refund.</li>
              <li>Attendees must comply with venue rules, dress codes, and security checks.</li>
            </ul>
          </section>

          {/* 4. Event Organizer & Attendee Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Event Organizer & Attendee Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Organizers are responsible for event quality and experience.</li>
              <li>Echelontix acts as a ticketing and facilitation partner, not the event owner.</li>
              <li>Attendees are responsible for their own safety and conduct during events.</li>
            </ul>
          </section>

          {/* 5. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-2">Echelontix is not liable for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Event cancellations or changes made by organizers.</li>
              <li>Loss of personal belongings during events.</li>
              <li>Injuries or incidents beyond our control.</li>
            </ul>
          </section>

          {/* 6. Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Governing Law</h2>
            <p className="text-gray-700">
              These Terms & Conditions are governed by the laws of the Federal Republic of Nigeria.
              <br />
              For any questions, please contact us at{" "}
              <a href="mailto:echelontix@gmail.com" className="text-blue-600 hover:underline">
                echelontix@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
