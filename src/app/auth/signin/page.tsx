'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected: Use 'next/navigation' for the App Router
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// A custom component to display API feedback (errors or success messages)
const Alert: React.FC<{ message: string; type: 'error' | 'success' }> = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = 'w-full text-center p-3 rounded-lg mb-4 text-sm';
  const typeClasses = type === 'error'
    ? 'bg-red-100 border border-red-400 text-red-700'
    : 'bg-green-100 border border-green-400 text-green-700';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {message}
    </div>
  );
};

const SignInPage: React.FC = () => {
  const router = useRouter(); // Initialize the router

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for UI feedback
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /**
   * Handles the form submission, saves user data, and redirects.
   */
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const user = { email, password };
      const loginUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${loginUrl}auth/login`, user);

      if (response.data) {
        setSuccessMessage("Login Successful! Redirecting...");
        console.log(response.data)


        localStorage.setItem('userData', JSON.stringify(response.data.profile));


        const redirectPath = response.data.profile.brandname
          ? '/dashboard/creator'
          : '/dashboard/attendee';

        // Redirect the user after a short delay
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials or server error. Please try again.');
      }
    } finally {

    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/assets/ba.jpg')" }}
    >
      <div className="w-full max-w-md backdrop-blur-lg bg-black/30 border border-white/40 rounded-2xl p-8 shadow-xl">
        {/* Logo */}
        <div className="mx-auto mb-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-black flex items-center justify-center">
            <img src="/assets/capo.svg" alt="Logo" className="h-16 object-contain"/>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Welcome Back</h1>
        <h3 className="font-bold mb-3 text-white">Please Log In To Your Account</h3>

        <form onSubmit={handleSignIn} noValidate>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-white/50 mb-3 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            required
            autoComplete="email"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/50 rounded-lg mb-2 py-3 pl-4 pr-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              required
              autoComplete="current-password"
            />
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-3.5" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-300" /> : <Eye className="w-5 h-5 text-gray-300" />}
            </button>
          </div>

          {/* Remember me */}
          <label className="flex items-center mb-4 space-x-2 text-sm text-white">
            <input type="checkbox" className="form-checkbox accent-white bg-transparent" defaultChecked />
            <span>Remember me</span>
          </label>

          {/* Feedback Messages */}
          <Alert message={error!} type="error" />
          <Alert message={successMessage!} type="success" />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-400" />
          <span className="px-2 text-sm text-blue-400">
            <a href="/reset-pass" className="text-blue-400 font-semibold underline">Forgot Password?</a>
          </span>
          <div className="flex-grow border-t border-gray-400" />
        </div>

        {/* Footer */}
        <p className="text-sm text-white mt-6 text-center">
          Don't have an account?{' '}
          <a href="/choose-role" className="text-blue-400 font-semibold underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
