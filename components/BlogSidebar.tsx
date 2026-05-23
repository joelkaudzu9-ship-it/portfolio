'use client'

import Link from 'next/link'
import { Search, Tag, Calendar, TrendingUp } from 'lucide-react'
import Newsletter from './Newsletter'
import { useState } from 'react'

interface BlogSidebarProps {
  posts?: any[]  // Add this to accept posts
}

export default function BlogSidebar({ posts = [] }: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Get unique tags from posts (you can customize these)
  const getAllTags = () => {
    // This would come from your post tags if you have them
    // For now, return some default tags
    return [
      { name: 'Healthcare', count: 5 },
      { name: 'Technology', count: 8 },
      { name: 'Innovation', count: 4 },
      { name: 'Africa', count: 6 },
      { name: 'Digital Health', count: 3 },
      { name: 'AI', count: 2 },
    ]
  }
  
  // Get recent posts (last 5)
  const getRecentPosts = () => {
    if (!posts || posts.length === 0) return []
    return [...posts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  }
  
  // Get categories/archives by month
  const getArchives = () => {
    if (!posts || posts.length === 0) return []
    const archives: { [key: string]: number } = {}
    posts.forEach(post => {
      const date = new Date(post.created_at)
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      archives[monthYear] = (archives[monthYear] || 0) + 1
    })
    return Object.entries(archives).map(([name, count]) => ({ name, count }))
  }
  
  const recentPosts = getRecentPosts()
  const tags = getAllTags()
  const archives = getArchives()

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
          <Search size={16} className="text-accent-gold" />
          Search
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-2 pr-10 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary text-sm"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>
      
      {/* Newsletter Subscription */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
          📧 Newsletter
        </h3>
        <p className="text-text-muted text-sm mb-3">
          Get the latest insights on healthcare tech and innovation in Africa.
        </p>
        <Newsletter />
      </div>
      
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
            <Calendar size={16} className="text-accent-gold" />
            Recent Posts
          </h3>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <p className="text-sm text-text-secondary group-hover:text-accent-gold transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Popular Tags */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
          <Tag size={16} className="text-accent-gold" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/blog/tag/${tag.name.toLowerCase()}`}
              className="px-2 py-1 bg-surface hover:bg-accent-gold/20 rounded-full text-xs text-text-secondary hover:text-accent-gold transition-colors"
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>
      
      {/* Archives */}
      {archives.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-gold" />
            Archives
          </h3>
          <div className="space-y-2">
            {archives.map((archive) => (
              <Link
                key={archive.name}
                href={`/blog/archive/${archive.name.toLowerCase().replace(/ /g, '-')}`}
                className="flex justify-between items-center text-sm text-text-secondary hover:text-accent-gold transition-colors"
              >
                <span>{archive.name}</span>
                <span className="text-xs text-text-muted">{archive.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}