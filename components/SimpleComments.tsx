'use client'

import { useState, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'

interface Comment {
  id: number
  author: string
  content: string
  created_at: string
}

export default function SimpleComments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?postSlug=${postSlug}`)
      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) {
      setMessage('Please enter your name and comment')
      return
    }
    
    setSubmitting(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, author: author.trim(), content: content.trim() }),
      })
      
      if (res.ok) {
        setMessage('Comment submitted for approval!')
        setContent('')
        fetchComments() // Refresh to show new comment if approved
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await res.json()
        setMessage(error.error || 'Failed to post comment')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-accent-gold" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-xl bg-surface/50">
        <h4 className="font-medium mb-3">Leave a comment</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full sm:w-72 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts... (comments are moderated)"
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-accent-gold text-background rounded-lg hover:bg-accent-goldLight transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
          {message && (
            <p className="text-sm text-green-500">{message}</p>
          )}
        </div>
      </form>
      
      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-gold mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-text-muted text-center py-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg bg-surface/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-accent-gold">{comment.author}</span>
                <span className="text-xs text-text-muted">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}