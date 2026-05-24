'use client'

import { ArrowLeft, Smartphone, Activity, Shield, Target } from 'lucide-react'
import Link from 'next/link'

export default function CheckMySmilePage() {
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
          <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Mobile Health Application</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            Check<span className="gradient-text-gold">MySmile</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mb-8">
            Mobile Dental Health Application focused on oral healthcare awareness and preventive dentistry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
           }
           }
           }
          >
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3">Project Overview</h2>
              <p className="text-text-secondary leading-relaxed">
                CheckMySmile is a mobile health application concept that explores how accessible mobile technologies 
                can improve public understanding of oral health, promote preventive dentistry, and increase patient engagement.
              </p>
            </div>

            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Target className="text-accent-gold" size={20} /> Project Objectives</h2>
              <ul className="space-y-2 text-text-secondary">
                <li>• Promote preventive oral healthcare</li>
                <li>• Encourage dental hygiene awareness</li>
                <li>• Increase healthcare accessibility</li>
                <li>• Combine dentistry with digital innovation</li>
                <li>• Explore patient-centered health engagement systems</li>
              </ul>
            </div>
          </div>

          <div
           }
           }
           }
          >
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Smartphone className="text-accent-gold" size={20} /> Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm">MIT App Inventor</span>
                <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm">Mobile UI Design</span>
                <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm">Application Architecture</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Shield className="text-accent-gold" size={20} /> Significance</h2>
              <p className="text-text-secondary leading-relaxed">
                CheckMySmile represents my early exploration into merging dentistry, healthcare communication, and digital systems. 
                The project helped strengthen user-centered thinking, application logic understanding, and mobile health ideation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}