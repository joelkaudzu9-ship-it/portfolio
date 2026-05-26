'use client'

import { Suspense } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition inline-block">
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <NotFoundContent />
      </ThemeProvider>
    </Suspense>
  )
}