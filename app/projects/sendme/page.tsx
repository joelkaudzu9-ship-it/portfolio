'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageCircle, Users, Car, ShoppingBag, CheckCircle, 
  Phone, MapPin, Clock, Star, Shield, Database, Cloud,
  Code, ExternalLink, ArrowLeft, Smartphone, Zap,
  Award, TrendingUp, Eye, Calendar, Server
} from 'lucide-react'

export default function SendMePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-4xl px-4 sm:px-6 mx-auto">
        
        {/* Back Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-amber-500 mb-6 hover:gap-3 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
            <Smartphone size={28} className="text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SendMe
          </h1>
          <p className="text-text-secondary text-lg mt-2">
            Campus Task Marketplace for KUHeS Students
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">Active Project</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">Progressive Web App</span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Flask + PostgreSQL</span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Users, label: 'Verification', value: 'KUHeS Only', color: 'text-blue-400' },
            { icon: CheckCircle, label: 'Task Types', value: '4', color: 'text-green-400' },
            { icon: MessageCircle, label: 'In-App Chat', value: 'Real-time', color: 'text-purple-400' },
            { icon: Server, label: 'Backend', value: 'Flask + Supabase', color: 'text-amber-400' }
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-center">
              <stat.icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
              <div className="text-lg font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Platform Overview */}
        <section className="mb-8 p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Smartphone size={20} className="text-blue-400" />
            Platform Overview
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            SendMe is a mobile-first campus task marketplace designed exclusively for KUHeS (Kamuzu University of Health Sciences) students. 
            The platform enables students to post tasks they need help with, accept tasks from peers, coordinate through in-app chat, 
            and build reputation through a rating system.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Built as a Progressive Web Application (PWA), SendMe delivers a native app-like experience through the browser 
            while maintaining the simplicity of web deployment.
          </p>
        </section>

        {/* Core Value Proposition */}
        <section className="mb-8 p-5 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            Core Value Proposition
          </h2>
          <p className="text-text-secondary leading-relaxed">
            The platform addresses the fragmented nature of campus micro-services by centralizing task requests 
            into a single, verified community. Students can request help with groceries, document delivery, 
            ride-sharing, and group purchases while knowing that all participants are verified KUHeS students 
            through institutional email authentication.
          </p>
        </section>

        {/* Task Types */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-400" />
            Task Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                  <Users size={20} />
                </div>
                <h3 className="font-semibold text-lg">Help Me</h3>
              </div>
              <p className="text-text-secondary text-sm">General assistance requests for everyday tasks like buying airtime, printing assignments, or getting groceries.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Car size={20} />
                </div>
                <h3 className="font-semibold text-lg">Send Me</h3>
              </div>
              <p className="text-text-secondary text-sm">Ride-sharing and transportation coordination with departure/destination tracking and seat availability.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <MapPin size={20} />
                </div>
                <h3 className="font-semibold text-lg">Deliver</h3>
              </div>
              <p className="text-text-secondary text-sm">Item delivery service with pickup and dropoff locations, delivery fee, and real-time tracking.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-semibold text-lg">Group Buy</h3>
              </div>
              <p className="text-text-secondary text-sm">Collective purchasing coordination with participant tracking, split costs, and group organization.</p>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-8 p-5 rounded-xl bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code size={20} className="text-amber-500" />
            Technical Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Python 3.11', 'Flask 2.3.3', 'SQLAlchemy 2.0', 'Gunicorn'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Database</h3>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'Supabase', 'SQLite (Dev)'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['HTML5', 'CSS3', 'JavaScript ES6+', 'GSAP 3.12', 'Font Awesome 6'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                {['Firebase FCM', 'Cloudinary', 'Brevo Email API', 'Render'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Email verification (@kuhes.ac.mw only)</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Anonymous browsing with session tracking</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> 4 task types with type-specific forms</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Real-time chat for task coordination</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Push notifications via Firebase FCM</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> User ratings and reputation system</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Location-based task filtering</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Group buy with participant tracking</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> WhatsApp integration for easy contact</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Admin dashboard for moderation</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> Backup code account recovery</div>
            <div className="flex items-center gap-2 text-text-secondary text-sm p-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /> PWA with offline-capable shell</div>
          </div>
        </section>

        {/* Admin Capabilities */}
        <section className="mb-8 p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Shield size={20} className="text-red-400" />
            Admin Capabilities
          </h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex gap-2">• <strong>User Management:</strong> View, ban, delete, and grant admin privileges</li>
            <li className="flex gap-2">• <strong>Task Oversight:</strong> Monitor all tasks across the platform</li>
            <li className="flex gap-2">• <strong>Report Handling:</strong> Review and resolve user reports</li>
            <li className="flex gap-2">• <strong>Platform Analytics:</strong> View comprehensive usage statistics</li>
            <li className="flex gap-2">• <strong>Keyboard Shortcuts:</strong> Ctrl+1 (Users), Ctrl+2 (Tasks), Ctrl+3 (Reports), Ctrl+R (Refresh)</li>
          </ul>
        </section>

        {/* Database Schema Highlights */}
        <section className="mb-8 p-5 rounded-xl bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Database size={20} className="text-blue-400" />
            Database Architecture
          </h2>
          <div className="space-y-3 text-text-secondary">
            <p><strong>User Model:</strong> Tracks email verification, profile completion, ratings, location consent, FCM tokens, and session management.</p>
            <p><strong>Task Model:</strong> Supports 4 task types with type-specific fields including payment, location, urgency, participants JSON array, and seat tracking.</p>
            <p><strong>Supporting Models:</strong> Ratings, Notifications, Reports, UserLocationHistory, ChatMessage, PushSubscription.</p>
            <p className="text-sm text-text-muted mt-2">Database indices on status, location coordinates, and task type for optimized filtering.</p>
          </div>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-4">
          <a 
            href="https://github.com/joelkaudzu9-ship-it/sendme" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Code size={18} /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}