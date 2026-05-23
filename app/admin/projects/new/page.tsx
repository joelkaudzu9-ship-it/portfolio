'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Plus, Save, Trash2 } from 'lucide-react'

export default function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  [currentTech, setCurrentTech] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [status, setStatus] = useState('active')
  const [featured, setFeatured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const result = await res.json()
    return result.url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const url = await uploadImage(file)
    if (url) {
      setImageUrl(url)
    }
    setUploading(false)
  }

  const addTechnology = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies([...technologies, currentTech.trim()])
      setCurrentTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    const projectData = {
      title,
      slug,
      subtitle,
      description,
      content,
      technologies,
      image_url: imageUrl,
      gallery_urls: galleryUrls,
      github_url: githubUrl,
      live_url: liveUrl,
      status,
      featured,
    }
    
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
    
    if (res.ok) {
      router.push('/admin/projects')
    } else {
      alert('Failed to create project')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container-custom max-w-4xl">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-amber-500 mb-6">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 gradient-text-gold">New Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              required
            />
          </div>
          
          {/* Subtitle */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="e.g., Multilingual Chronic Disease Support Ecosystem"
            />
          </div>
          
          {/* Featured Image */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="Image URL"
              />
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                <Upload size={16} />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />}
          </div>
          
          {/* Technologies */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="e.g., Python, Flask, PostgreSQL"
              />
              <button type="button" onClick={addTechnology} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="Brief description of the project"
            />
          </div>
          
          {/* Full Content */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Full Content (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-sm"
              placeholder="Detailed project description in Markdown..."
            />
          </div>
          
          {/* Links */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="https://github.com/..."
            />
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">Live URL</label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              placeholder="https://..."
            />
          </div>
          
          {/* Status & Featured */}
          <div className="glass-card p-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="concept">Concept</option>
                  <option value="planning">Planning</option>
                  <option value="experiment">Experiment</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm">Feature this project on homepage</label>
              </div>
            </div>
          </div>
          
          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Creating...' : 'Create Project'}
            </button>
            <Link href="/admin/projects" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}