'use client'

import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  content: string
}

export default function ReadingTime({ content }: ReadingTimeProps) {
  const wordsPerMinute = 200
  const words = content.replace(/[#*`]/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  const readingTime = minutes < 1 ? '1 min' : `${minutes} min`

  return (
    <div className="flex items-center gap-1 text-sm text-text-muted">
      <Clock size={14} />
      <span>{readingTime} read</span>
    </div>
  )
}