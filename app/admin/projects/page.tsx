'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Star } from 'lucide-react'

type Project = {
  id: number
  title: string
  subtitle: string
  description: string
  status: string
  featured: boolean
  technologies: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !currentFeatured }),
    })
    if (res.ok) fetchProjects()
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) fetchProjects()
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
          <h1 className="text-3xl font-bold gradient-text-gold">Projects</h1>
          <Link href="/admin/projects/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Project
          </Link>
        </div>

        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-text-secondary">No projects yet.</p>
              <Link href="/admin/projects/new" className="text-accent-gold hover:underline mt-2 inline-block">
                Add your first project →
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 glass-card">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 rounded bg-accent-gold/20 text-accent-gold">Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mt-1">{project.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface border border-border">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className={`p-2 rounded-lg transition-colors ${project.featured ? 'text-accent-gold' : 'text-text-muted hover:text-accent-gold'}`}
                  >
                    <Star size={16} />
                  </button>
                  <Link href={`/admin/projects/edit/${project.id}`} className="p-2 rounded-lg hover:bg-surface transition-colors">
                    <Edit size={16} className="text-text-secondary" />
                  </Link>
                  <button onClick={() => deleteProject(project.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
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