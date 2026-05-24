'use client'

import { useState } from 'react'
import { Heart, Feather, Sparkles, PenLine } from 'lucide-react'

const poems = [
  {
    title: "The Builder's Prayer",
    excerpt: "Let my hands build what outlasts me,\nSystems that breathe when I'm asleep.\nLet my failures be foundations,\nNot epitaphs.",
    theme: "Growth",
    icon: Sparkles
  },
  {
    title: "Uncertainty",
    excerpt: "I have learned to dance with the unknown,\nTo find solid ground in shifting sand.\nFor what is faith but moving forward\nWhen the path is not yet planned?",
    theme: "Faith",
    icon: Heart
  },
  {
    title: "The Space Between",
    excerpt: "Between the dream and the waking,\nBetween the wound and the healing,\nThere is a silence where strength is born.\nI am learning to live there.",
    theme: "Healing",
    icon: PenLine 
  }
]

export default function PoetryPage() {
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null)

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Poetry & <span className="gradient-text-gold">Reflections</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Words that explore healing, faith, identity, and the human experience
          </p>
        </div>

        {/* Poems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {poems.map((poem, index) => (
            <div
              key={poem.title}
              onClick={() => setSelectedPoem(poem)}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 cursor-pointer card-hover"
            >
              <poem.icon size={32} className="text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{poem.title}</h3>
              <p className="text-amber-500 text-sm mb-3">{poem.theme}</p>
              <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans text-sm">
                {poem.excerpt}
              </pre>
              <div className="mt-4 text-amber-500 text-sm">Click to read →</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-teal-500/20 to-amber-500/20 text-center">
          <p className="text-xl italic text-gray-700 dark:text-gray-300">
            "Poetry has strengthened my communication, emotional intelligence, storytelling ability, and reflective thinking. 
            Creativity and technical intelligence should coexist, not compete."
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedPoem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPoem(null)}
        >
          <div
            className="max-w-lg w-full p-8 rounded-2xl bg-white dark:bg-gray-900 border border-amber-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <selectedPoem.icon size={40} className="text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{selectedPoem.title}</h2>
            <p className="text-amber-500 mb-6">{selectedPoem.theme}</p>
            <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-serif text-lg leading-relaxed">
              {selectedPoem.excerpt}
            </pre>
            <button
              onClick={() => setSelectedPoem(null)}
              className="mt-6 w-full py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}