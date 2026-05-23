'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'

type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  created_at: string
}

export default function AdminBlogPage() {
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
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Blog Posts</h1>
          <Link href="/admin/new-post" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> New Post
          </Link>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No posts yet.</p>
              <Link href="/admin/new-post" className="text-accent-gold hover:underline mt-2 inline-block">
                Create your first post →
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 glass-card">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-text-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${post.published ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-surface transition-colors">
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