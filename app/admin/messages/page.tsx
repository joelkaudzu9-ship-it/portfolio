'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, CheckCircle, Trash2 } from 'lucide-react'

type Message = {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchMessages()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
    fetchMessages()
  }

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    fetchMessages()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold rounded-full text-sm">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Mail size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="text-text-secondary">No messages yet.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`glass-card p-6 transition-all ${!message.read ? 'border-accent-gold/50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      {!message.read && (
                        <span className="text-xs px-2 py-0.5 rounded bg-accent-gold/20 text-accent-gold">New</span>
                      )}
                    </div>
                    <p className="text-accent-gold text-sm mb-3">{message.email}</p>
                    <p className="text-text-secondary leading-relaxed">{message.message}</p>
                    <p className="text-xs text-text-muted mt-3">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-2 rounded-lg hover:bg-green-500/10 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle size={18} className="text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}