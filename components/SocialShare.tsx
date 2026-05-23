'use client'

import { X, LinkedinIcon, Link2, Check } from 'lucide-react'  // Use LinkedinIcon instead
import { useState } from 'react'

interface SocialShareProps {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Construct full URL with your Netlify domain
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
        <LinkedinIcon size={16} className="text-text-secondary" />
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