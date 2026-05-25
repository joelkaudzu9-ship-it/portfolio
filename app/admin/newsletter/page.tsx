'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Download, Trash2, Users, Send } from 'lucide-react'

type Subscriber = {
  id: number
  email: string
  subscribed_at: string
  status: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
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
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status']
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.subscribed_at).toLocaleDateString(),
      s.status || 'active'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  const activeSubscribers = subscribers.filter(s => s.status !== 'unsubscribed')
  const inactiveSubscribers = subscribers.filter(s => s.status === 'unsubscribed')

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text-gold">Newsletter Subscribers</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/newsletter/broadcast"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <Send size={16} /> Send Broadcast
            </Link>
            <button
              onClick={exportCSV}
              className="btn-outline inline-flex items-center gap-2 text-sm"
              disabled={subscribers.length === 0}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass-card p-3 sm:p-4 text-center">
            <Users className="mx-auto mb-1 sm:mb-2 text-amber-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{activeSubscribers.length}</div>
            <div className="text-xs text-text-muted">Active Subscribers</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Mail className="mx-auto mb-1 sm:mb-2 text-gray-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{inactiveSubscribers.length}</div>
            <div className="text-xs text-text-muted">Unsubscribed</div>
          </div>
        </div>

        <div className="space-y-2">
          {activeSubscribers.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No subscribers yet.</p>
              <p className="text-text-muted text-sm mt-2">Share your newsletter signup form to start building your list!</p>
            </div>
          ) : (
            activeSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 glass-card">
                <div>
                  <p className="font-semibold text-text-primary break-all">{subscriber.email}</p>
                  <p className="text-xs text-text-muted mt-1">
                    Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}