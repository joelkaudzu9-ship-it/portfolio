'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Download, Mail, ArrowLeft, Loader2, 
  Sparkles, Heart, BookOpen, Star, Share2, 
  Link as LinkIcon, Check
} from 'lucide-react'
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa'

export default function PoetrySuccessPage() {
  const searchParams = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [purchase, setPurchase] = useState<{email: string; name: string} | null>(null)
  
  const tx_ref = searchParams.get('tx_ref') || ''
  const emailParam = searchParams.get('email') || ''
  const nameParam = searchParams.get('name') || ''

  // Fetch purchase details if not in URL
  useEffect(() => {
    const fetchPurchase = async () => {
      if (tx_ref && !emailParam) {
        const res = await fetch(`/api/poetry/purchase-details?tx_ref=${tx_ref}`)
        const data = await res.json()
        if (data.email) {
          setPurchase({ email: data.email, name: data.name })
        }
      }
    }
    fetchPurchase()
  }, [tx_ref])

  const userEmail = emailParam || purchase?.email || ''
  const userName = nameParam || purchase?.name || 'Reader'

  useEffect(() => {
    if (tx_ref && userEmail) {
      fetch('/api/poetry/save-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_ref, email: userEmail, name: userName, status: 'completed' })
      })
    }
  }, [tx_ref, userEmail])

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
    if (!userEmail) {
      alert('No email found. Please contact support.')
      return
    }
    
    setSendingEmail(true)
    try {
      const response = await fetch('/api/poetry/send-download-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: userName, tx_ref })
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

  const shareText = `I just purchased "Threads of Becoming" by Joel Kaudzu - a beautiful poetry collection on life, growth, and struggle. Get your copy here:`
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/poetry` : 'https://joelkaudzu-portfolio.vercel.app/poetry'

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Threads of Becoming - Poetry Collection')}&summary=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-black py-12 sm:py-16">
      <div className="container-custom max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <Link href="/poetry" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group no-print">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Poetry
        </Link>

        {/* Premium Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Decorative Header */}
          <div className="relative h-32 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="pt-10 pb-8 px-6 sm:px-8">
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles size={14} className="text-amber-500" />
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you, <span className="font-semibold text-amber-600">{userName}</span>
                </p>
                <Sparkles size={14} className="text-amber-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                Your copy of <strong>"Threads of Becoming"</strong> is ready
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 py-4 border-y border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <BookOpen size={18} className="mx-auto text-amber-500 mb-1" />
                <p className="text-xs text-gray-500">13 Poems</p>
              </div>
              <div className="text-center">
                <Heart size={18} className="mx-auto text-rose-500 mb-1" />
                <p className="text-xs text-gray-500">4 Sections</p>
              </div>
              <div className="text-center">
                <Star size={18} className="mx-auto text-amber-500 mb-1" />
                <p className="text-xs text-gray-500">Instant Access</p>
              </div>
            </div>

            {/* Download Options */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Download Now
              </button>
              
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="w-full py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all flex items-center justify-center gap-2"
              >
                {sendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                Receive PDF by Email
              </button>

              {emailSent && (
                <p className="text-green-500 text-sm text-center animate-pulse flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> PDF sent to {userEmail}! Check your inbox and attachments.
                </p>
              )}
            </div>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-400">or</span>
              </div>
            </div>
            
            {/* Helpful Note */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 The PDF is also attached to the email we send you. 
                Please check your spam folder if you don't see it within a few minutes.
              </p>
            </div>

            {/* Support Note */}
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Having trouble downloading? Contact me at <a href="mailto:joelkaudzu9@gmail.com" className="text-amber-600 hover:underline">joelkaudzu9@gmail.com</a>
              </p>
            </div>

            {/* Enhanced Share Section */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-3">Share your experience</p>
                
                {/* Share Dropdown Toggle */}
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400"
                >
                  <Share2 size={14} />
                  Share this poetry collection
                  <ChevronDown size={14} className={`transition-transform ${shareOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Share Options */}
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* Twitter */}
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-all text-sm"
                      >
                        <Twitter size={16} />
                        <span className="hidden sm:inline">Twitter</span>
                      </a>

                      {/* Facebook */}
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2] transition-all text-sm"
                      >
                        <Facebook size={16} />
                        <span className="hidden sm:inline">Facebook</span>
                      </a>

                      {/* LinkedIn */}
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] transition-all text-sm"
                      >
                        <Linkedin size={16} />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.563 1.098 3.677l-1.267 3.788 3.864-1.257c1.083.54 2.281.829 3.527.828 3.181 0 5.767-2.586 5.768-5.766.002-3.18-2.585-5.766-5.766-5.766zM12.031 18.5c-1.091.001-2.164-.263-3.105-.762l-3.351 1.082 1.076-3.263c-.58-.978-.891-2.095-.891-3.242 0-3.504 2.851-6.355 6.355-6.355 1.741.001 3.376.689 4.606 1.918 1.229 1.229 1.903 2.858 1.902 4.595-.001 3.503-2.85 6.354-6.355 6.354z"/>
                        </svg>
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {/* Telegram */}
                      <a
                        href={shareLinks.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#26A5E4]/10 hover:bg-[#26A5E4]/20 text-[#26A5E4] transition-all text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.26-2.18 1.38-.12.08-1.27.83-1.45.9-.25.1-.51.1-.75-.03-.31-.15-.99-.39-1.51-.76-.68-.48-1.21-.74-.06-.77.71-.01 1.36-.3 1.97-.65 1.07-.62 2.09-1.25 3.03-1.83 1.27-.79 2.32-1.17 3.14-1.14.18.01.39.04.58.19.14.11.2.26.22.42.02.12.04.28.02.48z"/>
                        </svg>
                        <span className="hidden sm:inline">Telegram</span>
                      </a>

                      {/* Copy Link */}
                      <button
                        onClick={copyShareLink}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm text-gray-600 dark:text-gray-400"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}