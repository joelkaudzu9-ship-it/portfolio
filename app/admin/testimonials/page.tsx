'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react'

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  is_active: boolean
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

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/dynamic/testimonials?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchTestimonials()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Testimonials</h1>
          <button onClick={() => setEditing({ id: 0, name: '', role: '', content: '', is_active: true })} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="glass-card p-6 mb-6">
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm">Active (visible on site)</label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => saveTestimonial(editing)} className="btn-primary">Save</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg hover:bg-surface">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials List */}
        <div className="space-y-3">
          {testimonials.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No testimonials yet.</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-center justify-between p-4 glass-card">
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-accent-gold">{testimonial.role}</p>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{testimonial.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(testimonial)} className="p-2 rounded-lg hover:bg-surface transition-colors">
                    <Edit size={16} className="text-text-secondary" />
                  </button>
                  <button onClick={() => deleteTestimonial(testimonial.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}