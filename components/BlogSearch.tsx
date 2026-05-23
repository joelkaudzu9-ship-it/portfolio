'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  created_at: string
  published: boolean  // Add this line
}

export default function BlogSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch all posts for search
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setAllPosts(data.filter((p: Post) => p.published === true))) // Explicit true check
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true)
      const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered.slice(0, 5))
      setLoading(false)
    } else {
      setResults([])
    }
  }, [query, allPosts])

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-surface border border-border hover:border-amber-500/30 transition-colors"
        aria-label="Search"
      >
        <Search size={18} className="text-text-secondary" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl mx-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-4">
                <Search size={20} className="text-amber-500" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-text-primary"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              {query.length > 1 && (
                <div className="border-t border-border pt-3 mt-2">
                  {loading ? (
                    <p className="text-text-secondary text-center py-4">Searching...</p>
                  ) : results.length > 0 ? (
                    <div className="space-y-2">
                      {results.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-lg hover:bg-surface transition-colors"
                        >
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-text-muted line-clamp-1">{post.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-center py-4">No results found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}