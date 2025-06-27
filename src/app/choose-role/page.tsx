'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShieldCheck } from 'lucide-react';
import React from 'react';

const roles = [
  {
    title: 'User',
    description: 'Explore and register for events tailored just for you.',
    icon: <User className="w-8 h-8 text-indigo-600" />,
    value: 'user',
  },
  {
    title: 'Admin',
    description: 'Manage events, users, and the platform efficiently.',
    icon: <ShieldCheck className="w-8 h-8 text-rose-600" />,
    value: 'admin',
  },
];

const ChooseRolePage: React.FC = () => {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    router.push(`/auth/signup?role=${role}`);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4 mt-10 text-gray-800"
        >
          Join Echelontix
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-4 text-base md:text-lg"
        >
          Select a role to continue to the signup process.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleRoleSelect(role.value)}
              className="cursor-pointer bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{role.title}</h3>
              <p className="text-sm text-gray-600">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseRolePage;
