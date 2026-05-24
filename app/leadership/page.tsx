'use client'

import { Users, GraduationCap, PenTool, BookOpen, Heart, Calendar } from 'lucide-react'

export default function LeadershipPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <div
         }
         }
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Leadership & <span className="gradient-text">Community</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Serving others through innovation, mentorship, and community building
          </p>
        </div>

        {/* Innovations Coordinator */}
        <div
         }
         }
         }
          className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-start gap-4">
            <Users size={40} className="text-teal-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Innovations Coordinator</h2>
              <p className="text-teal-500 mb-2">Science For All (KUHeS)</p>
              <p className="text-gray-600 dark:text-gray-400">
                Coordinating innovation-centered activities, encouraging student innovation, supporting collaborative problem solving, and promoting practical systems thinking. This role has strengthened leadership, coordination, organizational thinking, public communication, and innovation management.
              </p>
            </div>
          </div>
        </div>

        {/* Publications Team */}
        <div
         }
         }
         }
          className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-start gap-4">
            <PenTool size={40} className="text-teal-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Graphic Designer</h2>
              <p className="text-teal-500 mb-2">KUHeS Publications Team</p>
              <p className="text-gray-600 dark:text-gray-400">
                Visual communication, poster design, presentation graphics, and media support. Strengthened design communication, presentation structure, and visual storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* Teaching Experience */}
        <div
         }
         }
         }
          className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-start gap-4">
            <GraduationCap size={40} className="text-teal-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Student Teacher</h2>
              <p className="text-teal-500 mb-2">Bright Future Private Academy</p>
              <p className="text-gray-600 dark:text-gray-400">
                Served as a student teacher for approximately one year. Responsibilities included lesson delivery, student mentorship, classroom coordination, educational communication, and learner support. Strengthened patience, communication, leadership, and teaching structure.
              </p>
            </div>
          </div>
        </div>

        {/* Peer Support */}
        <div
         }
         }
         }
          className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-start gap-4">
            <Heart size={40} className="text-teal-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Peer Support & Mentorship</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Actively supporting and mentoring fellow students academically and personally through collaborative learning, academic encouragement, peer support, and growth-oriented student culture.
              </p>
            </div>
          </div>
        </div>

        {/* Conferences */}
        <div
         }
         }
         }
          className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-amber-500/10"
        >
          <div className="flex items-start gap-4">
            <Calendar size={40} className="text-teal-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Conferences & Exposure</h2>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="font-semibold">Malawi Liverpool Wellcome Trust Diagnostics Workshop</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exposure to frugal innovation, diagnostics, healthcare accessibility, and infrastructure-aware design.</p>
                </div>
                <div>
                  <p className="font-semibold">Men of Courage Conference</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Leadership and personal development focused on discipline, masculinity, leadership, purpose, and spiritual growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}