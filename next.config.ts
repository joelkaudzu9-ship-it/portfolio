/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Vercel handles this automatically, but good to have
  output: 'standalone',
}

module.exports = nextConfig