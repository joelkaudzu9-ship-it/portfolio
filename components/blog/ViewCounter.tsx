'use client'

import { useEffect } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
  views: number
}

export default function ViewCounter({ slug, views }: ViewCounterProps) {
  useEffect(() => {
    // Increment view count when page is viewed
    fetch(`/api/blog/${slug}/views`, { method: 'POST' }).catch(console.error)
  }, [slug])

  return (
    <span className="flex items-center gap-1 text-text-muted text-sm">
      <Eye size={14} /> {views.toLocaleString()} views
    </span>
  )
}