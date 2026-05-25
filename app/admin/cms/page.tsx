'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon,
  Layout, User, Target, GraduationCap, Wrench, Star, TrendingUp,
  Briefcase, Users, Calendar, Quote, Eye, Rocket, BookOpen, Award,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react'

const SECTIONS = [
  { id: 'hero', name: 'Hero Section', description: 'Main banner with profile photo', icon: Layout, color: 'amber' },
  { id: 'executive', name: 'Executive Identity', description: 'About you, titles, bio', icon: User, color: 'blue' },
  { id: 'values', name: 'Core Values', description: 'Your guiding principles', icon: Target, color: 'green' },
  { id: 'education', name: 'Education', description: 'Schools, degrees, courses', icon: GraduationCap, color: 'purple' },
  { id: 'skills', name: 'Skills', description: 'Technical and soft skills', icon: Wrench, color: 'cyan' },
  { id: 'strengths', name: 'Personal Strengths', description: 'What makes you unique', icon: Star, color: 'yellow' },
  { id: 'growth', name: 'Areas of Growth', description: 'What you are improving', icon: TrendingUp, color: 'orange' },
  { id: 'leadership', name: 'Leadership Roles', description: 'Positions held', icon: Briefcase, color: 'indigo' },
  { id: 'teaching', name: 'Teaching Experience', description: 'Mentorship and teaching', icon: Users, color: 'pink' },
  { id: 'conferences', name: 'Conferences', description: 'Events attended', icon: Calendar, color: 'teal' },
  { id: 'mentors', name: 'Mentors & Inspirations', description: 'People who inspire you', icon: Quote, color: 'rose' },
  { id: 'timeline', name: 'Journey Timeline', description: 'Your story', icon: Rocket, color: 'violet' },
  { id: 'quotes', name: 'Personal Quotes', description: 'Your words', icon: Quote, color: 'amber' },
  { id: 'vision', name: 'Long Term Vision', description: 'Future goals', icon: Eye, color: 'blue' },
  { id: 'roadmap', name: 'Development Roadmap', description: 'What you are learning', icon: BookOpen, color: 'green' },
  { id: 'testimonials', name: 'Testimonials', description: 'What others say', icon: Users, color: 'purple' },
  { id: 'achievements', name: 'Achievements', description: 'Certificates, awards', icon: Award, color: 'yellow' },
]

const colorMap = {
  amber: 'from-amber-500 to-amber-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  yellow: 'from-yellow-500 to-yellow-600',
  orange: 'from-orange-500 to-orange-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  rose: 'from-rose-500 to-rose-600',
  violet: 'from-violet-500 to-violet-600',
}

function CMSContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('hero')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const sectionParam = searchParams?.get('section')
    if (sectionParam && SECTIONS.some(s => s.id === sectionParam)) {
      setActiveSection(sectionParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [activeSection])

  const fetchData = async () => {
    setLoading(true)
    setLoadingPercent(0)
    
    // Simulate progress for better UX
    const interval = setInterval(() => {
      setLoadingPercent(prev => Math.min(prev + 10, 90))
    }, 100)
    
    try {
      const res = await fetch(`/api/dynamic/${activeSection}`)
      const result = await res.json()
      
      if (activeSection === 'hero') {
        setData(!result || result.length === 0 ? [] : result)
      } else {
        setData(Array.isArray(result) ? result : result.id ? [result] : [])
      }
      
      setLoadingPercent(100)
      setTimeout(() => setLoadingPercent(0), 300)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
      setMessage({ type: 'error', text: 'Failed to load content' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      return result.url
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    const url = await uploadImage(file)
    if (url && editing) {
      setEditing({ ...editing, [field]: url })
      setMessage({ type: 'success', text: 'Image uploaded!' })
      setTimeout(() => setMessage(null), 2000)
    }
  }

  const handleSave = async (item: any) => {
    if (!item.title && activeSection !== 'hero' && activeSection !== 'executive') {
      setMessage({ type: 'error', text: 'Title is required' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    setSaving(true)
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch(`/api/dynamic/${activeSection}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: item.id ? 'Updated successfully!' : 'Created successfully!' })
        await fetchData()
        setEditing(null)
        setTimeout(() => setMessage(null), 2000)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving item' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item? This action cannot be undone.')) return
    try {
      const res = await fetch(`/api/dynamic/${activeSection}?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Deleted successfully!' })
        await fetchData()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting item' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection)
  const SectionIcon = currentSection?.icon || Layout
  const gradientColor = colorMap[currentSection?.color as keyof typeof colorMap] || 'from-amber-500 to-amber-600'

  const renderForm = (item: any, onChange: (field: string, value: any) => void) => {
    if (activeSection === 'hero') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Title *</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                placeholder="Joel George Kaudzu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Subtitle</label>
              <input
                type="text"
                value={item.subtitle || ''}
                onChange={(e) => onChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                placeholder="Dental Surgery Student • Health-Tech Builder"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Description</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
              placeholder="Building scalable healthcare systems for Africa..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Profile Image</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={item.profile_image_url || ''}
                onChange={(e) => onChange('profile_image_url', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                placeholder="https://res.cloudinary.com/..."
              />
              <label className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors text-sm text-center inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Upload size={14} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const uploadAndSet = async () => {
                      const url = await uploadImage(file)
                      if (url) onChange('profile_image_url', url)
                    }
                    uploadAndSet()
                  }
                }} />
              </label>
            </div>
            {item.profile_image_url && (
              <div className="relative inline-block mt-3">
                <img src={item.profile_image_url} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-amber-500/30" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">CTA Text</label>
              <input
                type="text"
                value={item.cta_text || 'Explore Work'}
                onChange={(e) => onChange('cta_text', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">CTA Link</label>
              <input
                type="text"
                value={item.cta_link || '/projects'}
                onChange={(e) => onChange('cta_link', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {Object.keys(item).filter(k => !['id', 'created_at', 'updated_at', 'order_index', 'is_featured'].includes(k)).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 text-text-secondary capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            {key.includes('image') || key.includes('url') ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={item[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors text-sm"
                  placeholder="https://..."
                />
                <label className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors text-sm text-center inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <Upload size={14} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const uploadAndSet = async () => {
                        const url = await uploadImage(file)
                        if (url) onChange(key, url)
                      }
                      uploadAndSet()
                    }
                  }} />
                </label>
              </div>
            ) : typeof item[key] === 'string' && (item[key]?.length > 100 || key === 'description' || key === 'content') ? (
              <textarea
                value={item[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={item[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            )}
            {item[key] && key.includes('image') && (
              <div className="mt-2">
                <img src={item[key]} alt="Preview" className="h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
              </div>
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1 text-text-secondary">Order Index</label>
          <input
            type="number"
            value={item.order_index || 0}
            onChange={(e) => onChange('order_index', parseInt(e.target.value))}
            className="w-24 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6">
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

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
              <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Content Sections</h2>
              </div>
              {SECTIONS.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      setEditing(null)
                      router.push(`/admin/cms?section=${section.id}`, { scroll: false })
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all group ${
                      isActive
                        ? `bg-gradient-to-r ${colorMap[section.color as keyof typeof colorMap]} text-white shadow-sm`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={isActive ? 'text-white' : 'text-text-muted'} />
                      <span className="text-sm font-medium">{section.name}</span>
                    </div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-text-muted'}`}>
                      {section.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Section Header */}
              <div className={`p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r ${gradientColor} bg-opacity-5`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <SectionIcon size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{currentSection?.name}</h2>
                      <p className="text-xs text-white/70">{currentSection?.description}</p>
                    </div>
                  </div>
                  {activeSection !== 'hero' && (
                    <button
                      onClick={() => setEditing({ order_index: data.length })}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  )}
                  {activeSection === 'hero' && data.length === 0 && !editing && (
                    <button
                      onClick={() => setEditing({})}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all"
                    >
                      <Plus size={14} /> Create Hero Section
                    </button>
                  )}
                </div>
              </div>
              
              {/* Message Alert */}
              {message && (
                <div className={`m-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <div className="p-12 text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2" />
                        <circle 
                          cx="18" cy="18" r="16" fill="none" 
                          className="stroke-amber-500" 
                          strokeWidth="2"
                          strokeDasharray="100"
                          strokeDashoffset={100 - loadingPercent}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-500">{loadingPercent}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm mt-3">Loading {currentSection?.name}...</p>
                </div>
              )}
              
              {/* Edit Form */}
              {!loading && editing && (
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
                    <Edit size={16} className="text-amber-500" />
                    <h3 className="font-semibold text-sm">{editing.id ? 'Edit Item' : 'Create New Item'}</h3>
                  </div>
                  {renderForm(editing, (field, value) => {
                    setEditing({ ...editing, [field]: value })
                  })}
                  <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => handleSave(editing)}
                      disabled={saving || uploading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-[1.02] transition-all text-sm font-medium disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {/* Items List */}
              {!loading && !editing && (
                data.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <SectionIcon size={24} className="text-text-muted" />
                    </div>
                    <p className="text-text-secondary">No content yet.</p>
                    {activeSection !== 'hero' && (
                      <button
                        onClick={() => setEditing({ order_index: data.length })}
                        className="mt-3 text-amber-500 text-sm hover:underline inline-flex items-center gap-1"
                      >
                        Add your first item <Plus size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {data.map((item, index) => (
                      <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-text-muted bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                #{index + 1}
                              </span>
                              {item.title && (
                                <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                                  {item.title}
                                </h3>
                              )}
                              {item.is_featured && (
                                <span className="text-xs bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">Featured</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-text-muted line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            )}
                            {item.quote && (
                              <p className="text-xs text-text-muted italic line-clamp-2 mt-1">
                                "{item.quote}"
                              </p>
                            )}
                            {item.date && (
                              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                <Calendar size={10} /> {item.date}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                            <button
                              onClick={() => setEditing(item)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} className="text-text-secondary" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            
            {/* Helper Text */}
            {!loading && !editing && data.length > 0 && (
              <p className="text-xs text-text-muted text-center mt-4">
                {data.length} item{data.length !== 1 ? 's' : ''} • Click edit to modify
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CMSPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading CMS...</span>
        </div>
      </div>
    }>
      <CMSContent />
    </Suspense>
  )
}