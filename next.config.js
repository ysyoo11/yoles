/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'productimages.coles.com.au',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
