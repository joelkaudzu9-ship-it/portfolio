'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, ArrowLeft, BookOpen, Calendar, CheckCircle, XCircle, TrendingUp, Eye as EyeIcon } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  created_at: string
  views?: number
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchPosts()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post? This action cannot be undone.')) return
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage({ type: 'success', text: 'Post deleted successfully!' })
      fetchPosts()
      setTimeout(() => setMessage(null), 2000)
    } else {
      setMessage({ type: 'error', text: 'Failed to delete post' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const togglePublish = async (id: number, currentStatus: boolean) => {
    const res = await fetch(`/api/blog/${id}/publish`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !currentStatus }),
    })
    if (res.ok) {
      setMessage({ type: 'success', text: `Post ${!currentStatus ? 'published' : 'unpublished'}` })
      fetchPosts()
      setTimeout(() => setMessage(null), 2000)
    }
  }

  const publishedCount = posts.filter(p => p.published).length
  const draftCount = posts.filter(p => !p.published).length
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
        {/* Back button */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <BookOpen size={16} className="text-amber-500" />
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Content</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Blog Posts
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Create, edit, and manage your articles
            </p>
          </div>
          <Link 
            href="/admin/new-post" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all text-sm font-medium"
          >
            <Plus size={16} /> New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <BookOpen size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{posts.length}</div>
            <div className="text-xs text-text-muted">posts</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Published</span>
              <CheckCircle size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{publishedCount}</div>
            <div className="text-xs text-text-muted">live</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Drafts</span>
              <XCircle size={14} className="text-yellow-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-yellow-500">{draftCount}</div>
            <div className="text-xs text-text-muted">in progress</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total Views</span>
              <EyeIcon size={14} className="text-purple-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-purple-500">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-text-muted">all time</div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Posts List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-500" />
              All Posts ({posts.length})
            </h2>
          </div>
          
          {posts.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
              <BookOpen size={40} className="mx-auto mb-3 text-text-muted/40" />
              <p className="text-text-secondary">No posts yet.</p>
              <Link 
                href="/admin/new-post" 
                className="mt-3 text-amber-500 text-sm hover:underline inline-flex items-center gap-1"
              >
                Create your first post <Plus size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm sm:text-base text-text-primary group-hover:text-amber-500 transition-colors">
                        {post.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        post.published 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {post.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <EyeIcon size={10} />
                          {post.views.toLocaleString()} views
                        </span>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        post.published 
                          ? 'hover:bg-yellow-500/10 text-yellow-500' 
                          : 'hover:bg-green-500/10 text-green-500'
                      }`}
                      title={post.published ? 'Unpublish' : 'Publish'}
                    >
                      {post.published ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      target="_blank" 
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View"
                    >
                      <Eye size={14} className="text-text-secondary" />
                    </Link>
                    <Link 
                      href={`/admin/edit-post/${post.id}`} 
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-text-secondary" />
                    </Link>
                    <button 
                      onClick={() => deletePost(post.id)} 
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}