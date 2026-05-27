'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowLeft, Loader2, Copy } from 'lucide-react'

export default function PoetrySuccessPage() {
  const searchParams = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const tx_ref = searchParams.get('tx_ref') || ''
  const emailParam = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

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
      alert('Download failed. Please try the email option.')
    } finally {
      setDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    let email = prompt('Enter your email address to receive the download link:', emailParam)
    if (!email) return
    
    setSendingEmail(true)
    try {
      const response = await fetch('/api/poetry/send-download-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, tx_ref })
      })
      
      if (response.ok) {
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 5000)
      } else {
        alert('Failed to send email. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }

  const copyDownloadLink = () => {
    const link = `${window.location.origin}/poetry/download?email=${encodeURIComponent(emailParam)}&token=${tx_ref}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-950 dark:to-black py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Thank you for purchasing <strong>"Threads of Becoming"</strong>
          </p>
          
          <div className="mt-6 space-y-3">
            {/* Option 1: Download Now */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Download Now
            </button>
            
            {/* Option 2: Send to Email */}
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2"
            >
              {sendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              Send to Email
            </button>
            
            {emailSent && (
              <p className="text-green-500 text-sm text-center animate-pulse">
                ✓ Download link sent! Check your inbox.
              </p>
            )}
          </div>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
            </div>
          </div>
          
          {/* Copy Link Option */}
          <button
            onClick={copyDownloadLink}
            className="text-sm text-amber-500 hover:underline flex items-center justify-center gap-1 w-full"
          >
            <Copy size={14} />
            {copied ? 'Link copied!' : 'Copy download link'}
          </button>
          
          <Link
            href="/poetry"
            className="inline-flex items-center justify-center gap-2 w-full mt-6 py-3 text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Back to Poetry
          </Link>
        </div>
      </div>
    </div>
  )
}