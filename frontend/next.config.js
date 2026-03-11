/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // তোমার প্রজেক্টে যদি বাইরে থেকে কোনো প্রোফাইল পিকচার বা লোগো লোড করো
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com'],
  },
  // তোমার এপিআই রুটের জন্য সিকিউরিটি হেডার
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

