'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Upload, X, Eye, Image as ImageIcon } from 'lucide-react'

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
      alert('Please upload an image file')
      return
    }
    
    try {
      const url = await uploadImage(file)
      if (editing) {
        setEditing({ ...editing, image_url: url })
      }
    } catch (error) {
      alert('Failed to upload image')
    }
  }

  const saveAchievement = async (achievement: Achievement) => {
    const method = achievement.id ? 'PUT' : 'POST'
    const res = await fetch('/api/achievements', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievement),
    })
    if (res.ok) {
      fetchAchievements()
      setEditing(null)
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to save')
    }
  }

  const deleteAchievement = async (id: number) => {
    if (!confirm('Delete this achievement?')) return
    const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAchievements()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent-gold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text-gold">Manage Achievements</h1>
          <button 
            onClick={() => setEditing({ id: 0, title: '', description: '', date: '', image_url: null, link_url: null, is_active: true })} 
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Achievement
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="glass-card p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editing.id ? 'Edit Achievement' : 'New Achievement'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Date (e.g., 2024)</label>
                <input
                  type="text"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="2024"
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Certificate/Image</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editing.image_url || ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary text-sm"
                  />
                  <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center text-sm">
                    <Upload size={16} className="inline mr-1" /> Upload
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {uploading && <p className="text-sm text-text-muted mt-2">Uploading...</p>}
                {editing.image_url && (
                  <div className="relative mt-2 inline-block">
                    <img src={editing.image_url} alt="Preview" className="h-24 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, image_url: null })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-text-secondary">Link URL (optional)</label>
                <input
                  type="url"
                  value={editing.link_url || ''}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-accent-gold/50 focus:outline-none text-text-primary"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => saveAchievement(editing)} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50" disabled={uploading}>
                  <Eye size={16} /> Save Achievement
                </button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-3">
          {achievements.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No achievements yet. Click "Add Achievement" to get started.</p>
            </div>
          ) : (
            achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 glass-card">
                <div className="flex items-start gap-3">
                  {achievement.image_url && (
                    <img src={achievement.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold text-text-primary">{achievement.title}</h3>
                    <p className="text-xs text-text-muted">{achievement.date}</p>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-0 sm:ml-4">
                  <button onClick={() => setEditing(achievement)} className="p-2 rounded-lg hover:bg-surface transition-colors">
                    <Edit size={16} className="text-text-secondary" />
                  </button>
                  <button onClick={() => deleteAchievement(achievement.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
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