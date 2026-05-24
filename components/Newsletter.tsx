'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }
    
    setStatus('loading')
    setMessage('')
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {  // Make sure this matches
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('Thanks for subscribing!')
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none transition-colors text-text-primary"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-accent-gold text-background rounded-lg text-sm font-medium hover:bg-accent-goldLight transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
          ) : status === 'success' ? (
            <Check size={16} />
          ) : (
            <Send size={16} />
          )}
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${
          status === 'success' ? 'text-green-500' : 'text-red-500'
        }`}>
          {status === 'error' && <AlertCircle size={12} />}
          {message}
        </p>
      )}
    </div>
  )
}