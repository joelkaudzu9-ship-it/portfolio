'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, FileText, LogOut, 
  BookOpen, Briefcase, Users, Star, Award, 
  Heart, Settings, Plus
} from 'lucide-react'
//hhhhhhhhh
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    posts: 0,
    projects: 0,
    messages: 0,
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const [postsRes, projectsRes, messagesRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/projects'),
        fetch('/api/messages'),
      ])
      const posts = await postsRes.json()
      const projects = await projectsRes.json()
      const messages = await messagesRes.json()
      setStats({
        posts: posts.length || 0,
        projects: projects.length || 0,
        messages: messages.filter((m: any) => !m.read).length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const sections = [
    { 
      title: 'Content Management', 
      icon: FileText, 
      href: '/admin/cms',
      description: 'Manage hero, values, skills, mentors, timeline, quotes',
      color: 'text-amber-500'
    },
    { 
      title: 'Blog Posts', 
      icon: BookOpen, 
      href: '/admin/blog',
      description: 'Create, edit, and manage blog posts',
      color: 'text-blue-500'
    },
    { 
      title: 'Projects', 
      icon: Briefcase, 
      href: '/admin/projects',
      description: 'Manage featured projects and portfolio',
      color: 'text-green-500'
    },
    { 
      title: 'Testimonials', 
      icon: Users, 
      href: '/admin/testimonials',
      description: 'Manage what people say about you',
      color: 'text-purple-500'
    },
    { 
      title: 'Achievements', 
      icon: Award, 
      href: '/admin/achievements',
      description: 'Certificates, awards, and recognition',
      color: 'text-yellow-500'
    },
    { 
      title: 'Messages', 
      icon: Heart, 
      href: '/admin/messages',
      description: 'View contact form submissions',
      color: 'text-red-500'
    },
    { 
      title: 'Site Settings', 
      icon: Settings, 
      href: '/admin/settings',
      description: 'SEO, social links, global settings',
      color: 'text-gray-500'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={24} className="text-amber-500" />
            <h1 className="text-xl font-bold gradient-text-gold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <FileText className="mx-auto mb-2 text-amber-500" size={24} />
            <div className="text-2xl font-bold">{stats.posts}</div>
            <div className="text-xs text-gray-500">Blog Posts</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Briefcase className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold">{stats.projects}</div>
            <div className="text-xs text-gray-500">Projects</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-2xl font-bold">{stats.messages}</div>
            <div className="text-xs text-gray-500">Unread Messages</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Users className="mx-auto mb-2 text-purple-500" size={24} />
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-gray-500">Testimonials</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/cms?section=hero" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm">
              Edit Hero Section
            </Link>
            <Link href="/admin/new-post" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Write New Post
            </Link>
            <Link href="/admin/projects/new" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
              Add Project
            </Link>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/50 transition-all hover:shadow-lg"
            >
              <section.icon size={32} className={`${section.color} mb-3`} />
              <h3 className="text-lg font-semibold mb-1 group-hover:text-amber-500 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 p-6 glass-card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500">Admin panel fully functional</span>
              <span className="text-gray-400 text-xs ml-auto">Just now</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-500">CMS with 20+ content sections</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500">Blog system with Cloudinary</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}