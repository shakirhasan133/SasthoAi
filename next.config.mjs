/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable experimental features that might cause layout router issues
    serverComponentsExternalPackages: [],
  },
  // Ensure proper React 18 compatibility
  reactStrictMode: true,
  // Disable SWC minification temporarily if issues persist
  swcMinify: false,
  // Add proper error handling
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

export default nextConfig
