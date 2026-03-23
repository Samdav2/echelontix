'use-clint'

import React from 'react'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 2025</p>

        <p className="text-gray-700 mb-8">
          At <span className="font-semibold">Echelontix</span>, we value fairness while maintaining
          event integrity.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {/* Eligible Refunds */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Eligible Refunds</h2>
            <p className="text-gray-700 mb-2">
              Refunds may be granted in the following cases:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Event cancellation or postponement by the organizer.</li>
              <li>Duplicate payment or technical error during purchase.</li>
              <li>Incorrect charge due to system fault.</li>
            </ul>
          </section>

          {/* Non-Refundable Cases */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Non-Refundable Cases</h2>
            <p className="text-gray-700 mb-2">
              Refunds will not apply to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>No-shows or late arrivals.</li>
              <li>Tickets purchased under promo/discount offers.</li>
              <li>Canceled attendance by the customer less than 72 hours before the event.</li>
              <li>Resold or transferred tickets without official authorization.</li>
            </ul>
          </section>

          {/* Refund Timeline */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Refund Timeline</h2>
            <p className="text-gray-700 mb-4">
              Approved refunds will be processed within{" "}
              <span className="font-semibold">7–14 working days</span> back to the original
              payment method.
            </p>
            <p className="text-gray-700">
              To request a refund, email us at{" "}
              <a
                href="mailto:echelontix@gmail.com"
                className="text-blue-600 hover:underline"
              >
                echelontix@gmail.com
              </a>{" "}
              with your ticket ID and proof of payment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

