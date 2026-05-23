'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Globe, Mail, Eye } from 'lucide-react'

export default function SettingsPage() {
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
  })
  const [social, setSocial] = useState({
    github: '',
    linkedin: '',
    email: '',
    twitter: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const res = await fetch('/api/site-settings')
    const data = await res.json()
    if (data.seo) setSeo(data.seo)
    if (data.social) setSocial(data.social)
    setLoading(false)
  }

  const saveSettings = async (key: string, value: any) => {
    setSaving(true)
    await fetch('/api/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    setSaving(false)
    alert(`${key} settings saved!`)
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SEO Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={20} className="text-amber-500" />
              <h2 className="text-xl font-bold">SEO Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="Your site title for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">Preview: {seo.title || 'Your Title'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="Brief description for search results"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Keywords</label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="healthcare, technology, africa, innovation"
                />
              </div>
              <button
                onClick={() => saveSettings('seo', seo)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-amber-500" />
              <h2 className="text-xl font-bold">Social & Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">📂 GitHub URL</label>
                <input
                  type="url"
                  value={social.github}
                  onChange={(e) => setSocial({ ...social, github: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">🔗 LinkedIn URL</label>
                <input
                  type="url"
                  value={social.linkedin}
                  onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">🐦 Twitter/X URL</label>
                <input
                  type="url"
                  value={social.twitter}
                  onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">✉️ Email</label>
                <input
                  type="email"
                  value={social.email}
                  onChange={(e) => setSocial({ ...social, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  placeholder="your@email.com"
                />
              </div>
              <button
                onClick={() => saveSettings('social', social)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Social Links'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={20} className="text-amber-500" />
            <h2 className="text-xl font-bold">Live Preview</h2>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-sm">
              <p className="font-medium">{seo.title || 'Joel George Kaudzu'}</p>
              <p className="text-gray-500">{seo.description || 'Healthcare Systems Builder'}</p>
              <div className="flex gap-3 mt-2">
                {social.github && <span className="text-xs text-gray-400">GitHub ✓</span>}
                {social.linkedin && <span className="text-xs text-gray-400">LinkedIn ✓</span>}
                {social.email && <span className="text-xs text-gray-400">Email ✓</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}