/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',

  // Prevent ESLint errors from blocking builds (optional, keep if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Prevent TypeScript errors from being ignored during build ✅
  typescript: {
    ignoreBuildErrors: false, // ⛔ Make type errors block build
  },

  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
