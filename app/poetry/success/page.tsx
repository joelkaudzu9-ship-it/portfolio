'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowLeft } from 'lucide-react'

export default function PoetrySuccessPage() {
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) clearInterval(timer)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-950 dark:to-black py-8 sm:py-12">
      <div className="container-custom max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden text-center p-8">
          
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Thank you for purchasing <strong>"Threads of Becoming"</strong>
          </p>
          
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your poetry collection has been sent to:
            </p>
            <p className="font-medium text-amber-600 mt-1">{email}</p>
            <Mail size={16} className="inline ml-2 text-amber-500" />
          </div>
          
          <div className="mt-6 space-y-3">
            <Link
              href="/poetry/download"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all"
            >
              <Download size={18} />
              Download Your Poetry Collection
            </Link>
            
            <Link
              href="/poetry"
              className="inline-flex items-center justify-center gap-2 w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:border-amber-500 hover:text-amber-500 transition-all"
            >
              <ArrowLeft size={16} />
              Back to Poetry
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            Redirecting to poetry page in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  )
}