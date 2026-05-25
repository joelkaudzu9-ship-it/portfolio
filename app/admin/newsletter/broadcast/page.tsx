'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, CheckCircle, AlertCircle, Mail, Users, TrendingUp, Eye, Sparkles, FileText } from 'lucide-react'

export default function BroadcastPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sendTo, setSendTo] = useState('active')
  const [sending, setSending] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Fetch subscriber count
  useEffect(() => {
    fetch('/api/newsletter/subscribers')
      .then(res => res.json())
      .then(data => setSubscriberCount(data.length))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required')
      setTimeout(() => setError(''), 3000)
      return
    }
    
    if (!confirm(`Send to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}? This action cannot be undone.`)) {
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
        setTimeout(() => {
          setResult(null)
        }, 5000)
      } else {
        setError(data.error || 'Failed to send broadcast')
        setTimeout(() => setError(''), 3000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setSending(false)
    }
  }

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(w => w.length > 0).length
  }

  const getReadTime = () => {
    const words = getWordCount()
    const minutes = Math.ceil(words / 200)
    return minutes === 1 ? '1 min read' : `${minutes} min read`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom max-w-4xl px-4 sm:px-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link 
            href="/admin/newsletter" 
            className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Newsletter
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Send size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Campaign</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Send Newsletter
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Create and send email broadcasts to your subscribers
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Recipients</span>
              <Users size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{subscriberCount}</div>
            <div className="text-xs text-text-muted">active subscribers</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Word Count</span>
              <FileText size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold mt-1">{getWordCount()}</div>
            <div className="text-xs text-text-muted">words</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Read Time</span>
              <Eye size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1">{getReadTime()}</div>
            <div className="text-xs text-text-muted">estimated</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., New Blog Post: Building Healthcare Systems in Africa"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-text-primary"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              {subject.length}/100 characters
            </p>
          </div>
          
          {/* Content */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Email Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Write your newsletter content here. HTML supported: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none font-mono text-sm text-text-primary resize-y"
              required
            />
            <div className="flex flex-wrap justify-between items-center mt-2 text-xs text-text-muted">
              <span>Supports HTML formatting</span>
              <span>{content.length.toLocaleString()} characters</span>
            </div>
          </div>

          {/* Send Options */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Send Options
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  checked={sendTo === 'active'}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-text-secondary">All Active Subscribers</span>
              </label>
            </div>
            <p className="text-xs text-text-muted mt-3 flex items-center gap-1">
              <Users size={10} />
              {subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''} will receive this broadcast
            </p>
          </div>

          {/* Preview Toggle */}
          {content && (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-amber-500" />
                  <span className="font-medium text-sm">Email Preview</span>
                </div>
                <span className="text-text-muted text-sm">{showPreview ? '▼' : '▶'}</span>
              </button>
              
              {showPreview && (
                <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20">
                  <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <div className="text-xs text-text-muted mb-1">Subject:</div>
                      <div className="font-semibold text-text-primary">{subject || 'Your Subject Here'}</div>
                    </div>
                    <div className="p-5">
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: content || '<p class="text-text-muted">Your email content will appear here...</p>' 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-5">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <CheckCircle size={18} />
                <span className="font-semibold text-sm">Broadcast Sent Successfully!</span>
              </div>
              <p className="text-sm text-text-secondary">
                ✓ Sent: {result.sent} | ✗ Failed: {result.failed} | 📬 Total: {result.total}
              </p>
              <p className="text-xs text-text-muted mt-2">
                Your newsletter is on its way to {result.sent} subscriber{result.sent !== 1 ? 's' : ''}.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
              className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center text-sm font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-500 mb-1">Tips for a Great Newsletter</h4>
              <ul className="text-xs text-text-muted space-y-1">
                <li>• Keep subject lines short and compelling (under 60 characters)</li>
                <li>• Use headings and lists to make content scannable</li>
                <li>• Include a clear call-to-action for your readers</li>
                <li>• Preview your email before sending</li>
                <li>• Send during weekdays for better open rates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}