import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'app.samdavweb.org.ng',
      },
      {
        protocol: 'https',
        hostname: 'app.echelontix.com.ng',
      },
      {
        protocol: 'https',
        hostname: 'echelon-backend.onrender.com/',
      }
    ],
  },
};

export default nextConfig;
