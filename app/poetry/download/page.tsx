'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Download, Heart, Share2, 
  ArrowLeft, CheckCircle, Lock, FileText 
} from 'lucide-react'

export default function PoetryDownloadPage() {
  const [downloading, setDownloading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user came from successful payment
    const hasAccess = sessionStorage.getItem('poetry_access') === 'true'
    if (hasAccess) {
      setVerified(true)
    }
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Check if email has purchased
    const response = await fetch('/api/poetry/verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    if (data.hasAccess) {
      setVerified(true)
      sessionStorage.setItem('poetry_access', 'true')
    } else {
      alert('No purchase found for this email. Please buy the collection first.')
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    
    // Trigger PDF download
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
    
    setDownloading(false)
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-950 dark:to-black py-8 sm:py-12">
        <div className="container-custom max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Lock size={32} className="text-amber-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Protected Content</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Please enter the email you used to purchase "Threads of Becoming"
            </p>
            
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all"
              >
                Verify Access
              </button>
            </form>
            
            <Link
              href="/poetry/buy"
              className="inline-block mt-4 text-amber-500 text-sm hover:underline"
            >
              Buy the collection → 
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-950 dark:to-black py-8 sm:py-12">
      <div className="container-custom max-w-2xl mx-auto px-4 sm:px-6">
        
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Poetry
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Threads of Becoming</h1>
            <p className="text-amber-200 mt-1">Poetry Collection by Joel George Kaudzu</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Granted!</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                You can now download your poetry collection
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's Inside:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-center gap-2">✓ <strong>13 original poems</strong> across 4 sections</li>
                <li className="flex items-center gap-2">✓ <strong>Broken and Becoming</strong> - Personal transformation</li>
                <li className="flex items-center gap-2">✓ <strong>Light Through the Storm</strong> - Hope and resilience</li>
                <li className="flex items-center gap-2">✓ <strong>Infinite Thoughts</strong> - Deep reflections</li>
                <li className="flex items-center gap-2">✓ <strong>Society and Reality Check</strong> - Critical observations</li>
              </ul>
            </div>
            
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>Processing...</>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF (MK 200)
                </>
              )}
            </button>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-amber-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Share Your Thoughts</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loved the collection? Share your thoughts on social media and tag me!
              </p>
              <div className="flex gap-3 mt-3">
                <a href="https://twitter.com/intent/tweet?text=I just read %22Threads of Becoming%22 by Joel Kaudzu - a beautiful poetry collection on life, growth, and struggle. Get your copy here:&url=https://joelkaudzu-portfolio.vercel.app/poetry" target="_blank" className="flex items-center gap-1 text-sm text-gray-600 hover:text-amber-500 transition">
                  <Share2 size={14} /> Share on X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}