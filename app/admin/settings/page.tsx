'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Globe, Mail, Eye, 
  Loader2, CheckCircle, AlertCircle, Sparkles,
  Code, Settings, RefreshCw, Share2, MessageCircle
} from 'lucide-react'

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
  const [savingType, setSavingType] = useState<'seo' | 'social' | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchSettings()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-settings')
      const data = await res.json()
      if (data.seo) setSeo(data.seo)
      if (data.social) setSocial(data.social)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (key: 'seo' | 'social', value: any) => {
    setSaving(true)
    setSavingType(key)
    setMessage(null)
    
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: `${key === 'seo' ? 'SEO' : 'Social'} settings saved successfully!` })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: `Failed to save ${key} settings` })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
      setSavingType(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom max-w-6xl px-4 sm:px-6 mx-auto">
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
              <Settings size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Site Settings
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage SEO, social links, and site configuration
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEO Settings Card */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-500/5 to-transparent">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-amber-500" />
                <h2 className="text-lg font-semibold">SEO Settings</h2>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Configure how your site appears in search results
              </p>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="Joel George Kaudzu - Healthcare Systems Builder"
                />
                <div className="mt-1.5 flex justify-between items-center">
                  <p className="text-xs text-text-muted">
                    Preview: <span className="text-amber-500">{seo.title || 'Your Title'}</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    {seo.title.length}/60
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary">
                  Meta Description
                </label>
                <textarea
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm resize-none"
                  placeholder="Building healthcare and digital systems for real-world African environments..."
                />
                <p className="text-xs text-text-muted mt-1">
                  {seo.description.length}/160 characters recommended
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary">
                  Keywords
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="healthcare, technology, africa, innovation, digital health"
                />
                <p className="text-xs text-text-muted mt-1">
                  Separate keywords with commas
                </p>
              </div>
              
              <button
                onClick={() => saveSettings('seo', seo)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {saving && savingType === 'seo' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving && savingType === 'seo' ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          </div>

          {/* Social & Contact Card */}
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-500/5 to-transparent">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-amber-500" />
                <h2 className="text-lg font-semibold">Social & Contact</h2>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Connect with your audience across platforms
              </p>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary flex items-center gap-2">
                  <Code size={14} /> GitHub URL
                </label>
                <input
                  type="url"
                  value={social.github}
                  onChange={(e) => setSocial({ ...social, github: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="https://github.com/joelkaudzu9-ship-it"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary flex items-center gap-2">
                  <Share2 size={14} /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={social.linkedin}
                  onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="https://linkedin.com/in/joel-kaudzu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary flex items-center gap-2">
                  <MessageCircle size={14} /> Twitter/X URL
                </label>
                <input
                  type="url"
                  value={social.twitter}
                  onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-text-secondary flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  value={social.email}
                  onChange={(e) => setSocial({ ...social, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="joelkaudzu9@gmail.com"
                />
              </div>
              
              <button
                onClick={() => saveSettings('social', social)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {saving && savingType === 'social' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving && savingType === 'social' ? 'Saving...' : 'Save Social Links'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="mt-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-amber-500" />
              <h2 className="text-lg font-semibold">Live Preview</h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              How your SEO and social links will appear
            </p>
          </div>
          
          <div className="p-5">
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 p-5 border border-gray-200 dark:border-gray-700">
              {/* Search Result Preview */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Search Result Preview</p>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {seo.title || 'Joel George Kaudzu'}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    joelkaudzu-portfolio.vercel.app
                  </p>
                  <p className="text-sm text-text-secondary">
                    {seo.description || 'Building healthcare and digital systems for real-world African environments...'}
                  </p>
                </div>
              </div>
              
              {/* Social Links Preview */}
              <div>
                <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Social Links</p>
                <div className="flex flex-wrap gap-3">
                  {social.github && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Code size={12} className="text-gray-500" />
                      <span>GitHub</span>
                      <CheckCircle size={10} className="text-green-500" />
                    </div>
                  )}
                  {social.linkedin && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Share2 size={12} className="text-blue-500" />
                      <span>LinkedIn</span>
                      <CheckCircle size={10} className="text-green-500" />
                    </div>
                  )}
                  {social.twitter && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <MessageCircle size={12} className="text-sky-500" />
                      <span>Twitter</span>
                      <CheckCircle size={10} className="text-green-500" />
                    </div>
                  )}
                  {social.email && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Mail size={12} className="text-amber-500" />
                      <span>Email</span>
                      <CheckCircle size={10} className="text-green-500" />
                    </div>
                  )}
                  {!social.github && !social.linkedin && !social.twitter && !social.email && (
                    <p className="text-xs text-text-muted">No social links configured yet</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tips Section */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-500">SEO Tips</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Keep titles under 60 characters and descriptions under 160 characters for optimal search results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}