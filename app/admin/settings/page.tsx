'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, Edit, Eye } from 'lucide-react'

type SettingSection = 'hero' | 'featured' | 'testimonials' | 'achievements' | 'seo'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('hero')
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_text: '',
    cta_link: '',
  })
  const [featured, setFeatured] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
    fetchFeatured()
    fetchTestimonials()
    fetchAchievements()
  }, [])

  const fetchSettings = async () => {
    const res = await fetch('/api/site-settings')
    const data = await res.json()
    if (data.hero) setHero(data.hero)
    if (data.seo) setSeo(data.seo)
    setLoading(false)
  }

  const fetchFeatured = async () => {
    const res = await fetch('/api/featured')
    const data = await res.json()
    setFeatured(data)
  }

  const fetchTestimonials = async () => {
    const res = await fetch('/api/testimonials')
    const data = await res.json()
    setTestimonials(data)
  }

  const fetchAchievements = async () => {
    const res = await fetch('/api/achievements')
    const data = await res.json()
    setAchievements(data)
  }

  const saveHero = async () => {
    setSaving(true)
    await fetch('/api/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'hero', value: hero }),
    })
    setSaving(false)
    alert('Hero section saved!')
  }

  const saveSEO = async () => {
    setSaving(true)
    await fetch('/api/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'seo', value: seo }),
    })
    setSaving(false)
    alert('SEO settings saved!')
  }

  const addFeatured = async () => {
    const title = prompt('Enter featured item title:')
    if (!title) return
    
    const type = prompt('Type: project, blog, or custom:')
    if (!type) return
    
    await fetch('/api/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, is_active: true }),
    })
    fetchFeatured()
  }

  const deleteFeatured = async (id: number) => {
    if (!confirm('Delete this featured item?')) return
    await fetch(`/api/featured/${id}`, { method: 'DELETE' })
    fetchFeatured()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">Site Settings</h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          {['hero', 'featured', 'testimonials', 'achievements', 'seo'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section as SettingSection)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeSection === section
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-500/20'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
        
        {/* Hero Section Editor */}
        {activeSection === 'hero' && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={hero.cta_text}
                  onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA Button Link</label>
                <input
                  type="text"
                  value={hero.cta_link}
                  onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                />
              </div>
            </div>
            <button
              onClick={saveHero}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        )}
        
        {/* Featured Items Editor */}
        {activeSection === 'featured' && (
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Featured Items</h2>
              <button
                onClick={addFeatured}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm"
              >
                <Plus size={14} /> Add Featured
              </button>
            </div>
            <div className="space-y-2">
              {featured.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <span className="text-xs text-amber-500 uppercase">{item.type}</span>
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <button onClick={() => deleteFeatured(item.id)} className="p-1 text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {featured.length === 0 && (
                <p className="text-gray-500 text-center py-8">No featured items. Add some!</p>
              )}
            </div>
          </div>
        )}
        
        {/* SEO Editor */}
        {activeSection === 'seo' && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                type="text"
                value={seo.title}
                onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                value={seo.description}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={seo.keywords}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <button
              onClick={saveSEO}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}