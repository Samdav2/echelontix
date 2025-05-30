import React from 'react';

const Navbar = () => {
  return (
    <div className=" flex items-center justify-center bg-gray-950">
    <nav className="bg-gradient-to-r from-black to-gray-900 text-white py-2 px-4 rounded-full border border-yellow-400 flex justify-center shadow-md w-1/3 ">
      <ul className="flex space-x-6 items-center mx-w-md">
        <li>
          <a href="#" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition duration-200">Event</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition duration-200">About us</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition duration-200">Contacts</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition duration-200">Book Tickets</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition duration-200">Terms</a>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Navbar;
