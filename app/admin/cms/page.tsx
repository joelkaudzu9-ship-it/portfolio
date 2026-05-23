'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react'

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
export default function CMSPage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeSection])

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(`/api/dynamic/${activeSection}`)
    const result = await res.json()
    setData(Array.isArray(result) ? result : [result])
    setLoading(false)
  }

  const handleSave = async (item: any) => {
    setSaving(true)
    const method = item.id ? 'PUT' : 'POST'
    const res = await fetch(`/api/dynamic/${activeSection}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (res.ok) {
      fetchData()
      setEditing(null)
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    const res = await fetch(`/api/dynamic/${activeSection}?id=${id}`, {
      method: 'DELETE',
    })
    if (res.ok) fetchData()
  }

  const renderForm = (item: any, onChange: (field: string, value: any) => void) => {
    switch (activeSection) {
      case 'hero':
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
              <input
                type="text"
                value={item.profile_image_url || ''}
                onChange={(e) => onChange('profile_image_url', e.target.value)}
                placeholder="Upload to Cloudinary first"
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
        )
      
      case 'values':
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
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Index</label>
              <input
                type="number"
                value={item.order_index || 0}
                onChange={(e) => onChange('order_index', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
        )
      
      case 'skills':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={item.category || ''}
                onChange={(e) => onChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Design">Design</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skill Name</label>
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proficiency (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={item.proficiency || 3}
                onChange={(e) => onChange('proficiency', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Beginner</span><span>Intermediate</span><span>Advanced</span>
              </div>
            </div>
          </div>
        )
      
      case 'mentors':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role/Title</label>
              <input
                type="text"
                value={item.role || ''}
                onChange={(e) => onChange('role', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contribution</label>
              <textarea
                value={item.contribution || ''}
                onChange={(e) => onChange('contribution', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-4">
            {Object.keys(item).filter(k => !['id', 'created_at', 'updated_at'].includes(k)).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                {typeof item[key] === 'string' && (item[key]?.length > 100 ? (
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
                ))}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container-custom py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">Content Management System</h1>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-amber-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">{section.name}</div>
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
                <div className="text-center py-12">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {data.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      {editing?.id === item.id ? (
                        <div>
                          {renderForm(editing, (field, value) => {
                            setEditing({ ...editing, [field]: value })
                          })}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleSave(editing)}
                              disabled={saving}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm"
                            >
                              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {Object.keys(item).filter(k => !['id', 'created_at', 'updated_at'].includes(k)).map((key) => (
                              <div key={key} className="mb-1">
                                <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}: </span>
                                <span className="text-sm">
                                  {typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
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
                  
                  {data.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No content yet. Click "Add New" to create.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}