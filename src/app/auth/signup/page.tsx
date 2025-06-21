'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10  backdrop-blur-lg bg-white/30"
      style={{
        backgroundImage: "url('/assets/ba.jpg')", // Replace with your background image path
      }}
    >
      <div className="w-full max-w-xl max-w-md backdrop-blur-lg bg-black/30 border border-white/40 rounded-2xl p-8 shadow-xl">
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

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6 text-black text-center">
          Welcome to ECHELONTIX
        </h1>

        <h3 className=" font-bold mb-3 text-black ">
          Please Create Your Account
        </h3>

        {/* Form */}
        <form className="space-y-4">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-black rounded-lg py-3 px-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full border border-black rounded-lg py-3 pl-4 pr-10 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            {showConfirmPassword ? (
              <EyeOff
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              />
            )}
          </div>

          {/* Remember me */}
          <label className="flex items-center space-x-2 text-sm text-black">
            <input
              type="checkbox"
              className="form-checkbox accent-black"
              defaultChecked
            />
            <span>Remember me</span>
          </label>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 transition"
          >
            Sign up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-sm text-black-700">Or Sign up with</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="flex justify-center p-3 border rounded-full bg-white/70">
            <img src="/assets/google-icon.svg" alt="Google" className="w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-black mt-6 text-center">
          Already have an account?{' '}
          <a href="/signIn" className="text-blue-600 font-semibold underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
