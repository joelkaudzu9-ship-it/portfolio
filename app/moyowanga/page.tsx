'use client'

import { useState } from 'react'
import { Check, Globe, Smartphone, Database, Cloud, Shield, ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'

const languages = ['English', 'Chichewa', 'Tumbuka', 'Yao', 'Chilomwe', 'Chisena']

const features = [
  { title: 'Patient Management', desc: 'Registration, profile tracking, health categorization, medication scheduling' },
  { title: 'SMS Infrastructure', desc: 'Automated reminders, two-way communication, multi-language support' },
  { title: 'Healthcare Dashboard', desc: 'Live adherence monitoring, patient activity tracking, data visualization' },
  { title: 'Monitoring Tools', desc: 'Blood pressure/sugar logging, trend tracking, exportable datasets' }
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
      <div className="container-custom">
        {/* Back Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="text-amber-500 font-semibold">Healthcare Technology Platform</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            Moyo<span className="text-amber-500">Wanga</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl">
            Multilingual Chronic Disease Support Ecosystem for low-resource healthcare environments
          </p>
        </div>

        {/* Problem Statement */}
        <div className="mb-12 p-8 rounded-2xl bg-red-500/10 border border-red-500/20">
          <h2 className="text-2xl font-bold mb-3">The Problem</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Across many African healthcare systems, patients receive treatment during hospital visits but lack structured 
            follow-up support afterward. This creates medication non-adherence, missed appointments, poor health monitoring, 
            communication barriers, and preventable complications.
          </p>
        </div>

        {/* Solution */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Solution</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            MoyoWanga bridges this gap through scalable SMS communication systems designed for infrastructure-limited settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <Check size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-teal-500/10 to-amber-500/10">
          <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Database className="mx-auto mb-2 text-amber-500" size={28} />
              <p className="font-semibold">Python + Flask</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Backend</p>
            </div>
            <div>
              <Cloud className="mx-auto mb-2 text-amber-500" size={28} />
              <p className="font-semibold">PostgreSQL + Supabase</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
            </div>
            <div>
              <Smartphone className="mx-auto mb-2 text-amber-500" size={28} />
              <p className="font-semibold">Africa's Talking API</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">SMS Infrastructure</p>
            </div>
            <div>
              <Shield className="mx-auto mb-2 text-amber-500" size={28} />
              <p className="font-semibold">Render + GitHub</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deployment</p>
            </div>
          </div>
        </div>

        {/* Multilingual Support */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="text-amber-500" /> Multilingual Support
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {languages.map(lang => (
              <span key={lang} className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                {lang}
              </span>
            ))}
          </div>
          
          {/* SMS Demo */}
          <div className="mt-6 p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <p className="font-semibold mb-3">📱 SMS Demo Message</p>
            <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-900 rounded-lg font-mono text-sm">
              <code>"MoyoWanga: Kumbukilani kumwa mankhwala anu a shuga. Yankhani ndi 'NDI' kutsimikizira."</code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
            {copied && <p className="text-green-500 text-sm mt-2">✓ Copied to clipboard!</p>}
            <p className="text-xs text-gray-500 mt-3">*Demo message in Chichewa: Diabetes medication reminder</p>
          </div>
        </div>

        {/* Development Challenges */}
        <div className="mb-12 p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/30">
          <h2 className="text-2xl font-bold mb-4">Challenges Overcome</h2>
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="text-amber-500">•</span> Telecom integration and compliance</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> SMS callback debugging</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Sender ID restrictions</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Financial limitations</li>
            <li className="flex gap-2"><span className="text-amber-500">•</span> Formal business registration for two-way communication</li>
          </ul>
        </div>

        {/* Long-term Vision */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-teal-500/20 to-amber-500/20 text-center">
          <h2 className="text-2xl font-bold mb-3">Long-term Vision</h2>
          <p className="text-gray-700 dark:text-gray-300">
            AI-assisted healthcare systems, predictive adherence monitoring, community health analytics, 
            and scalable African healthcare communication infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}