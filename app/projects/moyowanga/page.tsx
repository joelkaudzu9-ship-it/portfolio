'use client'

import { ArrowLeft, Check, Globe, Smartphone, Database, Cloud, Shield } from 'lucide-react'
import Link from 'next/link'

const languages = ['English', 'Chichewa', 'Tumbuka', 'Yao', 'Chilomwe', 'Chisena']

const features = [
  { title: 'Patient Management', desc: 'Registration, profile tracking, health categorization, medication scheduling' },
  { title: 'SMS Infrastructure', desc: 'Automated reminders, two-way communication, multi-language support' },
  { title: 'Healthcare Dashboard', desc: 'Live adherence monitoring, patient activity tracking, data visualization' },
  { title: 'Monitoring Tools', desc: 'Blood pressure/sugar logging, trend tracking, exportable datasets' }
]

export default function MoyoWangaPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-gold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div
         }
         }
        >
          <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Healthcare Technology Platform</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            Moyo<span className="gradient-text-gold">Wanga</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mb-8">
            Multilingual Chronic Disease Support Ecosystem for low-resource healthcare environments
          </p>
        </div>

        {/* Problem Statement */}
        <div
         }
         }
         }
          className="mb-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
        >
          <h2 className="text-xl font-bold mb-3 text-red-400">The Problem</h2>
          <p className="text-text-secondary leading-relaxed">
            Across many African healthcare systems, patients receive treatment during hospital visits but lack structured 
            follow-up support afterward. This creates medication non-adherence, missed appointments, poor health monitoring, 
            communication barriers, and preventable complications.
          </p>
        </div>

        {/* Solution */}
        <div
         }
         }
         }
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">The Solution</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            MoyoWanga bridges this gap through scalable SMS communication systems designed for infrastructure-limited settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-surface/50 border border-border">
                <Check size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div
         }
         }
         }
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-accent-gold/5 to-transparent border border-accent-gold/20"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Database className="mx-auto mb-2 text-accent-gold" size={28} />
              <p className="font-semibold text-sm">Python + Flask</p>
              <p className="text-xs text-text-muted">Backend</p>
            </div>
            <div>
              <Cloud className="mx-auto mb-2 text-accent-gold" size={28} />
              <p className="font-semibold text-sm">PostgreSQL + Supabase</p>
              <p className="text-xs text-text-muted">Database</p>
            </div>
            <div>
              <Smartphone className="mx-auto mb-2 text-accent-gold" size={28} />
              <p className="font-semibold text-sm">Africa's Talking API</p>
              <p className="text-xs text-text-muted">SMS Infrastructure</p>
            </div>
            <div>
              <Shield className="mx-auto mb-2 text-accent-gold" size={28} />
              <p className="font-semibold text-sm">Render + GitHub</p>
              <p className="text-xs text-text-muted">Deployment</p>
            </div>
          </div>
        </div>

        {/* Multilingual Support */}
        <div
         }
         }
         }
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="text-accent-gold" /> Multilingual Support
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {languages.map(lang => (
              <span key={lang} className="px-4 py-2 rounded-full bg-accent-gold/10 text-accent-gold text-sm font-medium">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Development Challenges */}
        <div
         }
         }
         }
          className="mb-12 p-6 rounded-2xl bg-surface/30 border border-border"
        >
          <h2 className="text-2xl font-bold mb-4">Challenges Overcome</h2>
          <ul className="space-y-2">
            <li className="flex gap-2 text-text-secondary"><span className="text-accent-gold">•</span> Telecom integration and compliance</li>
            <li className="flex gap-2 text-text-secondary"><span className="text-accent-gold">•</span> SMS callback debugging</li>
            <li className="flex gap-2 text-text-secondary"><span className="text-accent-gold">•</span> Sender ID restrictions</li>
            <li className="flex gap-2 text-text-secondary"><span className="text-accent-gold">•</span> Financial limitations</li>
            <li className="flex gap-2 text-text-secondary"><span className="text-accent-gold">•</span> Formal business registration for two-way communication</li>
          </ul>
        </div>

        {/* Long-term Vision */}
        <div
         }
         }
         }
          className="p-8 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-transparent border border-accent-gold/20 text-center"
        >
          <h2 className="text-2xl font-bold mb-3 gradient-text-gold">Long-term Vision</h2>
          <p className="text-text-secondary leading-relaxed">
            AI-assisted healthcare systems, predictive adherence monitoring, community health analytics, 
            and scalable African healthcare communication infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}