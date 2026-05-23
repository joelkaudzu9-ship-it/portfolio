'use client'

import { X, Link2, Check } from 'lucide-react'
import { useState } from 'react'

// Alternative: Use a custom LinkedIn SVG
const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
  </svg>
)

interface SocialShareProps {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://joelkaudzu.netlify.app${url}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted">Share:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-surface border border-border hover:border-amber-500/30 transition-colors"
        aria-label="Share on X (Twitter)"
      >
        <X size={16} className="text-text-secondary" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-surface border border-border hover:border-amber-500/30 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-surface border border-border hover:border-amber-500/30 transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} className="text-text-secondary" />}
      </button>
    </div>
  )
}