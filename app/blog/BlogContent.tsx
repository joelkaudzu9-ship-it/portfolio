'use client'

import { useState, useEffect } from 'react'
import BlogHeader from '@/components/blog/BlogHeader'
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
      <BlogHeader sortOrder={sortOrder} onSortChange={setSortOrder} />
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