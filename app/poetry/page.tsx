'use client'

import { motion } from 'framer-motion'
import { PenTool, Quote } from 'lucide-react'

const poems = [
  {
    id: 1,
    title: 'The Builder\'s Prayer',
    excerpt: 'Lord, give me hands that build, not hands that break...',
    fullPoem: `Lord, give me hands that build, not hands that break.
Give me eyes that see the weary, not eyes that turn away.
Give me a heart that feels the pain of others,
And a mind that refuses to accept suffering as normal.

Teach me to build systems that outlive me,
Ideas that multiply beyond my voice,
And a life that points always back to You.

Amen.`,
    date: '2024'
  },
  {
    id: 2,
    title: 'The Blue Flame',
    excerpt: 'From a bucket and a prayer, a flame appeared...',
    fullPoem: `From a bucket and a prayer, a flame appeared.
Not in a grand laboratory with polished floors,
But in a dusty school lab where hope was all we had.

The seniors tried and failed.
We tried and failed again.
But failure was not the end — it was the classroom.

One night, a book, an idea, a quiet voice:
"Try the inverted bucket."

And the next day, blue fire kissed the air.
Not because we were brilliant,
But because we refused to stop showing up.`,
    date: '2021'
  },
  {
    id: 3,
    title: 'Grace in the Grind',
    excerpt: 'IQ opens doors, but grace keeps you inside...',
    fullPoem: `IQ opens doors, but grace keeps you inside.
The exam paper stares back like a mirror,
And suddenly you realize —
You didn't get here alone.

Someone prayed.
Someone believed.
Someone saw something you couldn't see yet.

So when the grades come back,
Don't boast.
Bow.`,
    date: '2025'
  },
  {
    id: 4,
    title: 'The Weight of Purpose',
    excerpt: 'Success is not applause, it is impact...',
    fullPoem: `Success is not applause, it is impact.
Not recognition, but reach.
Not what you gain, but what you give.

The question is not "How high can I climb?"
But "How many can I carry?"

The weight of purpose is heavy.
But it is the only weight worth bearing.`,
    date: '2024'
  }
]

export default function PoetryPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-3xl px-4 sm:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-4">
            <PenTool size={28} className="text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Poetry & Prose
          </h1>
          <p className="text-text-muted mt-3 max-w-xl mx-auto">
            Words from the heart — reflections on faith, growth, and the human experience.
          </p>
        </motion.div>

        <div className="space-y-8">
          {poems.map((poem, index) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                  {poem.title}
                </h2>
                <span className="text-xs text-text-muted">{poem.date}</span>
              </div>
              <div className="relative">
                <Quote size={16} className="absolute -top-2 -left-2 text-amber-500/30" />
                <p className="text-text-secondary italic leading-relaxed pl-4 whitespace-pre-line">
                  {poem.fullPoem}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center"
        >
          <p className="text-text-secondary text-sm">
            "Poetry has shaped my communication ability, emotional intelligence, 
            and perspective as both a creator and problem solver."
          </p>
          <p className="text-text-muted text-xs mt-2">— Joel George Kaudzu</p>
        </motion.div>
      </div>
    </div>
  )
}