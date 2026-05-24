'use client'

import { Heart, Code, Globe, Users, BookOpen, Cpu, Sparkles, Target, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <div
         }
         }
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Executive <span className="gradient-text">Identity</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Dental Surgery Student • Healthcare Systems Thinker • Digital Health Builder • Innovation Coordinator • Creative Technologist
          </p>
        </div>

        {/* Main Bio */}
        <div
         }
         }
         }
          className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-teal-500/10 to-amber-500/10"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Joel George Kaudzu is an interdisciplinary healthcare and technology builder currently pursuing a Bachelor of Dental Surgery (BDS) at Kamuzu University of Health Sciences (KUHeS), Malawi.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            His work exists at the intersection of healthcare, systems thinking, digital innovation, leadership, community-centered design, software development, creativity, and infrastructure-aware problem solving.
          </p>
        </div>

        {/* Intersection Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {['Healthcare', 'Systems Thinking', 'Digital Innovation', 'Leadership', 'Community Design', 'Software Dev', 'Creativity', 'Infrastructure'].map((item) => (
            <div key={item} className="p-3 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-medium text-teal-500">✦</span>
              <p className="text-sm mt-1">{item}</p>
            </div>
          ))}
        </div>

        {/* Long-term Focus */}
        <div
         }
         }
         }
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Long-Term Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Scalable healthcare systems',
              'Multilingual digital infrastructure',
              'African-centered innovation',
              'Frugal healthcare technologies',
              'Digital health ecosystems',
              'Human-centered problem solving'
            ].map((focus) => (
              <div key={focus} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30">
                <Target size={18} className="text-teal-500" />
                <span>{focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Profile */}
        <div
         }
         }
         }
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Professional Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30">
              <Code className="text-teal-500 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Technical Experience</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Python & Flask</li>
                <li>• Front-end web technologies</li>
                <li>• Mobile application concepts</li>
                <li>• Cloud deployment systems</li>
                <li>• API integrations</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30">
              <Heart className="text-teal-500 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Healthcare Innovation</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Digital health systems</li>
                <li>• Healthcare innovation</li>
                <li>• Patient adherence systems</li>
                <li>• Low-resource environments</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30">
              <Users className="text-teal-500 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Leadership & Community</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Student leadership</li>
                <li>• Project conceptualization</li>
                <li>• Communication design</li>
                <li>• Educational infrastructure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Philosophy Quote */}
        <div
         }
         }
         }
         }
          className="p-8 rounded-2xl bg-gradient-to-r from-teal-500/20 to-amber-500/20 text-center"
        >
          <p className="text-2xl font-bold gradient-text mb-3">
            "Learning by building"
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This philosophy has led me to conceptualize and develop multiple systems and platforms focused on practical impact.
          </p>
        </div>
      </div>
    </div>
  )
}