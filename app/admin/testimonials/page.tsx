'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Clock, 
  Users, Star, Loader2, AlertCircle, Sparkles, MessageCircle, User
} from 'lucide-react'

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  is_active: boolean
  created_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchTestimonials()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/dynamic/testimonials')
      const data = await res.json()
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setMessage({ type: 'error', text: 'Failed to load testimonials' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const saveTestimonial = async (testimonial: Testimonial) => {
    if (!testimonial.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    if (!testimonial.content.trim()) {
      setMessage({ type: 'error', text: 'Content is required' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    const method = testimonial.id ? 'PUT' : 'POST'
    const res = await fetch('/api/dynamic/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    })
    
    if (res.ok) {
      setMessage({ type: 'success', text: testimonial.id ? 'Testimonial updated!' : 'Testimonial added!' })
      fetchTestimonials()
      setEditing(null)
      setTimeout(() => setMessage(null), 2000)
    } else {
      setMessage({ type: 'error', text: 'Failed to save testimonial' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const toggleActive = async (id: number, currentActive: boolean) => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/dynamic/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentActive }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: currentActive ? 'Testimonial unpublished' : 'Testimonial published' })
        fetchTestimonials()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to update status' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteTestimonial = async (id: number, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"? This action cannot be undone.`)) return
    
    setActionLoading(id)
    try {
      const res = await fetch(`/api/dynamic/testimonials?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonial deleted!' })
        fetchTestimonials()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete testimonial' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading testimonials...</span>
        </div>
      </div>
    )
  }

  const pendingTestimonials = testimonials.filter(t => !t.is_active)
  const approvedTestimonials = testimonials.filter(t => t.is_active)

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6 max-w-5xl mx-auto">
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
              <Users size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Social Proof</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Testimonials
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage what people say about your work
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <Users size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{testimonials.length}</div>
            <div className="text-xs text-text-muted">testimonials</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Published</span>
              <Star size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{approvedTestimonials.length}</div>
            <div className="text-xs text-text-muted">on website</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Pending</span>
              <Clock size={14} className="text-yellow-500" />
            </div>
            <div className={`text-xl font-bold mt-1 ${pendingTestimonials.length > 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
              {pendingTestimonials.length}
            </div>
            <div className="text-xs text-text-muted">awaiting review</div>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setEditing({ id: 0, name: '', role: '', content: '', is_active: false, created_at: '' })} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-medium hover:scale-[1.02] transition-all"
          >
            <Plus size={14} /> Add Testimonial
          </button>
        </div>

        {/* Pending Approval Section */}
        {pendingTestimonials.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Clock size={16} className="text-yellow-500" />
              Pending Approval ({pendingTestimonials.length})
            </h2>
            <div className="space-y-3">
              {pendingTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <span className="text-amber-500 font-semibold text-xs">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm">{testimonial.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                        <Clock size={10} /> Pending
                      </span>
                    </div>
                    {testimonial.role && (
                      <p className="text-xs text-text-muted mb-1">{testimonial.role}</p>
                    )}
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                      disabled={actionLoading === testimonial.id}
                      className="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors"
                      title="Approve and publish"
                    >
                      {actionLoading === testimonial.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </button>
                    <button 
                      onClick={() => setEditing(testimonial)} 
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-text-secondary" />
                    </button>
                    <button 
                      onClick={() => deleteTestimonial(testimonial.id, testimonial.name)} 
                      disabled={actionLoading === testimonial.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Published Testimonials */}
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Star size={16} className="text-green-500" />
            Published ({approvedTestimonials.length})
          </h2>
          
          {approvedTestimonials.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
              <MessageCircle size={40} className="mx-auto mb-3 text-text-muted/40" />
              <p className="text-text-secondary">No published testimonials yet.</p>
              <button 
                onClick={() => setEditing({ id: 0, name: '', role: '', content: '', is_active: false, created_at: '' })} 
                className="mt-3 text-amber-500 text-sm hover:underline inline-flex items-center gap-1"
              >
                <Plus size={12} /> Add your first testimonial
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <span className="text-amber-500 font-semibold text-xs">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm">{testimonial.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">
                        <Star size={10} /> Published
                      </span>
                    </div>
                    {testimonial.role && (
                      <p className="text-xs text-text-muted mb-1">{testimonial.role}</p>
                    )}
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                      disabled={actionLoading === testimonial.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Unpublish"
                    >
                      {actionLoading === testimonial.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <EyeOff size={14} className="text-red-400" />
                      )}
                    </button>
                    <button 
                      onClick={() => setEditing(testimonial)} 
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-text-secondary" />
                    </button>
                    <button 
                      onClick={() => deleteTestimonial(testimonial.id, testimonial.name)} 
                      disabled={actionLoading === testimonial.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit/Create Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                <MessageCircle size={18} className="text-amber-500" />
                <h2 className="text-lg font-semibold">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-secondary">Name *</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-secondary">Role / Title</label>
                  <input
                    type="text"
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                    placeholder="CTO at Company, Project Lead, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-secondary">Testimonial Content *</label>
                  <textarea
                    value={editing.content}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm resize-none"
                    placeholder="What did they say about your work?"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    {editing.content.length} characters
                  </p>
                </div>
                
                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={() => saveTestimonial(editing)} 
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all"
                  >
                    {editing.id ? 'Update' : 'Create'} Testimonial
                  </button>
                  <button 
                    onClick={() => setEditing(null)} 
                    className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}