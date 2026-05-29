'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, FileText, LogOut, 
  BookOpen, Briefcase, Users, Star, Award, 
  Heart, Settings, Plus, Mail, MessageCircle,
  Shield, Eye, TrendingUp, DollarSign
} from 'lucide-react'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    posts: 0,
    projects: 0,
    messages: 0,
    subscribers: 0,
    comments: 0,
    pendingComments: 0,
    achievements: 0,
    totalViews: 0,
    poetrySales: 0,
    poetryRevenue: 0,
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    console.log('Auth check:', data)
    if (!data.authenticated) router.push('/admin')
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...')
      
      const [postsRes, projectsRes, messagesRes, subscribersRes, commentsRes, achievementsRes, viewsRes, poetrySalesRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/projects'),
        fetch('/api/messages'),
        fetch('/api/newsletter/subscribers'),
        fetch('/api/blog-comments/admin'),
        fetch('/api/achievements'),
        fetch('/api/blog/stats/views'),
        fetch('/api/poetry/sales-stats'),
      ])
      
      // Log response statuses
      console.log('Posts response status:', postsRes.status)
      console.log('Projects response status:', projectsRes.status)
      console.log('Messages response status:', messagesRes.status)
      console.log('Subscribers response status:', subscribersRes.status)
      console.log('Comments response status:', commentsRes.status)
      console.log('Achievements response status:', achievementsRes.status)
      console.log('Views response status:', viewsRes.status)
      console.log('Poetry Sales response status:', poetrySalesRes.status)
      
      const posts = await postsRes.json()
      const projects = await projectsRes.json()
      const messages = await messagesRes.json()
      const subscribers = await subscribersRes.json()
      const comments = await commentsRes.json()
      const achievements = await achievementsRes.json()
      const views = await viewsRes.json()
      const poetrySales = await poetrySalesRes.json()
      
      // Debug logs - what's actually coming back
      console.log('Posts data:', posts)
      console.log('Posts length:', Array.isArray(posts) ? posts.length : 'Not an array')
      console.log('Published posts:', Array.isArray(posts) ? posts.filter((p: any) => p.published).length : 0)
      
      console.log('Projects data:', projects)
      console.log('Projects length:', Array.isArray(projects) ? projects.length : 'Not an array')
      
      console.log('Messages data:', messages)
      console.log('Messages length:', Array.isArray(messages) ? messages.length : 'Not an array')
      console.log('Unread messages:', Array.isArray(messages) ? messages.filter((m: any) => !m.read).length : 0)
      
      console.log('Subscribers data:', subscribers)
      console.log('Subscribers length:', Array.isArray(subscribers) ? subscribers.length : 'Not an array')
      
      console.log('Comments data:', comments)
      console.log('Comments length:', Array.isArray(comments) ? comments.length : 'Not an array')
      console.log('Approved comments:', Array.isArray(comments) ? comments.filter((c: any) => c.approved).length : 0)
      console.log('Pending comments:', Array.isArray(comments) ? comments.filter((c: any) => !c.approved).length : 0)
      
      console.log('Achievements data:', achievements)
      console.log('Achievements length:', Array.isArray(achievements) ? achievements.length : 'Not an array')
      
      console.log('Views data:', views)
      console.log('Total views:', views?.total || 0)
      
      console.log('Poetry Sales data:', poetrySales)
      console.log('Total sales:', poetrySales?.totalSales || 0)
      console.log('Total revenue:', poetrySales?.totalRevenue || 0)
      
      setStats({
        posts: Array.isArray(posts) ? posts.filter((p: any) => p.published).length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        messages: Array.isArray(messages) ? messages.filter((m: any) => !m.read).length : 0,
        subscribers: Array.isArray(subscribers) ? subscribers.length : 0,
        comments: Array.isArray(comments) ? comments.filter((c: any) => c.approved).length : 0,
        pendingComments: Array.isArray(comments) ? comments.filter((c: any) => !c.approved).length : 0,
        achievements: Array.isArray(achievements) ? achievements.length : 0,
        totalViews: views?.total || 0,
        poetrySales: poetrySales?.totalSales || 0,
        poetryRevenue: poetrySales?.totalRevenue || 0,
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
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    { 
      title: 'Blog Posts', 
      icon: BookOpen, 
      href: '/admin/blog',
      description: 'Create, edit, and manage blog posts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Projects', 
      icon: Briefcase, 
      href: '/admin/projects',
      description: 'Manage featured projects and portfolio',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Achievements', 
      icon: Award, 
      href: '/admin/achievements',
      description: 'Manage certificates, awards, and recognition',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      title: 'Testimonials', 
      icon: Users, 
      href: '/admin/testimonials',
      description: 'Manage what people say about you',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      title: 'Poetry Sales', 
      icon: DollarSign, 
      href: '/admin/poetry-sales',
      description: 'Track poetry book sales and customer data',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      title: 'Newsletter', 
      icon: Mail, 
      href: '/admin/newsletter',
      description: 'Manage subscribers and send broadcasts',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    { 
      title: 'Messages', 
      icon: Heart, 
      href: '/admin/messages',
      description: 'View contact form submissions',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    { 
      title: 'Comments', 
      icon: MessageCircle, 
      href: '/admin/comments',
      description: `Moderate blog comments${stats.pendingComments > 0 ? ` (${stats.pendingComments} pending)` : ''}`,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10'
    },
    { 
      title: 'Site Settings', 
      icon: Settings, 
      href: '/admin/settings',
      description: 'SEO, social links, global settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-500 text-sm">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <LayoutDashboard size={20} className="text-amber-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="container-custom px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Overview - 8 cards now */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <FileText size={18} className="mx-auto mb-1 text-amber-500" />
            <div className="text-xl font-bold">{stats.posts}</div>
            <div className="text-xs text-text-muted">Blog Posts</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <Briefcase size={18} className="mx-auto mb-1 text-green-500" />
            <div className="text-xl font-bold">{stats.projects}</div>
            <div className="text-xs text-text-muted">Projects</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <Award size={18} className="mx-auto mb-1 text-yellow-500" />
            <div className="text-xl font-bold">{stats.achievements}</div>
            <div className="text-xs text-text-muted">Achievements</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <DollarSign size={18} className="mx-auto mb-1 text-emerald-500" />
            <div className="text-xl font-bold">{stats.poetrySales}</div>
            <div className="text-xs text-text-muted">Poetry Sales</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <Mail size={18} className="mx-auto mb-1 text-pink-500" />
            <div className="text-xl font-bold">{stats.subscribers}</div>
            <div className="text-xs text-text-muted">Subscribers</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <MessageCircle size={18} className="mx-auto mb-1 text-teal-500" />
            <div className="text-xl font-bold">{stats.comments}</div>
            <div className="text-xs text-text-muted">Comments</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <Eye size={18} className="mx-auto mb-1 text-purple-500" />
            <div className="text-xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-text-muted">Total Views</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-3 text-center">
            <TrendingUp size={18} className="mx-auto mb-1 text-emerald-500" />
            <div className="text-xl font-bold">MWK {stats.poetryRevenue.toLocaleString()}</div>
            <div className="text-xs text-text-muted">Revenue</div>
          </div>
        </div>

        {/* Pending Alerts */}
        {(stats.pendingComments > 0 || stats.messages > 0) && (
          <div className="mb-6 flex flex-wrap gap-3">
            {stats.pendingComments > 0 && (
              <Link 
                href="/admin/comments?filter=pending"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm hover:bg-yellow-500/20 transition-colors"
              >
                <MessageCircle size={14} />
                {stats.pendingComments} pending comment{stats.pendingComments !== 1 ? 's' : ''} to moderate
              </Link>
            )}
            {stats.messages > 0 && (
              <Link 
                href="/admin/messages"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm hover:bg-red-500/20 transition-colors"
              >
                <Heart size={14} />
                {stats.messages} unread message{stats.messages !== 1 ? 's' : ''}
              </Link>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-500" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/cms?section=hero" className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs">
              Edit Hero
            </Link>
            <Link href="/admin/new-post" className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs">
              New Post
            </Link>
            <Link href="/admin/projects/new" className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs">
              Add Project
            </Link>
            <Link href="/admin/achievements/new" className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs">
              Add Achievement
            </Link>
            <Link href="/admin/poetry-sales" className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-xs">
              View Poetry Sales
            </Link>
            <Link href="/admin/newsletter/broadcast" className="px-3 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-xs">
              Send Broadcast
            </Link>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/50 transition-all hover:shadow-lg"
            >
              <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <section.icon size={20} className={section.color} />
              </div>
              <h3 className="text-base font-semibold mb-1 group-hover:text-amber-500 transition-colors">
                {section.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Shield size={16} className="text-amber-500" />
            Recent Activity
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-text-secondary">Poetry sales tracking integrated</span>
              <span className="text-text-muted ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-text-secondary">Newsletter system integrated</span>
              <span className="text-text-muted ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
              <span className="text-text-secondary">Comments system with moderation</span>
              <span className="text-text-muted ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-text-secondary">Achievements management ready</span>
              <span className="text-text-muted ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-text-secondary">View counter added to blog posts</span>
              <span className="text-text-muted ml-auto">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}