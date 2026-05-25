'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, Trash2 } from 'lucide-react'

type Comment = {
  id: number
  post_slug: string
  author: string
  content: string
  approved: boolean
  created_at: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchComments()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments/admin')
      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveComment = async (id: number) => {
    const res = await fetch(`/api/comments/${id}/approve`, { method: 'POST' })
    if (res.ok) {
      fetchComments()
    }
  }

  const deleteComment = async (id: number) => {
    if (!confirm('Delete this comment?')) return
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchComments()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  const pendingComments = comments.filter(c => !c.approved)
  const approvedComments = comments.filter(c => c.approved)

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold gradient-text-gold mb-8">Manage Comments</h1>

        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pending Approval ({pendingComments.length})</h2>
            <div className="space-y-3">
              {pendingComments.map((comment) => (
                <div key={comment.id} className="glass-card p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-amber-500">{comment.author}</span>
                        <span className="text-xs text-text-muted">
                          on {comment.post_slug} · {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">{comment.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => approveComment(comment.id)}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Comments */}
        {approvedComments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Comments ({approvedComments.length})</h2>
            <div className="space-y-3">
              {approvedComments.map((comment) => (
                <div key={comment.id} className="glass-card p-4 opacity-75">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-xs text-text-muted">
                          on {comment.post_slug} · {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {comments.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-text-secondary">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}