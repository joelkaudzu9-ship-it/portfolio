'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Download, Trash2, Users } from 'lucide-react'

type Subscriber = {
  id: number
  email: string
  name: string
  subscribed_at: string
  is_active: boolean
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
    const headers = ['Email', 'Name', 'Subscribed Date', 'Status']
    const rows = subscribers.map(s => [
      s.email,
      s.name || '',
      new Date(s.subscribed_at).toLocaleDateString(),
      s.is_active ? 'Active' : 'Unsubscribed'
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

  const activeSubscribers = subscribers.filter(s => s.is_active)
  const inactiveSubscribers = subscribers.filter(s => !s.is_active)

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Newsletter Subscribers</h1>
          <button
            onClick={exportCSV}
            className="btn-primary inline-flex items-center gap-2"
            disabled={subscribers.length === 0}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <Users className="mx-auto mb-2 text-amber-500" size={24} />
            <div className="text-2xl font-bold">{activeSubscribers.length}</div>
            <div className="text-xs text-text-muted">Active Subscribers</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Mail className="mx-auto mb-2 text-amber-500" size={24} />
            <div className="text-2xl font-bold">{inactiveSubscribers.length}</div>
            <div className="text-xs text-text-muted">Unsubscribed</div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="space-y-2">
          {activeSubscribers.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No subscribers yet.</p>
            </div>
          ) : (
            activeSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex items-center justify-between p-4 glass-card">
                <div>
                  <p className="font-semibold">{subscriber.email}</p>
                  {subscriber.name && <p className="text-sm text-text-muted">{subscriber.name}</p>}
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