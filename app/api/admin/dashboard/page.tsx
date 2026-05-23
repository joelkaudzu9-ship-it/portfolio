'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, LogOut } from 'lucide-react'

type Post = { 
  id: number; 
  title: string; 
  published: boolean; 
  created_at: string;
  slug?: string;
  excerpt?: string;
}

type Event = { 
  id: number; 
  title: string; 
  date: string;
  description?: string;
  location?: string;
}

type Project = { 
  id: number; 
  title: string; 
  status: string;
  subtitle?: string;
  description?: string;
}

type Message = { 
  id: number; 
  name: string; 
  email: string; 
  message: string;
  read: boolean;
  created_at?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState('posts')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check')
    const data = await res.json()
    if (!data.authenticated) router.push('/admin')
  }

  const fetchData = async () => {
    try {
      const [postsRes, eventsRes, projectsRes, messagesRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/events'),
        fetch('/api/projects'),
        fetch('/api/messages'),
      ])
      
      if (postsRes.ok) setPosts(await postsRes.json())
      if (eventsRes.ok) setEvents(await eventsRes.json())
      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (messagesRes.ok) setMessages(await messagesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'GET' })
    router.push('/admin')
  }

  const deleteItem = async (type: string, id: number) => {
    if (!confirm('Delete this item?')) return
    const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container-custom py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          {['posts', 'events', 'projects', 'poems', 'messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-teal-500/20'
              }`}
            >
              {tab} ({tab === 'posts' ? posts.length : tab === 'events' ? events.length : tab === 'projects' ? projects.length : tab === 'messages' ? messages.length : 0})
            </button>
          ))}
          <Link
            href="/admin/new-post"
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            <Plus size={18} /> New Post
          </Link>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${post.published ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${post.slug || post.id}`} target="_blank" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Eye size={18} />
                  </Link>
                  <Link href={`/admin/edit-post/${post.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => deleteItem('blog', post.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-gray-500 text-center py-8">No posts yet. Create your first post!</p>}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Contact Messages</h2>
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{msg.name}</h3>
                    <p className="text-sm text-teal-500">{msg.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${msg.read ? 'bg-gray-500/20' : 'bg-teal-500/20 text-teal-500'}`}>
                    {msg.read ? 'Read' : 'New'}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{msg.message}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500 text-center py-8">No messages yet.</p>}
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'events' || activeTab === 'projects' || activeTab === 'poems') && (
          <div className="text-center py-12 text-gray-500">
            <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon.</p>
            <p className="text-sm mt-2">Create tables for {activeTab} in Supabase first.</p>
          </div>
        )}
      </div>
    </div>
  )
}