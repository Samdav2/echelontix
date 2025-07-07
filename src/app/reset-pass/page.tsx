'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, Loader2, X, ShieldCheck } from 'lucide-react';

// --- Reusable UI Components ---
const Alert: React.FC<{ message: string; type: 'error' | 'success' }> = ({ message, type }) => {
  if (!message) return null;
  const styles = type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400';
  return <div className={`p-3 rounded-lg text-center text-sm font-medium ${styles}`}>{message}</div>;
};

// --- Verification Modal Component ---
const VerificationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isVerifying,
  error
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  isVerifying: boolean;
  error: string | null;
}) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-gray-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <header className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X /></button>
            </header>
            <form onSubmit={handleSubmit} className="p-8">
              <p className="text-gray-400 mb-6 text-center">A code has been sent to your email. Please enter it below to reset your password.</p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="------"
                className="w-full text-center text-4xl tracking-[0.5em] font-mono p-4 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                maxLength={6}
                required
              />
              {error && <div className="mt-4"><Alert message={error} type="error" /></div>}
              <button
                type="submit"
                disabled={isVerifying || code.length < 5}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-3 rounded-full hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                Verify & Reset
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page Component ---
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  // Step 1: Request the reset code to be sent to the user's email
  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    const url = process.env.NEXT_PUBLIC_API_URL
    try {
      const resetUrl = `${url}auth/resetpassword`;
      await axios.put(resetUrl, { email, newPassword });
      setSuccessMessage("Verification code sent successfully!");
      setIsModalOpen(true); // Open modal on success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the code and finalize the password reset
  const handleVerifyAndReset = async (code: string) => {
    setIsVerifying(true);
    setError(null);
    const url = process.env.NEXT_PUBLIC_API_URL
    try {
        const verifyUrl = `${url}auth/verify`;
        await axios.post(verifyUrl, { email, code, newPassword });

        alert("Password reset successfully! Redirecting to login.");
        router.push('/auth/signin');

    } catch (err: any) {
        setError(err.response?.data?.message || "Invalid verification code.");
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <>
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVerifyAndReset}
        isVerifying={isVerifying}
        error={error}
      />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/assets/ba.jpg')" }}></div>
        <div className="relative w-full max-w-md text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Professional overlay container */}
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="inline-block p-4 bg-yellow-400/10 rounded-full mb-6 border-2 border-yellow-400/20">
                <KeyRound className="w-10 h-10 text-yellow-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Forgot Password</h1>
              <p className="text-gray-400 mb-8">Enter your email and new password to begin the reset process.</p>

              <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-4 pl-12 rounded-lg bg-gray-800/50 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                    required
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full p-4 pl-12 rounded-lg bg-gray-800/50 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                    required
                  />
                </div>
                {/* Confirm Password Field */}
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full p-4 pl-12 rounded-lg bg-gray-800/50 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                    required
                  />
                </div>

                {error && !isModalOpen && <Alert message={error} type="error" />}
                {successMessage && !isModalOpen && <Alert message={successMessage} type="success" />}

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black font-bold py-3 rounded-full hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-wait mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Send Reset Code'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
