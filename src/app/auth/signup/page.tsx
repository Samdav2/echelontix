"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from '../../../hooks/useAuth';

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signUp, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(form); 
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url('/images/create.jpg')` }}
    >
      <div className="w-full max-w-xl bg-black bg-opacity-60 rounded-2xl p-8 md:p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
           {loading ? "Signing up....." :  "SIGN UP"}
          </button>
        </form>
        <p className="text-center text-white text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-red-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
