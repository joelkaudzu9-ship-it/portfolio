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
  // Enable faster navigation and better performance
  experimental: {
    // Keeps pages in memory longer for instant back/forward navigation
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Optimize client-side navigation
    optimizeServerReact: true,
  },
  // Compress responses for faster loading
  compress: true,
  // Enable React compiler for better performance (if using React 19+)
  reactCompiler: true,
  // Reduce initial bundle size
  swcMinify: true,
  // Configure for faster page loads
  poweredByHeader: false,
  // Enable turbopack for development (faster refresh)
  turbopack: {
    resolveAlias: {
      // Optional: add aliases if needed
    },
  },
}

export default nextConfig