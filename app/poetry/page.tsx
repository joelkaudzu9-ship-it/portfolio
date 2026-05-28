'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, Quote, BookOpen, Heart, Infinity, 
  TrendingUp, Eye, Calendar, Star, ChevronRight,
  X, Sparkles, Download
} from 'lucide-react'
import Link from 'next/link'

const poems = [
  {
    id: 1,
    title: 'PARADOXICAL',
    section: 'BROKEN AND BECOMING',
    excerpt: 'Too much of a good thing they say, Can be harmful in some way...',
    fullPoem: `Too much of a good thing  they say,
Can be harmful in some way,
Of course  it  seems to pave way
But when does it become too much?
How do we know when to stop and clutch?`,
    date: '2024'
  },
  {
    id: 2,
    title: 'MY PAST I\'M SORRY',
    section: 'BROKEN AND BECOMING',
    excerpt: 'First Let me say sorry I failed you, Like a plane those promises just flew...',
    fullPoem: `First Let me say sorry I failed you
Like a plane those promises just flew
bad i could not achieve even a few
I said I will make you rememberable
But I can not dare reminisce about you`,
    date: '2024'
  },
  {
    id: 3,
    title: 'LOST GOLD',
    section: 'BROKEN AND BECOMING',
    excerpt: 'Hey friend, I know we\'re not in good terms, Our bond like dying flames...',
    fullPoem: `Hey friend,
I know we're not in good terms
Our bond like dying flames
But you're still my good friend
True we drifted apart
Mine for you is still a heavy heart`,
    date: '2024'
  },
  {
    id: 4,
    title: 'The Boy Who Almost Gave Up',
    section: 'BROKEN AND BECOMING',
    excerpt: 'There was a boy who used to laugh with his whole chest...',
    fullPoem: `There was a boy who used to laugh with his whole chest.
He believed in God. He believed in family.
He believed he was made for something more.
But life hit him.`,
    date: '2024'
  },
  {
    id: 5,
    title: 'MY TIME WAS COMING',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'For the stars to appear it has to be dark...',
    fullPoem: `For the stars to appear it has to be dark
I cry each time I look back
I recall the times I used to wear a sack
For all the necessities I used to lack`,
    date: '2024'
  },
  {
    id: 6,
    title: 'FRACTURED LIGHT',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'The fear of letdown gives us no reason to try again...',
    fullPoem: `The fear of letdown gives us no reason to try again
The people we trust are the ones who make it rain
The level of constant disappointments burdens us
Leaving us fed up, exhausted, and deeply burnt`,
    date: '2024'
  },
  {
    id: 7,
    title: 'THERE\'S OKAY IN BARELY OKAY',
    section: 'LIGHT THROUGH THE STORM',
    excerpt: 'I still remember it vividly, It was a bright Sunday afternoon...',
    fullPoem: `I still remember it vividly
It was a bright Sunday afternoon
The Sky was sunny, clearer and blue
Boredom struck me to the core`,
    date: '2024'
  },
  {
    id: 8,
    title: 'INFINIVERSE',
    section: 'INFINITE THOUGHTS',
    excerpt: 'In the infiniverse, where stars are born...',
    fullPoem: `In the infiniverse, where stars are born
And galaxies stretch beyond what's sworn
I find myself, a soul adrift
Yearning for the infinite, my heart's rift`,
    date: '2024'
  },
  {
    id: 9,
    title: 'WHAT IF',
    section: 'INFINITE THOUGHTS',
    excerpt: 'What if I died today, Breath seizure comes my way...',
    fullPoem: `What if I died today
Breath seizure comes my way
blood my heart no longer relays.
Will I face God?`,
    date: '2024'
  },
  {
    id: 10,
    title: 'IF BIRTH HAD ANESTHESIA',
    section: 'INFINITE THOUGHTS',
    excerpt: 'Ever wondered? If birth had anesthesia...',
    fullPoem: `Ever wondered?
If birth had anesthesia
Would it have a meaning?
If labour bore no pain
Would it be fulfilling? No`,
    date: '2024'
  },
  {
    id: 11,
    title: 'WE\'RE ALL CIRCUMCISED',
    section: 'SOCIETY AND REALITY CHECK',
    excerpt: 'We\'re all circumcised, In the midst of these jovial faces broken hearts lie...',
    fullPoem: `We're all circumcised
In the midst of these jovial faces broken hearts lie
Among these agile hands and feet rests unbearable bitter pie
Tell me how are we not circumcised?`,
    date: '2024'
  }
]

