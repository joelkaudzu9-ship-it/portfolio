'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Mail, Download, Trash2, Users, Send, 
  CheckCircle, AlertCircle, Loader2, TrendingUp, 
  Calendar, XCircle, Copy, FileText, Sparkles
} from 'lucide-react'

type Subscriber = {
  id: number
  email: string
  subscribed_at: string
  status: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchSubscribers()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter/subscribers')
      const data = await res.json()
      setSubscribers(data || [])
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Failed to load subscribers' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async (id: number, email: string) => {
    if (!confirm(`Remove ${email} from the newsletter list?`)) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: `${email} has been unsubscribed` })
        fetchSubscribers()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to unsubscribe' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const exportCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status']
    const rows = filteredSubscribers.map(s => [
      s.email,
      new Date(s.subscribed_at).toLocaleString(),
      s.status || 'active'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    setMessage({ type: 'success', text: 'CSV exported successfully!' })
    setTimeout(() => setMessage(null), 2000)
  }

  const copyEmailList = () => {
    const emails = filteredSubscribers.map(s => s.email).join(', ')
    navigator.clipboard.writeText(emails)
    setMessage({ type: 'success', text: `${filteredSubscribers.length} email${filteredSubscribers.length !== 1 ? 's' : ''} copied!` })
    setTimeout(() => setMessage(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading subscribers...</span>
        </div>
      </div>
    )
  }

  const activeSubscribers = subscribers.filter(s => s.status !== 'unsubscribed')
  const inactiveSubscribers = subscribers.filter(s => s.status === 'unsubscribed')
  
  const filteredSubscribers = activeSubscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate growth metrics
  const getSubscribersByMonth = () => {
    const months: { [key: string]: number } = {}
    activeSubscribers.forEach(s => {
      const date = new Date(s.subscribed_at)
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      months[monthYear] = (months[monthYear] || 0) + 1
    })
    return Object.entries(months).slice(-6)
  }

  const monthlyData = getSubscribersByMonth()
  const totalGrowth = activeSubscribers.length

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6 max-w-6xl mx-auto">
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
              <Mail size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Audience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Newsletter Subscribers
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your email list and send broadcasts
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <Users size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{subscribers.length}</div>
            <div className="text-xs text-text-muted">all time</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Active</span>
              <Mail size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{activeSubscribers.length}</div>
            <div className="text-xs text-text-muted">subscribed</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Unsubscribed</span>
              <XCircle size={14} className="text-red-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-red-500">{inactiveSubscribers.length}</div>
            <div className="text-xs text-text-muted">removed</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Growth</span>
              <TrendingUp size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-blue-500">+{totalGrowth}</div>
            <div className="text-xs text-text-muted">total active</div>
          </div>
        </div>

        {/* Growth Chart */}
        {monthlyData.length > 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-4 mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-amber-500" />
              Subscriber Growth (Last 6 Months)
            </h3>
            <div className="flex items-end gap-2 h-32">
              {monthlyData.map(([month, count], idx) => {
                const maxCount = Math.max(...monthlyData.map(([, c]) => c), 1)
                const height = (count / maxCount) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-amber-500/20 rounded-t-lg transition-all duration-300" style={{ height: `${height}%`, minHeight: '4px' }}>
                      <div className="w-full bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-lg" style={{ height: `${height}%`, minHeight: '4px' }} />
                    </div>
                    <span className="text-xs text-text-muted">{count}</span>
                    <span className="text-xs text-text-muted">{month.split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/newsletter/broadcast"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-medium hover:scale-[1.02] transition-all"
            >
              <Send size={14} /> Send Broadcast
            </Link>
            <button
              onClick={exportCSV}
              disabled={activeSubscribers.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={copyEmailList}
              disabled={activeSubscribers.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Copy size={14} /> Copy Emails
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails..."
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm w-full sm:w-64"
          />
        </div>

        {/* Subscribers List */}
        <div className="space-y-2">
          {filteredSubscribers.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
              <Mail size={40} className="mx-auto mb-3 text-text-muted/40" />
              <p className="text-text-secondary">
                {searchTerm ? 'No matching subscribers found.' : 'No subscribers yet.'}
              </p>
              {!searchTerm && (
                <p className="text-text-muted text-sm mt-2">
                  Share your newsletter signup form to start building your list!
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-text-muted">
                  {filteredSubscribers.length} of {activeSubscribers.length} active subscribers
                </p>
              </div>
              
              <div className="space-y-2">
                {filteredSubscribers.map((subscriber) => (
                  <div 
                    key={subscriber.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-500 font-semibold text-xs">
                            {subscriber.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-semibold text-text-primary break-all text-sm">
                          {subscriber.email}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                      <button
                        onClick={() => unsubscribe(subscriber.id, subscriber.email)}
                        disabled={actionLoading === subscriber.id}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group"
                        title="Remove subscriber"
                      >
                        {actionLoading === subscriber.id ? (
                          <Loader2 size={14} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={14} className="text-red-400 group-hover:text-red-500" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-500 mb-1">Newsletter Tips</h4>
              <ul className="text-xs text-text-muted space-y-1">
                <li>• Send consistently to keep your audience engaged</li>
                <li>• Share valuable insights, not just promotions</li>
                <li>• Track open rates to see what resonates</li>
                <li>• Include a clear unsubscribe link (GDPR compliant)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}