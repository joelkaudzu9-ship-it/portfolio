'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Download, Loader2, AlertCircle } from 'lucide-react'

export default function PoetryDownloadPage() {
  const searchParams = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  useEffect(() => {
    if (email && token) {
      // Auto-download when page loads
      handleDownload()
    }
  }, [])

  const handleDownload = async () => {
    setDownloading(true)
    setError('')
    try {
      const response = await fetch('/api/poetry/download-pdf')
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Threads_of_Becoming_Joel_Kaudzu.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Download failed. Please contact support.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-950 dark:to-black py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {downloading ? (
          <>
            <Loader2 size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Preparing your download...</h2>
          </>
        ) : error ? (
          <>
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-500">Download Failed</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg">Try Again</button>
          </>
        ) : (
          <>
            <Download size={40} className="text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Ready to Download</h2>
            <button onClick={handleDownload} className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg">Download Poetry Collection</button>
          </>
        )}
        
        <Link href="/poetry" className="block text-sm text-gray-500 mt-6 hover:text-amber-500">Back to Poetry</Link>
      </div>
    </div>
  )
}