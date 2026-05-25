'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Upload, X, Eye, Image as ImageIcon, Award, Calendar, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react'

type Achievement = {
  id: number
  title: string
  description: string
  date: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchAchievements()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      const data = await res.json()
      setAchievements(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/achievements/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    try {
      const url = await uploadImage(file)
      if (editing) {
        setEditing({ ...editing, image_url: url })
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        setTimeout(() => setMessage(null), 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const saveAchievement = async (achievement: Achievement) => {
    if (!achievement.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const method = achievement.id ? 'PUT' : 'POST'
    const res = await fetch('/api/achievements', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievement),
    })
    
    if (res.ok) {
      setMessage({ type: 'success', text: achievement.id ? 'Achievement updated!' : 'Achievement created!' })
      fetchAchievements()
      setEditing(null)
      setTimeout(() => setMessage(null), 2000)
    } else {
      const error = await res.json()
      setMessage({ type: 'error', text: error.error || 'Failed to save' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const deleteAchievement = async (id: number) => {
    if (!confirm('Delete this achievement? This action cannot be undone.')) return
    const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage({ type: 'success', text: 'Achievement deleted!' })
      fetchAchievements()
      setTimeout(() => setMessage(null), 2000)
    } else {
      setMessage({ type: 'error', text: 'Failed to delete' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading achievements...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
        {/* Back button */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all text-sm mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Award size={16} className="text-amber-500" />
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Manage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Achievements
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Certificates, awards, and recognition
            </p>
          </div>
          <button 
            onClick={() => setEditing({ id: 0, title: '', description: '', date: '', image_url: null, link_url: null, is_active: true })} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all text-sm font-medium"
          >
            <Plus size={16} /> Add Achievement
          </button>
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

        {/* Edit/Create Form */}
        {editing && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              {editing.id ? 'Edit Achievement' : 'Create New Achievement'}
            </h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Title *</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g., Best Innovation Award 2024"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the achievement, what it represents, and why it matters..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm resize-none"
                />
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary flex items-center gap-2">
                  <Calendar size={14} /> Date
                </label>
                <input
                  type="text"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="e.g., 2024, December 2023, or 2022-2024"
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary flex items-center gap-2">
                  <ImageIcon size={14} /> Certificate/Image
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editing.image_url || ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    placeholder="Image URL (or upload below)"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none text-sm"
                  />
                  <label className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors text-sm text-center inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <Upload size={14} /> Upload
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                )}
                {editing.image_url && (
                  <div className="relative inline-block mt-3">
                    <img 
                      src={editing.image_url} 
                      alt="Preview" 
                      className="h-20 w-auto rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/200x200/1a1a1a/666?text=Invalid+URL'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, image_url: null })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary flex items-center gap-2">
                  <LinkIcon size={14} /> Link URL (optional)
                </label>
                <input
                  type="url"
                  value={editing.link_url || ''}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  placeholder="https://drive.google.com/... or https://certificate.link/..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                />
              </div>
              
              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button 
                  onClick={() => saveAchievement(editing)} 
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all text-sm font-medium disabled:opacity-50"
                  disabled={uploading}
                >
                  <Eye size={14} className="inline mr-2" />
                  {editing.id ? 'Update Achievement' : 'Create Achievement'}
                </button>
                <button 
                  onClick={() => setEditing(null)} 
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              All Achievements ({achievements.length})
            </h2>
          </div>
          
          {achievements.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 text-center">
              <Award size={40} className="mx-auto mb-3 text-text-muted/40" />
              <p className="text-text-secondary">No achievements yet.</p>
              <button 
                onClick={() => setEditing({ id: 0, title: '', description: '', date: '', image_url: null, link_url: null, is_active: true })} 
                className="mt-3 text-amber-500 text-sm hover:underline"
              >
                Add your first achievement →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {achievement.image_url ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={achievement.image_url} 
                          alt={achievement.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100/1a1a1a/666?text=Image'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Award size={20} className="text-amber-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm sm:text-base text-text-primary">
                          {achievement.title}
                        </h3>
                        {achievement.date && (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Calendar size={10} /> {achievement.date}
                          </span>
                        )}
                      </div>
                      {achievement.description && (
                        <p className="text-xs text-text-muted line-clamp-1">
                          {achievement.description}
                        </p>
                      )}
                      {achievement.link_url && (
                        <a 
                          href={achievement.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <LinkIcon size={10} /> View certificate
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                    <button 
                      onClick={() => setEditing(achievement)} 
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-text-secondary" />
                    </button>
                    <button 
                      onClick={() => deleteAchievement(achievement.id)} 
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
      </div>
    </div>
  )
}