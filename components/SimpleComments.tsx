'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, User, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

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
        
        // Scroll to top of comments section
        const commentsSection = document.getElementById('comments-section')
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        
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
    <div id="comments-section" className="mt-16 pt-8 border-t border-border scroll-mt-20">
      {/* Header with gradient */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-gold/10">
            <MessageCircle size={22} className="text-accent-gold" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Comments</h3>
            <p className="text-sm text-text-muted">
              Join the conversation • {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        
        {/* Comment count badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-surface border border-border text-sm">
            💬 {comments.length}
          </div>
        </div>
      </div>
      
      {/* Comment Form - Modern card design */}
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-sm border border-border overflow-hidden shadow-lg">
        <div className="p-5 sm:p-6">
          <h4 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <span>✍️</span> Share your thoughts
          </h4>
          <p className="text-sm text-text-muted mb-4">
            Your email won't be published. Comments are moderated.
          </p>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Name input with floating label effect */}
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all ${authorFocused || author ? 'text-accent-gold' : 'text-text-muted'}`}>
                <User size={18} />
              </div>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                onFocus={() => setAuthorFocused(true)}
                onBlur={() => setAuthorFocused(false)}
                placeholder="Your name *"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all text-sm sm:text-base"
                required
              />
            </div>
            
            {/* Comment textarea */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setContentFocused(true)}
                onBlur={() => setContentFocused(false)}
                placeholder="What are your thoughts? *"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all resize-none text-sm sm:text-base"
                required
              />
            </div>
            
            {/* Submit button with loading state */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-gold to-accent-goldLight text-background rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-lg font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Post Comment
                  </>
                )}
              </button>
              
              <p className="text-xs text-text-muted text-center sm:text-left">
                Your comment will appear after moderation ✨
              </p>
            </div>
            
            {/* Message alert */}
            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-500'
              }`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span className="text-sm">{message.text}</span>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Comments List - Smart and responsive */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-accent-gold mb-3" />
          <p className="text-text-muted">Loading conversations...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-surface/20 border border-border border-dashed">
          <div className="text-5xl mb-3">💭</div>
          <p className="text-text-muted font-medium">No comments yet</p>
          <p className="text-sm text-text-muted/70 mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className="group p-5 rounded-xl bg-surface/20 hover:bg-surface/30 transition-all duration-300 border border-border/50 hover:border-accent-gold/20"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center">
                    <span className="text-accent-gold font-semibold text-sm">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-accent-gold">
                    {comment.author}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar size={12} />
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
              <p className="text-text-secondary leading-relaxed pl-10 sm:pl-10">
                {comment.content}
              </p>
            </div>
          ))}
          
          {/* Total comments footer */}
          <div className="pt-4 text-center">
            <p className="text-sm text-text-muted">
              {comments.length} {comments.length === 1 ? 'person has' : 'people have'} joined the conversation
            </p>
          </div>
        </div>
      )}
    </div>
  )
}