'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    if (id) {
      fetch(`/api/blog/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title || '')
          setSlug(data.slug || '')
          setExcerpt(data.excerpt || '')
          setContent(data.content || '')
          setPublished(data.published || false)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const res = await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, excerpt, content, published }),
    })
    
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      alert('Failed to update post')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Content (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary font-mono text-sm"
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
              <span className="text-sm text-text-secondary">Published</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}