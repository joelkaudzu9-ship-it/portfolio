'use client'

import { ArrowLeft, MessageCircle, Zap, Target } from 'lucide-react'
import Link from 'next/link'

export default function SendMePage() {
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
          <span className="text-accent-gold text-sm font-semibold tracking-wide uppercase">Digital Communication Platform</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">
            Send<span className="gradient-text-gold">Me</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mb-8">
            Digital Communication & Delivery Platform exploring efficient user interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
           }
           }
           }
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-3">Project Overview</h2>
              <p className="text-text-secondary leading-relaxed">
                SendMe is an application project exploring digital communication, system usability, 
                practical user interactions, and workflow simplification. The project reflects continued 
                experimentation with software systems, interface concepts, and communication infrastructure.
              </p>
            </div>
          </div>

          <div
           }
           }
           }
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Target className="text-accent-gold" size={20} /> Focus Areas</h2>
              <ul className="space-y-2 text-text-secondary">
                <li>• Digital communication systems</li>
                <li>• Usability and user experience</li>
                <li>• Workflow simplification</li>
                <li>• Practical user interactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}