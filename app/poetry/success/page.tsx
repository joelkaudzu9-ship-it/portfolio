'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowLeft, Loader2 } from 'lucide-react'

export default function PoetrySuccessPage() {
  const searchParams = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [purchaseSaved, setPurchaseSaved] = useState(false)
  
  const tx_ref = searchParams.get('tx_ref') || ''
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  // Save purchase automatically when page loads
  useEffect(() => {
    if (tx_ref && !purchaseSaved) {
      savePurchase()
    }
  }, [tx_ref])

  const savePurchase = async () => {
    try {
      await fetch('/api/poetry/save-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_ref, email, name })
      })
      setPurchaseSaved(true)
    } catch (error) {
      console.error('Failed to save purchase:', error)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/poetry/download-pdf')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Threads_of_Becoming_Joel_Kaudzu.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Download failed. Please use the link sent to your email.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-950 dark:to-black py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful! 🎉</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Thank you for purchasing <strong>"Threads of Becoming"</strong>
        </p>
        
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Your poetry collection is ready to download:
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download Now
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Mail size={16} className="text-blue-500 inline mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            A download link has also been sent to your email.
          </span>
        </div>
        
        <div className="mt-6 space-y-3">
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