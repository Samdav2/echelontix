'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const SubscribeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenSubscribeModal');
    if (!hasSeenPopup) {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('hasSeenSubscribeModal', 'true');
      }, 2000); // Show after 2 seconds
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log('Subscribed email:', email);
    setSubmitted(true);
    setTimeout(() => setIsOpen(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Stay Updated</h2>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to get notified about upcoming events.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm transition"
              >
                Subscribe
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold text-green-600">Thank you!</h3>
            <p className="text-sm text-gray-600 mt-2">You've been subscribed.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SubscribeModal;
