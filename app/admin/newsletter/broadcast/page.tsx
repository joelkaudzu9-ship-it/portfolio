'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react'

export default function BroadcastPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sendTo, setSendTo] = useState('active')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required')
      return
    }
    
    if (!confirm(`Send to ${sendTo === 'active' ? 'active' : 'all'} subscribers?`)) {
      return
    }
    
    setSending(true)
    setError('')
    setResult(null)
    
    try {
      const res = await fetch('/api/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, sendTo }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setResult({ sent: data.sent, failed: data.failed, total: data.total })
        setSubject('')
        setContent('')
      } else {
        setError(data.error || 'Failed to send broadcast')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link href="/admin/newsletter" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all">
            <ArrowLeft size={18} /> Back to Newsletter
          </Link>
          <h1 className="text-2xl font-bold gradient-text-gold">Send Newsletter</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your newsletter subject"
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
              required
            />
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Content (HTML supported) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write your newsletter content here. HTML supported: &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;"
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none font-mono text-sm text-text-primary"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Tip: Use &lt;h2&gt; for headings, &lt;ul&gt; for lists, and &lt;a href="#"&gt; for links
            </p>
          </div>
          
          <div className="glass-card p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Send to
            </label>
            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
            >
              <option value="active">Active Subscribers Only</option>
            </select>
          </div>
          
          {content && (
            <div className="glass-card p-4 sm:p-6">
              <h3 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
                <Mail size={16} className="text-accent-gold" />
                Preview
              </h3>
              <div className="p-4 rounded-lg bg-surface border border-border">
                <div className="text-sm font-semibold text-accent-gold mb-2">{subject || 'Subject preview'}</div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content || 'Your content will appear here...' }} />
                </div>
              </div>
            </div>
          )}
          
          {result && (
            <div className="glass-card p-4 sm:p-6 bg-green-500/10 border-green-500">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <CheckCircle size={20} />
                <span className="font-semibold">Broadcast Sent!</span>
              </div>
              <p className="text-sm text-text-secondary">
                Sent: {result.sent} | Failed: {result.failed} | Total: {result.total}
              </p>
            </div>
          )}
          
          {error && (
            <div className="glass-card p-4 sm:p-6 bg-red-500/10 border-red-500">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 pb-8">
            <button
              type="submit"
              disabled={sending}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Broadcast
                </>
              )}
            </button>
            <Link
              href="/admin/newsletter"
              className="px-6 py-3 border border-border rounded-lg hover:bg-surface transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}