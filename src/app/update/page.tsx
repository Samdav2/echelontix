'use client';

import React, { useState, useEffect, useCallback, FormEvent, ChangeEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { User, AtSign, Phone, Home, Building, Save, Loader2, AlertCircle } from 'lucide-react';

// --- Type Definitions ---
interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  brandName?: string; // Optional, for creators
}

// --- Main Component ---
export default function UpdateProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    user_id: '',
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    brandName: '',
  });
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasBrandName, setHasBrandName] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;

  // Effect to populate the form directly from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      // If no user data, redirect to sign-in immediately.
      router.push('/auth/signin');
      return;
    }

    try {
        const parsedData = JSON.parse(storedUserData);

        // Validate essential data exists
        if (!parsedData?.user_id) {
            alert("Session invalid. Please sign in again.");
            router.push('/auth/signin');
            return;
        }

        // Set the user ID for the submission payload
        setUserId(parsedData.user_id);

        // Determine if the user is a creator with a brand
        if (parsedData.brandname) {
            setHasBrandName(true);
        }

        // Construct the profile object from localStorage data
        const profileFromStorage: UserProfile = {
            user_id: parsedData.user_id,
            name: parsedData.name || '',
            email: parsedData.email || '',
            phoneNo: parsedData.phoneno || '', // Map 'phoneno' from localStorage to 'phoneNo'
            address: parsedData.address || '',
            brandName: parsedData.brandname || '',
        };

        // Set the state to pre-fill the form fields
        setProfile(profileFromStorage);
        setInitialProfile(profileFromStorage); // Save initial state to compare for changes

    } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
        setError("Your session data appears to be corrupted. Please sign out and sign in again.");
    } finally {
        // Data loading is complete (or failed), so turn off the loader.
        setIsLoading(false);
    }
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Determine the correct API endpoint based on whether the user has a brand
    const updateUrl = hasBrandName
      ? `${url}profile/updatecreator` // API for creators
      : `${url}profile/updateuser`;    // API for regular users

    // The payload includes the userId and all fields from the form state.
    const payload = {
        userId,
        ...profile,
    };

    try {
      await axios.put(updateUrl, payload);
      alert("Profile updated successfully!");

      // OPTIONAL: Update localStorage with the new profile details
      const updatedUserData = {
          ...JSON.parse(localStorage.getItem('userData') || '{}'),
          name: profile.name,
          email: profile.email,
          phoneno: profile.phoneNo,
          address: profile.address,
          brandname: profile.brandName,
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      router.push('/dashboard/creator'); // Navigate to a relevant page
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "An unexpected error occurred.";
      console.error("Update failed:", err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize whether the form has changed to control the submit button's state
  const hasChanges = useMemo(() => {
    if (!initialProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(initialProfile);
  }, [profile, initialProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-400"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-8 bg-black/20 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-center mb-2">Update Profile</h1>
        <p className="text-gray-400 text-center mb-8">Keep your information up to date.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-4 pl-12 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-4 pl-12 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone Number"
              value={profile.phoneNo}
              onChange={handleChange}
              className="w-full p-4 pl-12 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Your Address"
              value={profile.address}
              onChange={handleChange}
              className="w-full p-4 pl-12 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
              required
            />
          </div>

          {/* Conditionally render the Brand Name field */}
          {hasBrandName && (
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="brandName"
                placeholder="Brand Name"
                value={profile.brandName}
                onChange={handleChange}
                className="w-full p-4 pl-12 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                required
              />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg"
            >
              <AlertCircle size={20} />
              <p>{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-4 rounded-lg hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save />
                Save Changes
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
