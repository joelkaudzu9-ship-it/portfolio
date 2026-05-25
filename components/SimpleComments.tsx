'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, User, Calendar, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react'

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [authorFocused, setAuthorFocused] = useState(false)
  const [contentFocused, setContentFocused] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

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
      setMessage({ type: 'error', text: 'Please enter your name and comment' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setSubmitting(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, author: author.trim(), content: content.trim() }),
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: '✨ Comment submitted for moderation! It will appear once approved.' })
        setContent('')
        fetchComments()
        setShowForm(false) // Collapse form after submission
        
        setTimeout(() => setMessage(null), 5000)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to post comment' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="comments-section" className="mt-12 pt-6 border-t border-border scroll-mt-20">
      {/* Header with gradient */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <MessageCircle size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Comments</h3>
            <p className="text-xs text-text-muted">
              {comments.length} {comments.length === 1 ? 'person has' : 'people have'} joined the conversation
            </p>
          </div>
        </div>
        
        {/* Toggle Form Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors text-sm"
        >
          {showForm ? 'Cancel' : 'Join the discussion'}
          <ChevronDown size={14} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Comments List - ABOVE the form */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 size={28} className="animate-spin text-amber-500 mb-3" />
          <p className="text-text-muted text-sm">Loading conversations...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 border-dashed">
          <div className="text-4xl mb-2">💭</div>
          <p className="text-text-muted font-medium text-sm">No comments yet</p>
          <p className="text-xs text-text-muted/70 mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-all duration-300 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                    <span className="text-amber-500 font-semibold text-xs">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-amber-500 text-sm">
                    {comment.author}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-text-muted/50">#{comments.length - index}</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Comment Form - Now appears BELOW the comments */}
      {showForm && (
        <div className="rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 overflow-hidden mt-4">
          <div className="p-4 sm:p-5">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <span>✍️</span> Share your thoughts
            </h4>
            <p className="text-xs text-text-muted mb-3">
              Your email won't be published. Comments are moderated.
            </p>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              {/* Name input */}
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all ${authorFocused || author ? 'text-amber-500' : 'text-text-muted'}`}>
                  <User size={14} />
                </div>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onFocus={() => setAuthorFocused(true)}
                  onBlur={() => setAuthorFocused(false)}
                  placeholder="Your name *"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-sm"
                  required
                />
              </div>
              
              {/* Comment textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setContentFocused(true)}
                onBlur={() => setContentFocused(false)}
                placeholder="What are your thoughts? *"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-none text-sm"
                required
              />
              
              {/* Submit button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50 text-sm font-medium"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Post Comment
                    </>
                  )}
                </button>
                
                <p className="text-xs text-text-muted">
                  Your comment will appear after moderation ✨
                </p>
              </div>
              
              {/* Message alert */}
              {message && (
                <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  <span>{message.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}