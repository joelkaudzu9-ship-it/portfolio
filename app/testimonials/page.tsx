'use client'

import { useState, useEffect } from 'react'
import { Star, User, Calendar, Send, CheckCircle } from 'lucide-react'

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  is_active: boolean
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/dynamic/testimonials')
      const data = await res.json()
      setTestimonials(data.filter((t: Testimonial) => t.is_active))
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    
    if (!formData.name.trim() || !formData.content.trim()) {
      setFormError('Please fill in your name and testimonial')
      setSubmitting(false)
      return
    }
    
    try {
      const res = await fetch('/api/testimonials/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          role: formData.role.trim() || null,
          content: formData.content.trim(),
        }),
      })
      
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', role: '', content: '' })
      } else {
        const error = await res.json()
        setFormError(error.error || 'Failed to submit testimonial')
      }
    } catch (error) {
      setFormError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Kind Words</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            What People <span className="gradient-text-gold">Say</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mt-4">
            Testimonials from colleagues, mentors, and people I've worked with
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="glass-card p-6"
              >
                <Star size={24} className="text-amber-500 mb-3" />
                <p className="text-text-secondary leading-relaxed italic">"{testimonial.content}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <User size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-text-muted">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-muted flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            No testimonials yet. Be the first to share your experience!
          </div>
        )}

        {/* Submit Testimonial Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-2 gradient-text-gold">
              Share Your Experience
            </h2>
            <p className="text-text-secondary text-center mb-6">
              Have you worked with me or experienced my work? I'd love to hear from you!
            </p>
            
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-text-secondary">
                  Your testimonial has been submitted and will appear after review.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 btn-outline"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Your Role/Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-amber-500/50 focus:outline-none transition-colors"
                    placeholder="Healthcare Professional, Student, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Your Testimonial *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Share your experience working with me..."
                  />
                </div>
                
                {formError && (
                  <p className="text-red-500 text-sm text-center">{formError}</p>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} />
                  {submitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
                
                <p className="text-xs text-text-muted text-center">
                  All testimonials are reviewed before being published publicly.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}