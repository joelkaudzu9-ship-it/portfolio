'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

type Achievement = {
  id: number
  title: string
  description: string
  date: string
  link_url: string
  is_active: boolean
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Achievement | null>(null)
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
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-accent-gold mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text-gold">Achievements</h1>
          <button onClick={() => setEditing({ id: 0, title: '', description: '', date: '', link_url: '', is_active: true })} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Achievement
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editing.id ? 'Edit Achievement' : 'New Achievement'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
                <input
                  type="url"
                  value={editing.link_url}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => saveAchievement(editing)} className="btn-primary">Save</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border rounded-lg hover:bg-surface">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-3">
          {achievements.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No achievements yet.</p>
            </div>
          ) : (
            achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between p-4 glass-card">
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-text-muted">{achievement.date}</p>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{achievement.description}</p>
                </div>
                <div className="flex gap-2">
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