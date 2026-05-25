'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Email required')
      return
    }

    setStatus('loading')
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('Subscribed! 🎉')
        setEmail('')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        const error = await res.json()
        setStatus('error')
        setMessage(error.error || 'Failed')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setMessage('Network error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-3 py-2 text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <p className={`text-xs ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </form>
  )
}