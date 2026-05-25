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
      {/* Premium Personal Header */}
      <div className="mb-10 sm:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            {/* From the desk badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-amber-500 text-sm">✍️</span>
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                From the desk of Joel Kaudzu
              </span>
            </div>
            
            {/* Main title with gradient and underline effect */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Writing on 
              <span className="relative inline-block ml-2">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  healthcare
                </span>
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-amber-500/20" viewBox="0 0 100 8">
                  <path d="M0 3.5 Q 50 7 100 3.5" stroke="currentColor" fill="none" strokeWidth="1.5"/>
                </svg>
              </span>
              <br className="hidden xs:block" />
              <span className="text-text-primary">technology &amp;</span>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent ml-2">
                African innovation
              </span>
            </h1>
            
            {/* Description - personal and mission-driven */}
            <p className="text-text-secondary text-sm mt-3 max-w-lg leading-relaxed">
              Documenting my journey building systems that improve lives — from MoyoWanga to beyond.
              Exploring the intersection of medicine, code, and impact.
            </p>
          </div>
          
          {/* Stats badge and sort buttons container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Stats badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-xs order-2 sm:order-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-text-muted">{posts.length} article{posts.length !== 1 ? 's' : ''} published</span>
            </div>
            
            {/* Sort buttons */}
            <div className="flex gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setSortOrder('newest')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortOrder === 'newest' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortOrder === 'oldest' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Oldest
              </button>
            </div>
          </div>
        </div>
        
        {/* Elegant divider with accent */}
        <div className="relative mt-5 pt-1">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="text-amber-500 text-lg leading-none">●</span>
            <span className="text-text-muted/70 text-xs tracking-wide">Exploring ideas at the intersection of medicine, technology &amp; African innovation</span>
            <span className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
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