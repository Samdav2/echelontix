"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
} from "react-icons/fa";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const signin = () => router.push("/auth/signin");
  const home = () => router.push("/home");
  const explore = () => router.push("/explore");
  const goToAbout = () => router.push("/about");
  const pricing = () => router.push("/pricing");
  const team = () => router.push("/team");

  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Let’s Connect there</h2>
        <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300">
          HIRE US
        </button>
      </div>

      <hr className="border-gray-700 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3 uppercase">Links</h3>
          <ul className="space-y-2">
            <li><button onClick={home} className="hover:underline">Home</button></li>
            <li><button onClick={goToAbout} className="hover:underline">About Us</button></li>
            <li><button onClick={explore} className="hover:underline">Book Tickets</button></li>
            <li><button onClick={pricing} className="hover:underline">Pricing</button></li>
            <li><button onClick={() => router.push('/faq')} className="hover:underline">FAQ</button></li>
            <li><button onClick={() => router.push('/refund-policy')} className="hover:underline">Refund Policy</button></li>


          </ul>
        </div>

        {/* Join Us */}
        <div>
          <h3 className="font-semibold mb-3 uppercase">Join Us</h3>
          <ul className="space-y-2">
            <li><button onClick={signin} className="hover:underline">Sign in</button></li>
            <li><button onClick={home} className="hover:underline">Sign out</button></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-3 uppercase">Contact Us</h3>
          <p>Contact us on Echelontix for more updates</p>
          <p>Provide details for follow-up or queries regarding booking</p>

          <div className="flex gap-4 mt-4 text-yellow-400 text-lg">
            <a href="#"><FaFacebookF /></a>
            <a href="https://www.instagram.com/echelontix?igsh=MWtxc2JkOWk5a29waQ=="><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaPaperPlane /></a>
          </div>

          <div className="mt-8">
            <a href="/terms-condition" className="hover:underline text-sm mr-4">
               Terms & Conditions
            </a>
            <a href="/privacy-policy" className="hover:underline text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 mt-8 mb-4" />

      <div className="text-center text-xs text-gray-400">
        ©2024 ECHELONTIX. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
