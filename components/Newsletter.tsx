'use client'

import { useState } from 'react'
import { Send, CheckCircle, XCircle, Mail } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Thanks for subscribing!')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="text-center mb-4">
        <Mail className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold gradient-text-gold">Subscribe to My Newsletter</h3>
        <p className="text-text-secondary text-sm mt-2">
          Get updates on my projects, healthcare innovation, and African tech delivered to your inbox.
        </p>
      </div>
      
      {status === 'success' ? (
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-green-500 font-medium">{message}</p>
          <p className="text-text-muted text-sm mt-2">Check your inbox for a welcome email!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-amber-500/50 focus:outline-none transition-colors"
          />
          <input
            type="email"
            placeholder="Email address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-amber-500/50 focus:outline-none transition-colors"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'loading' ? (
              'Subscribing...'
            ) : (
              <>
                <Send size={16} /> Subscribe
              </>
            )}
          </button>
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
              <XCircle size={14} />
              <span>{message}</span>
            </div>
          )}
          <p className="text-text-muted text-xs text-center">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  )
}