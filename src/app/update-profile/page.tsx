'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserCircle } from 'lucide-react';

export default function UpdateProfile() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    router.push('/dashboard/organizer');
  };

  return (
    <div className="min-h-screen flex items-center bg-white justify-center px-4 md:px-8 py-10 ">
      <div className="w-full max-w-xl bg-white border-2 rounded-2xl p-6 md:p-10 shadow-xl">
        {/* User Icon */}
        <div className="flex justify-center mb-4">
          <UserCircle className="w-20 h-20 text-gray-500" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-black text-center">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-black">BrandName</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-white border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-black font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-white border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-black font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded bg-white border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            ></textarea>
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium text-black">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-2 pr-10 rounded bg-white border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {showPassword ? (
              <EyeOff
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 w-5 h-5 text-gray-400 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 w-5 h-5 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-300 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
