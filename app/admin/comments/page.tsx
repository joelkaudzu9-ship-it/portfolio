'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, CheckCircle, XCircle, Trash2, MessageCircle, 
  Users, Clock, CheckCircle2, AlertCircle, Loader2,
  Eye, Calendar, User, ExternalLink
} from 'lucide-react'

type Comment = {
  id: number
  post_slug: string
  author: string
  content: string
  approved: boolean
  created_at: string
  post_title?: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
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
      setMessage({ type: 'error', text: 'Failed to load comments' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const approveComment = async (id: number) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/comments/${id}/approve`, { method: 'POST' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Comment approved!' })
        fetchComments()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to approve comment' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteComment = async (id: number) => {
    if (!confirm('Delete this comment? This action cannot be undone.')) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Comment deleted!' })
        fetchComments()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete comment' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = comments.filter(c => !c.approved).length
  const approvedCount = comments.filter(c => c.approved).length
  
  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.approved
    if (filter === 'approved') return comment.approved
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading comments...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <MessageCircle size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Manage Comments
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Approve or delete comments from your blog posts
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <MessageCircle size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{comments.length}</div>
            <div className="text-xs text-text-muted">comments</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Pending</span>
              <Clock size={14} className="text-yellow-500" />
            </div>
            <div className={`text-xl font-bold mt-1 ${pendingCount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {pendingCount}
            </div>
            <div className="text-xs text-text-muted">awaiting approval</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Approved</span>
              <CheckCircle size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{approvedCount}</div>
            <div className="text-xs text-text-muted">published</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === 'all'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              filter === 'pending'
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Clock size={12} /> Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              filter === 'approved'
                ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <CheckCircle size={12} /> Approved ({approvedCount})
          </button>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-12 text-center">
            <MessageCircle size={40} className="mx-auto mb-3 text-text-muted/40" />
            <p className="text-text-secondary">No {filter !== 'all' ? filter : ''} comments found.</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-3 text-amber-500 text-sm hover:underline"
              >
                View all comments
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <div 
                key={comment.id} 
                className={`rounded-xl bg-white dark:bg-gray-900/50 border ${
                  !comment.approved 
                    ? 'border-yellow-500/30 bg-yellow-500/5' 
                    : 'border-gray-200 dark:border-gray-800'
                } p-4 transition-all hover:border-amber-500/30`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                          <span className="text-amber-500 font-semibold text-xs">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-amber-500 text-sm">
                          {comment.author}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <Link 
                        href={`/blog/${comment.post_slug}`}
                        target="_blank"
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ExternalLink size={10} />
                        /{comment.post_slug}
                      </Link>
                      {!comment.approved && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                      {comment.approved && (
                        <span className="text-xs bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} /> Approved
                        </span>
                      )}
                    </div>
                    
                    {/* Comment Content */}
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                    {!comment.approved && (
                      <button
                        onClick={() => approveComment(comment.id)}
                        disabled={actionLoading === comment.id}
                        className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        title="Approve comment"
                      >
                        {actionLoading === comment.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      disabled={actionLoading === comment.id}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      {actionLoading === comment.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {filteredComments.length > 0 && (
          <div className="mt-4 pt-3 text-center">
            <p className="text-xs text-text-muted">
              Showing {filteredComments.length} of {comments.length} total comments
            </p>
          </div>
        )}
      </div>
    </div>
  )
}