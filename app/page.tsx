'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Target, Heart, TrendingUp, Users, Globe, 
  Calendar, User, Star, Eye, Mail, Sparkles, Quote, 
  ChevronRight, Zap, Shield, Coffee, Briefcase, BookOpen, Award
} from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import { cachedFetch } from '@/lib/api-cache'

type HeroData = {
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  profile_image_url?: string
}

type CoreValue = {
  id: number
  title: string
  description: string
  order_index: number
}

type PersonalQuote = {
  id: number
  quote: string
  is_featured: boolean
}

type FeaturedProject = {
  id: number
  title: string
  slug: string
  description: string
  image_url: string
  technologies: string[]
}

type LatestPost = {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  created_at: string
  views?: number
}

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  rating?: number
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

export default function Home() {
  const [hero, setHero] = useState<HeroData | null>(null)
  const [values, setValues] = useState<CoreValue[]>([])
  const [quotes, setQuotes] = useState<PersonalQuote[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([])
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentQuote, setCurrentQuote] = useState(0)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [subscribing, setSubscribing] = useState(false)

  const { scrollYProgress } = useScroll()
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [quotes])

  const fetchAllData = async () => {
    try {
      const [heroData, valuesData, quotesData, projectsData, postsData, testimonialsData] = await Promise.all([
        cachedFetch('hero', () => fetch('/api/dynamic/hero').then(res => res.json())),
        cachedFetch('values', () => fetch('/api/dynamic/values').then(res => res.json())),
        cachedFetch('quotes', () => fetch('/api/dynamic/quotes').then(res => res.json())),
        cachedFetch('projects', () => fetch('/api/projects?featured=true').then(res => res.json())),
        cachedFetch('posts', () => fetch('/api/blog').then(res => res.json())),
        cachedFetch('testimonials', () => fetch('/api/dynamic/testimonials').then(res => res.json()))
      ])
      
      setHero(heroData[0] || null)
      setValues(valuesData)
      setQuotes(quotesData.filter((q: PersonalQuote) => q.is_featured))
      setFeaturedProjects(projectsData.filter((p: any) => p.featured).slice(0, 3))
      setLatestPosts(postsData.filter((p: any) => p.published).slice(0, 3))
      setTestimonials(testimonialsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching homepage data:', error)
      setLoading(false)
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setSubscribeStatus({ type: 'error', message: 'Please enter your email address' })
      setTimeout(() => setSubscribeStatus(null), 3000)
      return
    }

    setSubscribing(true)
    setSubscribeStatus(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        setSubscribeStatus({ type: 'success', message: '🎉 Thanks for subscribing!' })
        setEmail('')
        setTimeout(() => setSubscribeStatus(null), 4000)
      } else {
        const error = await res.json()
        setSubscribeStatus({ type: 'error', message: error.error || 'Failed to subscribe' })
        setTimeout(() => setSubscribeStatus(null), 3000)
      }
    } catch {
      setSubscribeStatus({ type: 'error', message: 'Network error. Please try again.' })
      setTimeout(() => setSubscribeStatus(null), 3000)
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return <HomepageSkeleton />
  }

  const displayHero = hero || {
    title: 'Joel George Kaudzu',
    subtitle: 'Dental Surgery Student • Health-Tech Builder • Innovation Coordinator',
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
    cta_text: 'Explore Work',
    cta_link: '/projects',
  }

  const valueIcons = [Target, Heart, Globe, TrendingUp, Users, Zap]
  const iconColors = [
    'text-amber-500', 'text-red-500', 'text-blue-500', 
    'text-green-500', 'text-purple-500', 'text-cyan-500'
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Scroll Progress Bar - Fixed */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-12 sm:py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10 px-4 sm:px-6">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={fadeInUp}>
              {displayHero.profile_image_url && (
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 opacity-60 blur-xl"></div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/30">
                      <OptimizedImage 
                        src={displayHero.profile_image_url} 
                        alt={displayHero.title}
                        width={120}
                        height={120}
                        priority={true}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
                <span className="text-amber-500 text-xs sm:text-sm font-medium tracking-wide">
                  {displayHero.subtitle}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {displayHero.title.split(' ').map((word, i) => (
                  i === displayHero.title.split(' ').length - 1 ? (
                    <span key={i} className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      {word}{' '}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                ))}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {displayHero.description}
              </p>
            </motion.div>

            {quotes.length > 0 && (
              <motion.div 
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto my-6 sm:my-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <Quote size={20} className="text-amber-500/40 mb-2" />
                <p className="text-sm sm:text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{quotes[currentQuote]?.quote}"
                </p>
              </motion.div>
            )}

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={displayHero.cta_link} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 text-sm font-medium">
                {displayHero.cta_text} <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-amber-500/50 hover:text-amber-500 transition-colors text-sm font-medium">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - removed pointer-events: auto issue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-50">
          <div className="w-5 h-8 rounded-full border border-gray-400 flex justify-center">
            <div className="w-1 h-2 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Core Values - Compact spacing */}
      {values.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container-custom px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Values That <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Guide Me</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Principles that shape my work and decisions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {values.slice(0, 6).map((value, index) => {
                const IconComponent = valueIcons[index % valueIcons.length]
                return (
                  <div 
                    key={value.id} 
                    className="p-4 sm:p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all"
                  >
                    <IconComponent size={28} className={iconColors[index % iconColors.length]} />
                    <h3 className="text-base sm:text-lg font-bold mt-2 mb-1">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement - Compact */}
      <section className="py-12 sm:py-16">
        <div className="container-custom px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              My Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mt-3">
              To build systems that improve lives, strengthen communities, and increase human capability across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container-custom px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Featured <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Projects</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all">
                      {project.image_url && (
                        <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <OptimizedImage 
                            src={project.image_url} 
                            alt={project.title}
                            width={400}
                            height={200}
                            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base sm:text-lg font-bold mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/projects" className="inline-flex items-center gap-1 text-amber-500 hover:gap-2 transition-all text-sm font-medium">
                View All Projects <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="container-custom px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">
                From My <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Blog</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {latestPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-500/30 transition-all">
                      {post.featured_image && (
                        <div className="h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <OptimizedImage 
                            src={post.featured_image} 
                            alt={post.title}
                            width={400}
                            height={150}
                            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={10} /> {post.views || 0}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold mb-1 group-hover:text-amber-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 text-amber-500 text-xs font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight size={10} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center gap-1 text-amber-500 hover:gap-2 transition-all text-sm font-medium">
                Read All Posts <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container-custom px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">
                What People <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div key={testimonial.id} className="p-4 sm:p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed line-clamp-3">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                      <span className="text-amber-500 font-semibold text-xs">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      {testimonial.role && <p className="text-gray-500 text-xs">{testimonial.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter - Compact */}
      <section className="py-12 sm:py-16">
        <div className="container-custom px-4 sm:px-6 max-w-md mx-auto">
          <div className="text-center p-5 sm:p-6 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
            <Mail size={24} className="text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold mb-2">Stay Updated</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get notified about new articles and projects
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-amber-500/50 focus:outline-none"
                required
              />
              <button 
                type="submit" 
                disabled={subscribing}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeStatus && (
              <p className={`text-xs mt-3 ${subscribeStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {subscribeStatus.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// Loading Skeleton
function HomepageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container-custom px-4 py-16 sm:py-20">
        <div className="animate-pulse space-y-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto"></div>
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto"></div>
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="space-y-2 max-w-md mx-auto">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto"></div>
          </div>
          <div className="flex justify-center gap-3">
            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}