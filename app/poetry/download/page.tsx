'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Download, Loader2, AlertCircle, CheckCircle, 
  ArrowLeft, BookOpen, Heart, Sparkles, FileText
} from 'lucide-react'

export default function PoetryDownloadPage() {
  const searchParams = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  useEffect(() => {
    if (email && token) {
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
      setSuccess(true)
    } catch (err) {
      setError('Download failed. Please contact support for assistance.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-black py-12 sm:py-16">
      <div className="container-custom max-w-md mx-auto px-4 sm:px-6">
        
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Poetry
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Decorative Header */}
          <div className="relative h-24 bg-gradient-to-r from-amber-500 to-amber-700">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900">
                <FileText size={28} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="pt-10 pb-8 px-6 text-center">
            
            {downloading ? (
              <>
                <Loader2 size={48} className="animate-spin text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preparing your download...</h2>
                <p className="text-gray-500 text-sm mt-2">Please wait while we get your poetry collection ready</p>
              </>
            ) : error ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Download Failed</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                <button
                  onClick={handleDownload}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all"
                >
                  Try Again
                </button>
              </>
            ) : success ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Download Complete!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your copy of <strong>"Threads of Becoming"</strong> has been downloaded
                </p>
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
                  <Heart size={16} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Thank you for supporting my work! If you enjoyed the collection, please consider sharing it with others.
                  </p>
                </div>
              </>
            ) : (
              <>
                <BookOpen size={48} className="text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ready to Download</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Your poetry collection is waiting for you
                </p>
                <button
                  onClick={handleDownload}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Download size={18} />
                  Download Poetry Collection
                </button>
              </>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Sparkles size={14} className="text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-gray-400">
                Threads of Becoming — Poems on Life, Growth, and Struggle
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}