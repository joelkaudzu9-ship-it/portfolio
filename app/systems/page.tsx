'use client'

import { Brain, Network, Target, Zap, Shield, Lightbulb } from 'lucide-react'

const principles = [
  {
    icon: Brain,
    title: "Interconnected Thinking",
    description: "Problems aren't isolated—healthcare, education, technology, and leadership are interconnected systems that must work together."
  },
  {
    icon: Network,
    title: "Infrastructure Awareness",
    description: "Systems must survive real-world constraints: inconsistent internet, limited smartphones, multilingual populations."
  },
  {
    icon: Target,
    title: "Question Framework",
    description: "Not just 'How do we build this?' but 'How does this survive real-world environments?' and 'How do ordinary people benefit?'"
  },
  {
    icon: Zap,
    title: "Frugal Innovation",
    description: "The best systems work within limitations, not despite them. SMS over apps. Simple over complex. Accessible over impressive."
  },
  {
    icon: Shield,
    title: "African-Centered Design",
    description: "Africa's future cannot simply imitate systems built for entirely different environments. We must solve locally meaningful problems."
  },
  {
    icon: Lightbulb,
    title: "Long-term Impact",
    description: "Build systems that outlast individual involvement. Create ecosystems, not just features."
  }
]

export default function SystemsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <div
         }
         }
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Systems <span className="gradient-text">Thinking</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            How I approach problems—not as isolated tasks, but as interconnected systems
          </p>
        </div>

        {/* Core Philosophy */}
        <div
         }
         }
         }
          className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-teal-500/20 to-amber-500/20 text-center"
        >
          <p className="text-xl font-bold gradient-text mb-3">
            Technology should serve people, not merely impress them.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Meaningful systems are built when innovation meets empathy, intellect meets service, creativity meets discipline, and vision meets execution.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
             }
             }
             }
             }
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
            >
              <principle.icon size={40} className="text-teal-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{principle.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{principle.description}</p>
            </div>
          ))}
        </div>

        {/* African Innovation Philosophy */}
        <div
         }
         }
         }
         }
          className="p-8 rounded-2xl bg-teal-500/10 border border-teal-500/20"
        >
          <h2 className="text-2xl font-bold mb-4">African Innovation Philosophy</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Africa's innovation landscape cannot simply imitate systems built for entirely different environments. 
            African innovation must:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="text-teal-500">✓</span> Respect infrastructure realities</li>
            <li className="flex gap-2"><span className="text-teal-500">✓</span> Prioritize accessibility</li>
            <li className="flex gap-2"><span className="text-teal-500">✓</span> Remain economically practical</li>
            <li className="flex gap-2"><span className="text-teal-500">✓</span> Adapt to multilingual populations</li>
            <li className="flex gap-2"><span className="text-teal-500">✓</span> Solve locally meaningful problems</li>
          </ul>
        </div>

        {/* Quote */}
        <div
         }
         }
         }
         }
          className="mt-12 text-center"
        >
          <p className="text-2xl font-bold gradient-text">
            "How do ordinary people actually benefit from this system?"
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            — The question that guides every project I build
          </p>
        </div>
      </div>
    </div>
  )
}