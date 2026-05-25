'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Mail, CheckCircle, Trash2, Inbox, 
  User, Calendar, Loader2, CheckCircle2, AlertCircle,
  Reply, Star, Archive, Filter
} from 'lucide-react'

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
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
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
      setMessage({ type: 'error', text: 'Failed to load messages' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Marked as read' })
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true })
        }
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to mark as read' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message? This action cannot be undone.')) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Message deleted!' })
        if (selectedMessage?.id === id) setSelectedMessage(null)
        fetchMessages()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete message' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length
  const readCount = messages.filter(m => m.read).length
  
  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.read
    if (filter === 'read') return message.read
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading messages...</span>
        </div>
      </div>
    )
  }

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
            <span className="text-xs text-text-muted uppercase tracking-wider">Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Contact form submissions from your website visitors
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <Mail size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{messages.length}</div>
            <div className="text-xs text-text-muted">messages</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Unread</span>
              <Inbox size={14} className="text-blue-500" />
            </div>
            <div className={`text-xl font-bold mt-1 ${unreadCount > 0 ? 'text-blue-500' : 'text-gray-500'}`}>
              {unreadCount}
            </div>
            <div className="text-xs text-text-muted">awaiting response</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Read</span>
              <CheckCircle size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{readCount}</div>
            <div className="text-xs text-text-muted">archived</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === 'all'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              filter === 'unread'
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Inbox size={12} /> Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              filter === 'read'
                ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <CheckCircle size={12} /> Read ({readCount})
          </button>
        </div>

        {/* Messages Grid - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Messages List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Mail size={12} className="text-amber-500" />
              Messages
            </h3>
            
            {filteredMessages.length === 0 ? (
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
                <Mail size={32} className="mx-auto mb-3 text-text-muted/40" />
                <p className="text-text-secondary text-sm">No {filter !== 'all' ? filter : ''} messages found.</p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-2 text-amber-500 text-xs hover:underline"
                  >
                    View all messages
                  </button>
                )}
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : !msg.read
                        ? 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-500 font-semibold text-xs">
                            {msg.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-sm truncate">{msg.name}</span>
                        {!msg.read && (
                          <span className="text-xs bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-xs line-clamp-2 mb-1">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      {!msg.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(msg.id)
                          }}
                          disabled={actionLoading === msg.id}
                          className="p-1 rounded-lg hover:bg-green-500/10 transition-colors"
                          title="Mark as read"
                        >
                          {actionLoading === msg.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle size={12} className="text-green-500" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMessage(msg.id)
                        }}
                        disabled={actionLoading === msg.id}
                        className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail View */}
          <div className="lg:sticky lg:top-20">
            <h3 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <User size={12} className="text-amber-500" />
              Message Details
            </h3>
            
            {selectedMessage ? (
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                      <span className="text-amber-500 font-semibold text-lg">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{selectedMessage.name}</h3>
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-sm text-amber-500 hover:underline break-all"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  {!selectedMessage.read && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar size={12} />
                    {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      <Reply size={12} /> Reply
                    </a>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
                <Mail size={32} className="mx-auto mb-3 text-text-muted/40" />
                <p className="text-text-secondary text-sm">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {filteredMessages.length > 0 && (
          <div className="mt-6 pt-3 text-center">
            <p className="text-xs text-text-muted">
              Showing {filteredMessages.length} of {messages.length} total messages
            </p>
          </div>
        )}
      </div>
    </div>
  )
}