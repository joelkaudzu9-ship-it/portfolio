'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Plus, Edit, Trash2, ArrowLeft, Star, 
  Briefcase, Rocket, Lightbulb, Wrench, Code,
  Loader2, CheckCircle, AlertCircle, Eye, Calendar
} from 'lucide-react'

type Project = {
  id: number
  title: string
  slug: string
  subtitle: string
  description: string
  status: string
  featured: boolean
  technologies: string[]
  image_url: string
  created_at?: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProjects()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setMessage({ type: 'error', text: 'Failed to load projects' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (slug: string, currentFeatured: boolean) => {
    setActionLoading(slug)
    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: currentFeatured ? 'Removed from featured' : 'Marked as featured' })
        fetchProjects()
        setTimeout(() => setMessage(null), 2000)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to update featured status' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Error updating featured status' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const deleteProject = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return
    
    setActionLoading(slug)
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Project deleted successfully!' })
        fetchProjects()
        setTimeout(() => setMessage(null), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete project' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting project' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <Rocket size={12} />
      case 'concept': return <Lightbulb size={12} />
      case 'planning': return <Wrench size={12} />
      case 'experiment': return <Code size={12} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'concept': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'experiment': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const activeCount = projects.filter(p => p.status === 'active').length
  const featuredCount = projects.filter(p => p.featured).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading projects...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-4 sm:py-8">
      <div className="container-custom px-4 sm:px-6 max-w-6xl mx-auto">
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
              <Briefcase size={16} className="text-amber-500" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your portfolio projects
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total</span>
              <Briefcase size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1">{projects.length}</div>
            <div className="text-xs text-text-muted">projects</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Active</span>
              <Rocket size={14} className="text-green-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-green-500">{activeCount}</div>
            <div className="text-xs text-text-muted">in development</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Featured</span>
              <Star size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-amber-500">{featuredCount}</div>
            <div className="text-xs text-text-muted">on homepage</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Add New</span>
              <Plus size={14} className="text-blue-500" />
            </div>
            <Link 
              href="/admin/projects/new" 
              className="text-sm font-medium text-blue-500 hover:text-blue-600 mt-1 inline-block"
            >
              Create project →
            </Link>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-12 text-center">
              <Briefcase size={48} className="mx-auto mb-4 text-text-muted/40" />
              <p className="text-text-secondary">No projects yet.</p>
              <Link 
                href="/admin/projects/new" 
                className="mt-3 text-amber-500 text-sm hover:underline inline-flex items-center gap-1"
              >
                <Plus size={14} /> Add your first project
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all group"
              >
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {project.image_url && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Star size={10} /> Featured
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </div>
                  
                  {project.subtitle && (
                    <p className="text-xs text-amber-500 mb-1">{project.subtitle}</p>
                  )}
                  
                  <p className="text-text-secondary text-xs sm:text-sm line-clamp-2">
                    {project.description}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-text-muted">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs px-1.5 py-0.5 text-text-muted">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1 ml-0 sm:ml-2 flex-shrink-0">
                  <Link 
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="View project"
                  >
                    <Eye size={14} className="text-text-secondary" />
                  </Link>
                  <button
                    onClick={() => toggleFeatured(project.slug, project.featured)}
                    disabled={actionLoading === project.slug}
                    className={`p-1.5 rounded-lg transition-colors ${
                      project.featured 
                        ? 'text-amber-500 bg-amber-500/10' 
                        : 'text-text-muted hover:text-amber-500 hover:bg-amber-500/10'
                    }`}
                    title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {actionLoading === project.slug ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Star size={14} />
                    )}
                  </button>
                  <Link 
                    href={`/admin/projects/edit/${project.slug}`}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Edit project"
                  >
                    <Edit size={14} className="text-text-secondary" />
                  </Link>
                  <button 
                    onClick={() => deleteProject(project.slug, project.title)}
                    disabled={actionLoading === project.slug}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {projects.length > 0 && (
          <div className="mt-4 pt-3 text-center">
            <p className="text-xs text-text-muted">
              Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}