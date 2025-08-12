/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable dynamic API routes for email functionality
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: { unoptimized: true },
};

module.exports = nextConfig;
