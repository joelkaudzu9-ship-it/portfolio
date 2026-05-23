'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Clock } from 'lucide-react'

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
    } finally {
      setLoading(false)
    }
  }

  const saveTestimonial = async (testimonial: Testimonial) => {
    const method = testimonial.id ? 'PUT' : 'POST'
    const res = await fetch('/api/dynamic/testimonials', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    })
    if (res.ok) {
      fetchTestimonials()
      setEditing(null)
    }
  }

  const toggleActive = async (id: number, currentActive: boolean) => {
    const res = await fetch('/api/dynamic/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentActive }),
    })
    if (res.ok) {
      fetchTestimonials()
    }
  }

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/dynamic/testimonials?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchTestimonials()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  const pendingTestimonials = testimonials.filter(t => !t.is_active)
  const approvedTestimonials = testimonials.filter(t => t.is_active)

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Testimonials</h1>
          <button onClick={() => setEditing({ id: 0, name: '', role: '', content: '', is_active: false, created_at: '' })} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>

        {/* Pending Approval Section */}
        {pendingTestimonials.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" />
              Pending Approval ({pendingTestimonials.length})
            </h2>
            <div className="space-y-3">
              {pendingTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-center justify-between p-4 glass-card border-amber-500/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">Pending</span>
                    </div>
                    {testimonial.role && <p className="text-sm text-text-muted">{testimonial.role}</p>}
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{testimonial.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                      className="p-2 rounded-lg hover:bg-green-500/10 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={18} className="text-green-500" />
                    </button>
                    <button onClick={() => setEditing(testimonial)} className="p-2 rounded-lg hover:bg-surface transition-colors">
                      <Edit size={18} className="text-text-secondary" />
                    </button>
                    <button onClick={() => deleteTestimonial(testimonial.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Testimonials */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            Published ({approvedTestimonials.length})
          </h2>
          <div className="space-y-3">
            {approvedTestimonials.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-text-secondary">No published testimonials yet.</p>
              </div>
            ) : (
              approvedTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-center justify-between p-4 glass-card">
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {testimonial.role && <p className="text-sm text-text-muted">{testimonial.role}</p>}
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{testimonial.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Unpublish"
                    >
                      <EyeOff size={18} className="text-red-400" />
                    </button>
                    <button onClick={() => setEditing(testimonial)} className="p-2 rounded-lg hover:bg-surface transition-colors">
                      <Edit size={18} className="text-text-secondary" />
                    </button>
                    <button onClick={() => deleteTestimonial(testimonial.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={editing.content}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => saveTestimonial(editing)} className="btn-primary">Save</button>
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg hover:bg-surface">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}