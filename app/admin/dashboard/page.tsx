'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, FileText, LogOut, 
  BookOpen, Briefcase, Users, Star, Award, 
  Heart, Settings, Plus, Mail
} from 'lucide-react'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    posts: 0,
    projects: 0,
    messages: 0,
    subscribers: 0,
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
      const [postsRes, projectsRes, messagesRes, subscribersRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/projects'),
        fetch('/api/messages'),
        fetch('/api/newsletter/subscribers'),
      ])
      const posts = await postsRes.json()
      const projects = await projectsRes.json()
      const messages = await messagesRes.json()
      const subscribers = await subscribersRes.json()
      setStats({
        posts: posts.length || 0,
        projects: projects.length || 0,
        messages: messages.filter((m: any) => !m.read).length || 0,
        subscribers: subscribers.length || 0,
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
      title: 'Newsletter', 
      icon: Mail, 
      href: '/admin/newsletter',
      description: 'Manage subscribers and send broadcasts',
      color: 'text-pink-500'
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
        <div className="container-custom py-4 flex flex-wrap justify-between items-center gap-3">
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

      <div className="container-custom py-6 sm:py-8 px-4 sm:px-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass-card p-3 sm:p-4 text-center">
            <FileText className="mx-auto mb-1 sm:mb-2 text-amber-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{stats.posts}</div>
            <div className="text-xs text-gray-500">Blog Posts</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Briefcase className="mx-auto mb-1 sm:mb-2 text-green-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{stats.projects}</div>
            <div className="text-xs text-gray-500">Projects</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Mail className="mx-auto mb-1 sm:mb-2 text-pink-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{stats.subscribers}</div>
            <div className="text-xs text-gray-500">Subscribers</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Heart className="mx-auto mb-1 sm:mb-2 text-red-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">{stats.messages}</div>
            <div className="text-xs text-gray-500">Unread</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <Users className="mx-auto mb-1 sm:mb-2 text-purple-500" size={20} />
            <div className="text-xl sm:text-2xl font-bold">0</div>
            <div className="text-xs text-gray-500">Testimonials</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/admin/cms?section=hero" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs sm:text-sm">
              Edit Hero Section
            </Link>
            <Link href="/admin/new-post" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm">
              Write New Post
            </Link>
            <Link href="/admin/projects/new" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm">
              Add Project
            </Link>
            <Link href="/admin/newsletter" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs sm:text-sm">
              Manage Newsletter
            </Link>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/50 transition-all hover:shadow-lg"
            >
              <section.icon size={28} className={`${section.color} mb-2 sm:mb-3`} />
              <h3 className="text-base sm:text-lg font-semibold mb-1 group-hover:text-amber-500 transition-colors">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 glass-card">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500 text-xs sm:text-sm">Newsletter system integrated</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-gray-500 text-xs sm:text-sm">Subscriber management ready</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-500 text-xs sm:text-sm">Admin panel fully functional</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500 text-xs sm:text-sm">Blog system with Cloudinary</span>
              <span className="text-gray-400 text-xs ml-auto">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}