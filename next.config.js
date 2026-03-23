/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'app.samdavweb.org.ng',
        port: '',
        pathname: '/uploads/**', // Allows any image from the /uploads/ directory
      },
      {
        protocol: 'https',
        hostname: 'app.echelontix.com.ng',
      }
    ],
  },
};

module.exports = nextConfig;
