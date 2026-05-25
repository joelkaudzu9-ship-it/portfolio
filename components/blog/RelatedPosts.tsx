'use client'

import Link from 'next/link'
import { Calendar, Eye } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  created_at: string
  views: number
}

interface RelatedPostsProps {
  currentPostId: number
  currentTags?: string[]
  allPosts: Post[]
}

export default function RelatedPosts({ currentPostId, allPosts }: RelatedPostsProps) {
  // Simple related posts: just show recent posts excluding current
  const relatedPosts = allPosts
    .filter(p => p.id !== currentPostId)
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-bold text-text-primary mb-6">You might also like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group p-4 rounded-xl bg-surface/50 border border-border hover:border-accent-gold/30 transition-all"
          >
            <h4 className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-2 text-sm">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {post.views || 0}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}