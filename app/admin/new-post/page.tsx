'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, excerpt, content, published }),
    })
    
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      alert('Failed to create post')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">New Blog Post</h1>
        
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={generateSlug}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              required
            />
            <p className="text-xs text-text-muted mt-1">URL: /blog/{slug || '...'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Excerpt (Short summary)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Content (Markdown supported)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
              placeholder="Write your post here. Use **bold**, *italic*, # headings, etc."
              required
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-border text-accent-gold focus:ring-accent-gold/50"
              />
              <span className="text-sm text-text-secondary">Publish immediately</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  )
}