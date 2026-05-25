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
  views?: number
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
      {/* Clean Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Blog
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Thoughts on medicine, technology, and building the future in Africa
            </p>
          </div>
          
          {/* Sort buttons - subtle */}
          <div className="flex gap-1">
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortOrder === 'newest' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortOrder === 'oldest' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
        
        {/* Subtle divider */}
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mt-4 sm:mt-5" />
      </div>

      {/* Grid Layout - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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