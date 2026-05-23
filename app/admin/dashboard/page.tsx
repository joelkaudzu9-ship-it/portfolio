'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, LogOut, Settings } from 'lucide-react'

type Post = { 
  id: number; 
  title: string; 
  published: boolean; 
  created_at: string;
  slug?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) fetchPosts()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-custom py-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold gradient-text-gold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors text-sm"
            >
              <Settings size={16} /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Blog Posts</h2>
          <Link href="/admin/new-post" className="btn-primary inline-flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
            <Plus size={16} /> New Post
          </Link>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="glass-card p-6 sm:p-8 text-center">
              <p className="text-text-secondary">No posts yet.</p>
              <Link href="/admin/new-post" className="text-accent-gold hover:underline mt-2 inline-block">
                Create your first post →
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 glass-card">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">{post.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-xs text-text-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${post.published ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${post.slug || post.id}`} target="_blank" className="p-2 rounded-lg hover:bg-surface transition-colors">
                    <Eye size={16} className="text-text-secondary" />
                  </Link>
                  <Link href={`/admin/edit-post/${post.id}`} className="p-2 rounded-lg hover:bg-surface transition-colors">
                    <Edit size={16} className="text-text-secondary" />
                  </Link>
                  <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}