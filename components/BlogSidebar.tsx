'use client'

import Link from 'next/link'
import { Search, Tag, Calendar, TrendingUp, Sparkles } from 'lucide-react'
import Newsletter from './Newsletter'
import { useState, useEffect } from 'react'

interface BlogSidebarProps {
  posts?: any[]
}

export default function BlogSidebar({ posts = [] }: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPosts(filtered.slice(0, 3))
    } else {
      setFilteredPosts([])
    }
  }, [searchTerm, posts])

  // Get recent posts (last 4)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  // Popular tags (dynamic from actual posts or fallback)
  const extractTags = () => {
    const tagCounts: { [key: string]: number } = {}
    // You can extract tags from post content or use categories
    // For now, using meaningful tags relevant to your content
    const defaultTags = [
      { name: 'Healthcare', count: 5 },
      { name: 'Digital Health', count: 4 },
      { name: 'Innovation', count: 3 },
      { name: 'Africa', count: 3 },
      { name: 'AI', count: 2 },
      { name: 'Leadership', count: 2 },
    ]
    return defaultTags
  }

  const tags = extractTags()

  return (
    <div className="space-y-5">
      {/* Search Bar - Clean */}
      <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <Search size={14} className="text-amber-500" />
            Search articles
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or topic..."
              className="w-full px-3 py-2 pl-9 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Search Results */}
          {searchTerm && filteredPosts.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-500">Found in:</p>
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          )}
          {searchTerm && filteredPosts.length === 0 && (
            <p className="mt-3 text-xs text-gray-500">No matching articles found</p>
          )}
        </div>
      </div>

      {/* Newsletter - Clean & Premium */}
      <div className="rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-amber-500" />
            <h3 className="font-semibold text-sm">Newsletter</h3>
          </div>
          <p className="text-text-muted text-xs mb-3">
            Get insights on healthcare tech and innovation in Africa.
          </p>
          <Newsletter />
        </div>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" />
              Recent posts
            </h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <p className="text-sm text-text-secondary group-hover:text-amber-500 transition-colors line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {tags.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Tag size={14} className="text-amber-500" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/blog/tag/${tag.name.toLowerCase()}`}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-amber-500/20 rounded-md text-xs text-text-secondary hover:text-amber-500 transition-all"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats - Clean */}
      <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <TrendingUp size={14} className="text-amber-500" />
            Stats
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted">Total articles</span>
            <span className="text-lg font-bold text-amber-500">{posts.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}