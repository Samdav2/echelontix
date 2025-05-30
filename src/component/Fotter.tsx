import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
} from "react-icons/fa";

const Footer: React.FC = () => {
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
          <h3 className="font-semibold mb-3 uppercase">Link</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Event</a></li>
            <li><a href="#" className="hover:underline">Team</a></li>
            <li><a href="#" className="hover:underline">Book Tickets</a></li>
          </ul>
        </div>

        {/* Join Us */}
        <div>
          <h3 className="font-semibold mb-3 uppercase">Join Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Sign in</a></li>
            <li><a href="#" className="hover:underline">Sign out</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-3 uppercase">Contact Us</h3>
          <p>Contact us on Owl_Initiators for more update</p>
          <p>Provide details for follow-up or queries regarding the booking</p>

          <div className="flex gap-4 mt-4 text-yellow-400 text-lg">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaPaperPlane /></a>
          </div>

          <div className="mt-4">
            <a href="#" className="hover:underline text-sm mr-4">
              User Terms & Conditions
            </a>
            <a href="#" className="hover:underline text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 mt-8 mb-4" />

      <div className="text-center text-xs text-gray-400">
        ©2024 ECHELONTIX. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;
