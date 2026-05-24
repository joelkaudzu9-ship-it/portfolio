/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Keep pages in memory for instant back/forward navigation
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Optimize client-side navigation
    optimizeServerReact: true,
  },
  // Compress responses for faster loading
  compress: true,
  // Remove powered by header for slightly better performance
  poweredByHeader: false,
}

export default nextConfig