'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RelatedPostsProps {
  currentId: number
  currentTags?: string[]
}

export default function RelatedPosts({ currentId, currentTags }: RelatedPostsProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        // Filter out current post and get 3 random posts
        const otherPosts = data.filter((p: any) => p.id !== currentId && p.published)
        const randomPosts = otherPosts.sort(() => 0.5 - Math.random()).slice(0, 3)
        setPosts(randomPosts)
        setLoading(false)
      })
  }, [currentId])

  if (loading || posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-bold mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <div className="glass-card p-4 hover:border-amber-500/30 transition-all">
              <h4 className="font-semibold mb-2 line-clamp-2">{post.title}</h4>
              <p className="text-text-muted text-sm line-clamp-2">{post.excerpt}</p>
              <div className="mt-3 text-amber-500 text-sm">Read more →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}