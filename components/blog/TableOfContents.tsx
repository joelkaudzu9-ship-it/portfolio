'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))
    
    const extractedHeadings = matches.map((match) => ({
      level: match[1].length,
      text: match[2].trim(),
      id: match[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }))
    
    setHeadings(extractedHeadings)
  }, [content])

  if (headings.length === 0) return null

  return (
    <div className="hidden lg:block fixed left-8 top-1/3 w-64">
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-accent-gold mb-3">On this page</h3>
        <nav className="space-y-1">
          {headings.map((heading, idx) => (
            <a
              key={idx}
              href={`#${heading.id}`}
              className={`block text-xs text-text-muted hover:text-accent-gold transition-colors ${
                heading.level === 3 ? 'pl-3' : ''
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}