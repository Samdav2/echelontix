/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.samdavweb.org.ng',
        port: '',
        pathname: '/uploads/**', // Allows any image from the /uploads/ directory
      },
    ],
  },
};

module.exports = nextConfig;
