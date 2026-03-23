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
      }
    ],
  },
};

export default nextConfig;