const sections = [
  { id: 'BROKEN AND BECOMING', icon: Heart, description: 'Before something becomes, it must break. The cracks let in light, the fractures tell the story.', color: 'from-rose-500/20 to-rose-600/5', iconColor: 'text-rose-500' },
  { id: 'LIGHT THROUGH THE STORM', icon: Sparkles, description: 'Even in shadowed corners, light finds a way to seep through. Hope always whispers.', color: 'from-amber-500/20 to-amber-600/5', iconColor: 'text-amber-500' },
  { id: 'INFINITE THOUGHTS', icon: Infinity, description: 'Thoughts that stretch beyond language, drifting like stars across the mind\'s horizon.', color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-500' },
  { id: 'SOCIETY AND REALITY CHECK', icon: TrendingUp, description: 'Staring at the world we live in — its masks, its wounds, its strange traditions.', color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-500' }
]

export default function PoetryPage() {
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const filteredPoems = activeSection 
    ? poems.filter(p => p.section === activeSection)
    : poems

  const poemsBySection = sections.map(section => ({
    ...section,
    poems: poems.filter(p => p.section === section.id)
  }))

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <div className="container-custom max-w-5xl px-4 sm:px-6 mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl mb-5">
            <PenTool size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
            Threads of Becoming
          </h1>
          <p className="text-text-muted mt-4 max-w-xl mx-auto text-lg">
            Poems on Life, Growth, and Struggle — by Joel Kaudzu
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm">13 Poems</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm">4 Sections</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm">2024 Collection</span>
          </div>
          
          {/* Buy Button */}
          <Link
            href="/poetry/buy"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg"
          >
            <Download size={18} />
            Buy Collection - MK 200
          </Link>
        </motion.div>

        {/* Section Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <button
            onClick={() => setActiveSection(null)}
            className={`p-4 rounded-xl text-center transition-all ${
              activeSection === null
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 hover:shadow-md'
            }`}
          >
            <BookOpen size={22} className="mx-auto mb-1" />
            <span className="font-medium">All Poems</span>
            <span className="text-xs block opacity-75">{poems.length} poems</span>
          </button>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                activeSection === section.id
                  ? `bg-gradient-to-r ${section.color.replace('/20', '')} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 hover:shadow-md'
              }`}
            >
              <section.icon size={22} className="mx-auto mb-1" />
              <span className="font-medium text-sm line-clamp-1">{section.id}</span>
              <span className="text-xs block opacity-75">{poemsBySection.find(s => s.id === section.id)?.poems.length || 0} poems</span>
            </button>
          ))}
        </div>

        {/* Active Section Description */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-5 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 text-center"
            >
              <p className="text-text-secondary text-sm italic">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Poems Grid by Section */}
        {!activeSection ? (
          <div className="space-y-12">
            {sections.map(section => {
              const sectionPoems = poems.filter(p => p.section === section.id)
              if (sectionPoems.length === 0) return null
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200 dark:border-gray-800">
                    <section.icon size={22} className={section.iconColor} />
                    <h2 className="text-xl font-semibold text-text-primary">{section.id}</h2>
                    <span className="text-xs text-text-muted">{sectionPoems.length} poems</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionPoems.map((poem, index) => (
                      <motion.button
                        key={poem.id}
                        onClick={() => setSelectedPoem(poem)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 hover:shadow-lg transition-all text-left"
                      >
                        <h3 className="font-bold text-text-primary group-hover:text-amber-500 transition-colors text-lg">
                          {poem.title}
                        </h3>
                        <p className="text-text-muted text-sm mt-2 line-clamp-2">
                          {poem.excerpt}
                        </p>
                        <div className="mt-3 text-amber-500 text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read poem <ChevronRight size={12} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoems.map((poem, index) => (
              <motion.button
                key={poem.id}
                onClick={() => setSelectedPoem(poem)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 hover:shadow-lg transition-all text-left"
              >
                <h3 className="font-bold text-text-primary group-hover:text-amber-500 transition-colors text-lg">
                  {poem.title}
                </h3>
                <p className="text-text-muted text-sm mt-2 line-clamp-2">
                  {poem.excerpt}
                </p>
                <div className="mt-3 text-amber-500 text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read poem <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* About the Author */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <PenTool size={18} className="text-amber-500" />
            <h2 className="text-lg font-semibold">About the Author</h2>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Joel Kaudzu is a premed dental surgery student at Kamuzu University of Health Sciences, 
            a poet, an innovator, and a lifelong learner. Through poetry, Joel channels his deepest 
            emotions, reflections, and observations about life, society, and the human condition. 
            This collection is a testament to the power of resilience, reflection, and faith.
          </p>
          <div className="mt-3 text-xs text-text-muted italic">
            "Poetry has shaped my communication ability, emotional intelligence, and perspective as both a creator and problem solver." — Joel George Kaudzu
          </div>
        </motion.div>

        {/* Scripture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-text-muted italic">
            Jeremiah 29:11 — "For I know the plans I have for you, declares the Lord, 
            plans to prosper you and not to harm you, plans to give you hope and a future."
          </p>
        </motion.div>
      </div>

      {/* Poem Modal */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPoem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPoem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
              >
                <X size={18} />
              </button>
              
              <div className="p-6">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-amber-500 uppercase tracking-wider">{selectedPoem.section}</span>
                  <h2 className="text-2xl font-bold text-text-primary mt-1">{selectedPoem.title}</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-text-secondary whitespace-pre-line font-serif leading-relaxed text-base">
                    {selectedPoem.fullPoem}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-right">
                  <span className="text-xs text-text-muted">— Joel Kaudzu, {selectedPoem.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}