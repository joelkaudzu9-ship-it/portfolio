'use client'

import Link from 'next/link'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function PoetryFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-950 dark:to-black py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <XCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Failed</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your payment could not be processed. Please try again.
        </p>
        
        <div className="mt-6 space-y-3">
          <Link
            href="/poetry/buy"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all"
          >
            Try Again
          </Link>
          
          <Link
            href="/poetry"
            className="inline-flex items-center justify-center gap-2 w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Poetry
          </Link>
        </div>
      </div>
    </div>
  )
}