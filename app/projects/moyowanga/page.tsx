'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, MessageCircle, Database, Globe, Shield, 
  Smartphone, Users, Zap, ArrowLeft, CheckCircle,
  Activity, BarChart, Clock, Phone, Languages, 
  TrendingUp, Award, Target, Battery, WifiOff,
  Code, ExternalLink, Copy
} from 'lucide-react'

const languages = ['English', 'Chichewa', 'Tumbuka', 'Yao', 'Chilomwe', 'Chisena']

const features = [
  { 
    title: 'Patient Management', 
    desc: 'Registration, profile tracking, health condition categorization, medication scheduling with multi-dose support',
    icon: Users
  },
  { 
    title: 'SMS Infrastructure', 
    desc: 'Automated reminders, two-way communication, multi-language support, quiet hours, opt-out functionality',
    icon: Phone
  },
  { 
    title: 'Healthcare Dashboard', 
    desc: 'Live adherence monitoring, patient activity tracking, data visualization, CSV export for clinic records',
    icon: BarChart
  },
  { 
    title: 'Monitoring Tools', 
    desc: 'Blood pressure logging, blood sugar tracking, trend visualization, adherence streak tracking',
    icon: Activity
  }
]

export default function MoyoWangaPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("MoyoWanga: Kumbukilani kumwa mankhwala anu. Yankhani ndi 'NDI' kutsimikizira.")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 mb-4">
            <Heart size={28} className="text-red-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">
            MoyoWanga
          </h1>
          <p className="text-text-secondary text-lg mt-2">
            Multilingual Chronic Disease Support Ecosystem
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Active Project</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">Healthcare Technology</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">SMS Infrastructure</span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Languages, label: 'Languages', value: '6', color: 'text-green-400' },
            { icon: Users, label: 'Patient Capacity', value: '100+', color: 'text-blue-400' },
            { icon: Clock, label: 'Daily Reminders', value: '24/7', color: 'text-amber-400' },
            { icon: TrendingUp, label: 'Adherence Tracking', value: 'Real-time', color: 'text-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-center">
              <stat.icon size={20} className={`mx-auto mb-1 ${stat.color}`} />
              <div className="text-lg font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* The Problem */}
        <section className="mb-8 p-6 rounded-xl bg-red-500/5 border border-red-500/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Target size={20} className="text-red-400" />
            The Problem
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            Across many African healthcare systems, patients receive treatment during hospital visits but lack structured 
            follow-up support afterward. This creates:
          </p>
          <ul className="space-y-2 text-text-secondary ml-6 list-disc">
            <li>Medication non-adherence — patients forget or stop taking critical medications</li>
            <li>Missed appointments — no reminders for follow-up visits</li>
            <li>Poor health monitoring — blood pressure and blood sugar go unmanaged</li>
            <li>Communication barriers — language and literacy challenges</li>
            <li>Preventable complications — strokes, heart attacks, and hospital readmissions</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            Non-communicable diseases (NCDs) like hypertension and diabetes require <strong>daily management</strong>, 
            yet our healthcare systems were built for acute infections, not lifelong conditions.
          </p>
        </section>

        {/* The Solution */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart size={20} className="text-amber-500" />
            The Solution
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            MoyoWanga bridges this gap through scalable communication systems designed specifically for 
            infrastructure-limited settings. The platform works on both smartphones and basic feature phones, 
            starting where patients actually are.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <feature.icon size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/5 to-teal-500/5 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Patient Registration</h3>
                <p className="text-text-secondary text-sm">CHW registers patient with name, condition, medication schedule, preferred language, and phone number.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Daily SMS Reminders</h3>
                <p className="text-text-secondary text-sm">Patient receives automated SMS in their chosen language at scheduled medication times.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Simple Response</h3>
                <p className="text-text-secondary text-sm">Patient replies 1 for "took medication" or 2 for "missed" — no internet, no app, no English needed.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold">Real-time Dashboard</h3>
                <p className="text-text-secondary text-sm">CHWs see green (adherent), red (missed), or yellow (pending) status — knows exactly who needs a home visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SMS Demo */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-amber-500" />
            SMS Experience
          </h2>
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex flex-col gap-3">
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-none bg-gray-800 text-white">
                  <p className="text-sm">MoyoWanga: Kumbukilani kumwa mankhwala anu a shuga. Yankhani ndi 'NDI' kutsimikizira.</p>
                  <p className="text-xs text-gray-400 mt-1">(Diabetes medication reminder in Chichewa)</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] p-3 rounded-2xl rounded-tr-none bg-green-600 text-white">
                  <p className="text-sm">NDI</p>
                  <p className="text-xs text-green-200 mt-1">Patient confirms adherence</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-none bg-gray-800 text-white">
                  <p className="text-sm">Zikomo! Mwayendetsa bwino lero. Pitilizani momwemo.</p>
                  <p className="text-xs text-gray-400 mt-1">Confirmation message in Chichewa</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <code className="text-xs text-gray-300">"MoyoWanga: Kumbukilani kumwa mankhwala anu a shuga. Yankhani ndi 'NDI' kutsimikizira."</code>
              <button onClick={handleCopy} className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors">
                <Copy size={14} className="text-amber-500" />
              </button>
            </div>
            {copied && <p className="text-green-500 text-sm mt-2">✓ Copied to clipboard!</p>}
          </div>
        </section>

        {/* Multilingual Support */}
        <section className="mb-8 p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-amber-500" />
            Multilingual Support
          </h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            Healthcare communication should respect linguistic realities, not ignore them. MoyoWanga currently supports:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {languages.map(lang => (
              <span key={lang} className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium">
                {lang}
              </span>
            ))}
          </div>
          <p className="text-text-muted text-sm italic">
            More languages can be added by simply updating the message file — designed for easy expansion across Africa.
          </p>
        </section>

        {/* Impact & Metrics */}
        <section className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-green-500/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            Impact & Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/30">
              <p className="text-2xl font-bold text-green-400">MWK 30</p>
              <p className="text-sm text-text-muted">Cost per patient per day for SMS</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/30">
              <p className="text-2xl font-bold text-green-400">100%</p>
              <p className="text-sm text-text-muted">Phones reached (SMS works on all devices)</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/30">
              <p className="text-2xl font-bold text-green-400">100+</p>
              <p className="text-sm text-text-muted">Patients monitored by one CHW dashboard</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900/30">
              <p className="text-2xl font-bold text-green-400">~$50 USD</p>
              <p className="text-sm text-text-muted">Monthly cost for 100 chronic patients</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm">
            *Cost scales with clinical need: once-daily Amlodipine costs MWK 900/month, twice-daily Metformin costs MWK 1,800/month, 
            complex insulin patients (3x/day) cost MWK 2,700/month — less than a single bottle of soda.
          </p>
        </section>

        {/* Technology Stack */}
        <section className="mb-8 p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database size={20} className="text-amber-500" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Flask', 'SQLAlchemy'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Database</h3>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'Supabase'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">SMS Infrastructure</h3>
              <div className="flex flex-wrap gap-2">
                {["Africa's Talking API"].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-amber-500">Frontend & Deployment</h3>
              <div className="flex flex-wrap gap-2">
                {['HTML/CSS/JS', 'Render', 'GitHub'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Development Challenges */}
        <section className="mb-8 p-6 rounded-xl bg-red-500/5 border border-red-500/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Shield size={20} className="text-red-400" />
            Challenges Overcome
          </h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex gap-2"><span className="text-amber-500">•</span> Telecom integration and compliance — formal business registration for two-way communication</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> SMS callback debugging across different network conditions</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Sender ID restrictions requiring registered identity verification</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Infrastructure instability during deployment</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Financial limitations — built on a student budget</li>
          </ul>
        </section>

        {/* Current Status */}
        <section className="mb-8 p-6 rounded-xl bg-green-500/5 border border-green-500/20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-400" />
            Current Status
          </h2>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Fully deployed and operational on Render</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Tested with real patient workflows</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Multi-language infrastructure implemented</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> CHW dashboard functional and tested</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> SMS scheduling operational 24/7</li>
            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Ready for clinical pilot study</li>
          </ul>
        </section>

        {/* Long-term Vision */}
        <section className="mb-8 p-6 rounded-xl bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-teal-500/20 text-center">
          <Heart size={32} className="text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-3">Long-term Vision</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            To evolve MoyoWanga into a scalable African health intelligence platform — 
            integrating AI-assisted healthcare support, predictive adherence monitoring, 
            community health analytics, and multilingual healthcare communication systems.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Battery size={14} className="text-amber-500" /> AI Integration
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <WifiOff size={14} className="text-amber-500" /> Offline-first
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <TrendingUp size={14} className="text-amber-500" /> Predictive Analytics
            </div>
          </div>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-4">
          <a 
            href="https://moyowanga.fly.dev" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:scale-[1.02] transition-all"
          >
            <ExternalLink size={18} /> Live Demo
          </a>
          <a 
            href="https://github.com/joelkaudzu9-ship-it/moyowanga" 
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