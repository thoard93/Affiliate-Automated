/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p16-oec-va.ibyteimg.com', // TikTok product images
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com', // Discord avatars
      },
      {
        protocol: 'https',
        hostname: 'p16-sign-va.tiktokcdn.com', // TikTok profile images
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
