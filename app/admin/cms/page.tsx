'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react'

const SECTIONS = [
  { id: 'hero', name: 'Hero Section', description: 'Main banner with profile photo' },
  { id: 'executive', name: 'Executive Identity', description: 'About you, titles, bio' },
  { id: 'values', name: 'Core Values', description: 'Your guiding principles' },
  { id: 'education', name: 'Education', description: 'Schools, degrees, courses' },
  { id: 'skills', name: 'Skills', description: 'Technical and soft skills' },
  { id: 'strengths', name: 'Personal Strengths', description: 'What makes you unique' },
  { id: 'growth', name: 'Areas of Growth', description: 'What you are improving' },
  { id: 'leadership', name: 'Leadership Roles', description: 'Positions held' },
  { id: 'teaching', name: 'Teaching Experience', description: 'Mentorship and teaching' },
  { id: 'conferences', name: 'Conferences', description: 'Events attended' },
  { id: 'mentors', name: 'Mentors & Inspirations', description: 'People who inspire you' },
  { id: 'timeline', name: 'Journey Timeline', description: 'Your story' },
  { id: 'quotes', name: 'Personal Quotes', description: 'Your words' },
  { id: 'vision', name: 'Long Term Vision', description: 'Future goals' },
  { id: 'roadmap', name: 'Development Roadmap', description: 'What you are learning' },
  { id: 'testimonials', name: 'Testimonials', description: 'What others say' },
  { id: 'achievements', name: 'Achievements', description: 'Certificates, awards' },
]

function CMSContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('hero')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Get section from URL on mount
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
    try {
      const res = await fetch(`/api/dynamic/${activeSection}`)
      const result = await res.json()
      setData(Array.isArray(result) ? result : result.id ? [result] : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File) => {
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
    
    const url = await uploadImage(file)
    if (url && editing) {
      setEditing({ ...editing, [field]: url })
    }
  }

  const handleSave = async (item: any) => {
    setSaving(true)
    try {
      const method = item.id ? 'PUT' : 'POST'
      const res = await fetch(`/api/dynamic/${activeSection}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (res.ok) {
        await fetchData()
        setEditing(null)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save')
      }
    } catch (error) {
      alert('Error saving item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    try {
      const res = await fetch(`/api/dynamic/${activeSection}?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await fetchData()
      } else {
        alert('Failed to delete')
      }
    } catch (error) {
      alert('Error deleting item')
    }
  }

  const renderForm = (item: any, onChange: (field: string, value: any) => void) => {
    if (activeSection === 'hero') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={item.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              type="text"
              value={item.subtitle || ''}
              onChange={(e) => onChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={item.profile_image_url || ''}
                onChange={(e) => onChange('profile_image_url', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="Cloudinary URL"
              />
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                <Upload size={16} />
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
              <img src={item.profile_image_url} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Text</label>
            <input
              type="text"
              value={item.cta_text || 'Explore Work'}
              onChange={(e) => onChange('cta_text', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Link</label>
            <input
              type="text"
              value={item.cta_link || '/projects'}
              onChange={(e) => onChange('cta_link', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            />
          </div>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {Object.keys(item).filter(k => !['id', 'created_at', 'updated_at'].includes(k)).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
            {key.includes('image') || key.includes('url') ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                />
                <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                  <Upload size={16} />
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
            ) : typeof item[key] === 'string' && item[key]?.length > 100 ? (
              <textarea
                value={item[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            ) : (
              <input
                type="text"
                value={item[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold gradient-text-gold">Content Management</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    setEditing(null)
                    router.push(`/admin/cms?section=${section.id}`, { scroll: false })
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-amber-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs opacity-75">{section.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1">
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{SECTIONS.find(s => s.id === activeSection)?.name}</h2>
                <button
                  onClick={() => setEditing({})}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : editing ? (
                <div>
                  {renderForm(editing, (field, value) => {
                    setEditing({ ...editing, [field]: value })
                  })}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleSave(editing)}
                      disabled={saving || uploading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      <Save size={14} /> {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No content yet. Click "Add New" to create.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      {editing?.id === item.id ? null : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {Object.entries(item)
                              .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <div key={key} className="mb-1">
                                  <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}: </span>
                                  <span className="text-sm break-words">
                                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 100) : String(value).slice(0, 100)}
                                  </span>
                                </div>
                              ))}
                          </div>
                          <div className="flex gap-1 ml-4">
                            <button
                              onClick={() => setEditing(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CMSPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CMSContent />
    </Suspense>
  )
}