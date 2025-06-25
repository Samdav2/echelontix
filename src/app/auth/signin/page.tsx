'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'attendee@example.com' && password === 'password') {
      router.push('/dashboard/attendee');
    } else if (email === 'organizer@example.com' && password === 'password') {
      router.push('/dashboard/organizer');
    } else if (email === 'admin@example.com' && password === 'password') {
      router.push('/dashboard/admin');
    } else {
      setError('Invalid email or password.');
    }
  };

  const goToForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10 backdrop-blur-lg bg-white/30"
      style={{
        backgroundImage: "url('/assets/ba.jpg')",
      }}
    >
      <div className="w-full max-w-md backdrop-blur-lg bg-black/30 border border-white/40 rounded-2xl p-8 shadow-xl">
        {/* Logo */}
        <div className="mx-auto mb-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-black flex items-center justify-center">
            <img
              src="/assets/capo.svg"
              alt="Logo"
              className="h-16 object-contain"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-black text-center">
          Welcome Back
        </h1>

        <h3 className="font-bold mb-3 text-black">Please LogIn Your Account</h3>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSignIn}>
          {/* Email */}
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border border-black mb-3 rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full border border-black rounded-lg mb-2 py-3 pl-4 pr-10 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <EyeOff
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              />
            )}
          </div>

          {/* Remember me */}
          <label className="flex items-center mb-3 space-x-2 text-sm text-black">
            <input
              type="checkbox"
              className="form-checkbox accent-black"
              defaultChecked
            />
            <span>Remember me</span>
          </label>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider with forgotten password */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <button
            type="button"
            onClick={goToForgotPassword}
            className="px-2 text-sm text-blue-700 hover:underline"
          >
            Forgotten Password
          </button>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Footer */}
        <p className="text-sm text-black mt-6 text-center">
          Don't have an account?{' '}
          <a href="/signUp" className="text-blue-600 font-semibold underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
