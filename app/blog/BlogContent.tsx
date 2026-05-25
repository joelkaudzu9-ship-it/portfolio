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
      {/* Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <span className="text-amber-500 text-sm font-semibold">Blog</span>
          <p className="text-text-muted text-xs mt-0.5">Healthcare & tech insights</p>
        </div>
        
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              sortOrder === 'newest' 
                ? 'bg-amber-500 text-white' 
                : 'bg-surface border border-border hover:border-amber-500/30'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              sortOrder === 'oldest' 
                ? 'bg-amber-500 text-white' 
                : 'bg-surface border border-border hover:border-amber-500/30'
            }`}
          >
            Oldest
          </button>
        </div>
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