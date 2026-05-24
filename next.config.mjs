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
  // React Compiler is NOT enabled by default - remove or install the package
  // If you want React Compiler, uncomment the line below AND run:
  // npm install babel-plugin-react-compiler
  // reactCompiler: true,
  // Reduce initial bundle size (swcMinify is deprecated in Next.js 16+)
  // swcMinify is now enabled by default, no need to specify
  poweredByHeader: false,
}

export default nextConfig