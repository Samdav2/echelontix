'use-client'

import React from 'react'
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 2025</p>

        <p className="text-gray-700 mb-8">
          <span className="font-semibold">Echelontix</span> values your privacy and is committed to
          protecting your personal data.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Name, email, and phone number</li>
              <li>Payment details (processed securely via Paystack)</li>
              <li>Event preferences and attendance history</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To process ticket purchases and send confirmations</li>
              <li>To communicate important updates about your event</li>
              <li>To improve customer experience and event offerings</li>
              <li>For fraud prevention and security</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Protection</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Payments are securely handled through Paystack.</li>
              <li>We do not store your card details on our servers.</li>
              <li>We use industry-standard security to protect your data.</li>
            </ul>
          </section>

          {/* Sharing Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Sharing Information</h2>
            <p className="text-gray-700 mb-2">
              We do not sell or rent customer data. Information may only be shared with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Event organizers (for access control)</li>
              <li>Payment processors (Paystack)</li>
              <li>Regulatory authorities when legally required</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
            <p className="text-gray-700 mb-2">You may:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Request access to your data</li>
              <li>Ask us to update or delete your information</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
            <p className="text-gray-700">
              For privacy inquiries, email us at{" "}
              <a
                href="mailto:echelontix@gmail.com"
                className="text-blue-600 hover:underline"
              >
                echelontix@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
