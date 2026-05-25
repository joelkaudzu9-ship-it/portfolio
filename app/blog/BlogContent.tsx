'use client'

import { useState, useEffect } from 'react'
import BlogGrid from '@/components/blog/BlogGrid'
import BlogSidebar from '@/components/BlogSidebar'
import { BlogGridSkeleton } from '@/components/skeletons/BlogGridSkeleton'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  created_at: string
  featured_image: string | null
  featured_image_type: string | null
  video_id: string | null
  media_gallery: any[]
}

export default function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data.filter((p: Post) => p.published))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  if (loading) return <BlogGridSkeleton />

  return (
    <>
      {/* Refined Header - Cleaner, more premium */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Blog
              </h1>
              <span className="text-xs text-text-muted uppercase tracking-wider hidden sm:inline">Insights</span>
            </div>
            <p className="text-text-secondary text-sm mt-2 max-w-lg leading-relaxed">
              Thoughts on medicine, technology, and building the future in Africa
            </p>
          </div>
          
          {/* Softer sort buttons */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-3 py-1 rounded-md transition-all text-sm ${
                sortOrder === 'newest' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-3 py-1 rounded-md transition-all text-sm ${
                sortOrder === 'oldest' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
        
        {/* Subtle divider - optional, adds separation without heaviness */}
        <div className="h-px bg-gradient-to-r from-border via-border to-transparent mt-5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BlogGrid posts={sortedPosts} />
        </div>
        <div className="lg:col-span-1">
          <BlogSidebar posts={posts} />
        </div>
      </div>
    </>
  )
}