/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enable gzip compression
  swcMinify: true, // Use the Rust-based compiler for faster builds and smaller bundles
  experimental: {
    scrollRestoration: true, // Optional, improves UX on back/forward navigation
  },
  images: {
    unoptimized: true, // Optional: disable Next.js image optimization if you're not using it
  },
};

export default nextConfig;
