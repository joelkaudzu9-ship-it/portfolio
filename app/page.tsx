'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PageLoader } from '@/components/PageLoader'
import Link from 'next/link'
import { 
  ArrowRight, Target, Heart, TrendingUp, Users, Globe, 
  Calendar, User, Star, Eye, Mail, Sparkles, Quote, 
  ChevronRight, Zap, Shield, Coffee 
} from 'lucide-react'

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
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
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

  // Scroll progress
  const { scrollYProgress } = useScroll()
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [quotes])

  const fetchAllData = async () => {
    try {
      const heroRes = await fetch('/api/dynamic/hero')
      const heroData = await heroRes.json()
      setHero(heroData[0] || null)

      const valuesRes = await fetch('/api/dynamic/values')
      const valuesData = await valuesRes.json()
      setValues(valuesData)

      const quotesRes = await fetch('/api/dynamic/quotes')
      const quotesData = await quotesRes.json()
      setQuotes(quotesData.filter((q: PersonalQuote) => q.is_featured))

      const projectsRes = await fetch('/api/projects?featured=true')
      const projectsData = await projectsRes.json()
      setFeaturedProjects(projectsData.filter((p: any) => p.featured).slice(0, 3))

      const postsRes = await fetch('/api/blog')
      const postsData = await postsRes.json()
      setLatestPosts(postsData.filter((p: any) => p.published).slice(0, 3))

      const testimonialsRes = await fetch('/api/dynamic/testimonials')
      const testimonialsData = await testimonialsRes.json()
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
        setSubscribeStatus({ type: 'success', message: '🎉 Thanks for subscribing! Check your inbox.' })
        setEmail('')
        setTimeout(() => setSubscribeStatus(null), 5000)
      } else {
        const error = await res.json()
        setSubscribeStatus({ type: 'error', message: error.error || 'Failed to subscribe' })
        setTimeout(() => setSubscribeStatus(null), 3000)
      }
    } catch (error) {
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
    subtitle: 'Dental Surgery Student • Healthcare Systems Thinker • Digital Health Builder',
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
    cta_text: 'Explore Work',
    cta_link: '/projects',
  }

  const valueIcons = [Target, Globe, Heart, TrendingUp, Users, Zap, Shield, Coffee]
  const iconColors = [
    'text-amber-500', 'text-blue-500', 'text-red-500', 'text-green-500', 
    'text-purple-500', 'text-pink-500', 'text-cyan-500', 'text-indigo-500'
  ]

  return (
    <div className="overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative min-h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob top-20 -left-20 animate-pulse"></div>
          <div className="blob bottom-20 -right-20 animate-pulse delay-1000"></div>
          <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 animate-pulse delay-2000"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div variants={fadeInUp}>
            {displayHero.profile_image_url && (
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-xl">
                    <img 
                      src={displayHero.profile_image_url} 
                      alt={displayHero.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-amber-500/5"><span class="text-5xl">👨‍⚕️</span></div>'
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 backdrop-blur-sm">
              <span className="text-amber-500 text-sm font-medium tracking-wide flex items-center gap-2">
                <Sparkles size={14} /> {displayHero.subtitle}
              </span>
            </div>
            
            <h1 className="mb-6">
              {displayHero.title.split(' ').map((word, i) => (
                i === displayHero.title.split(' ').length - 1 ? (
                  <span key={i} className="gradient-text-gold">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              ))}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              {displayHero.description}
            </p>

            {quotes.length > 0 && (
              <motion.div 
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto mb-12 p-8 glass-card relative"
              >
                <Quote size={32} className="text-amber-500/30 absolute top-4 left-4" />
                <Quote size={32} className="text-amber-500/30 absolute bottom-4 right-4 rotate-180" />
                <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                  "{quotes[currentQuote]?.quote}"
                </p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={displayHero.cta_link} className="btn-primary inline-flex items-center gap-2 group">
                {displayHero.cta_text} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-outline">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center">
            <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      {values.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section bg-gray-50/50 dark:bg-gray-950/30"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase flex items-center justify-center gap-2">
                <Target size={14} /> Core Principles
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Values That <span className="gradient-text-gold">Guide Me</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
                Principles that shape every project I build and every problem I solve.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const IconComponent = valueIcons[index % valueIcons.length]
                return (
                  <motion.div 
                    key={value.id} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card-hover p-6"
                  >
                    <IconComponent size={40} className={iconColors[index % iconColors.length]} />
                    <h3 className="text-xl font-bold mb-2 mt-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* Mission Statement */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section"
      >
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent p-8 md:p-12 text-center border border-amber-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent"></div>
            <div className="relative z-10">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Personal Mission</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6 gradient-text-gold">
                To build systems that improve lives, strengthen communities, and increase human capability across Africa.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Technology becomes meaningful when it solves real problems, respects human realities, and remains accessible to ordinary people.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section bg-gray-50/50 dark:bg-gray-950/30"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Featured Work</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Featured <span className="gradient-text-gold">Projects</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/projects/${project.slug}`} className="block h-full">
                    <div className="glass-card-hover overflow-hidden h-full">
                      {project.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666?text=Project+Image'
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">{tech}</span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/projects" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all group">
                View All Projects <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Latest Insights</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                From My <span className="gradient-text-gold">Blog</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="glass-card-hover overflow-hidden h-full">
                      {post.featured_image && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={post.featured_image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666?text=Blog+Image'
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} /> Joel Kaudzu
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {post.views || 0}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 text-amber-500 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all group">
                Read All Posts <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section bg-gray-50/50 dark:bg-gray-950/30"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Kind Words</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                What People <span className="gradient-text-gold">Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                      <span className="text-amber-500 font-semibold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      {testimonial.role && <p className="text-sm text-gray-500">{testimonial.role}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="section"
      >
        <div className="container-custom max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-8 md:p-10 text-center border border-amber-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 mb-4">
                <Mail size={24} className="text-amber-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Stay <span className="gradient-text-gold">Updated</span>
              </h2>
              <p className="text-text-muted mb-6">
                Get notified when I publish new articles, projects, and insights.
                <br />
                <span className="text-sm">No spam, unsubscribe anytime.</span>
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent-gold/50 focus:outline-none focus:ring-1 focus:ring-accent-gold/50 transition-all"
                  required
                />
                <button 
                  type="submit" 
                  disabled={subscribing}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {subscribeStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg ${
                    subscribeStatus.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-500'
                  }`}
                >
                  {subscribeStatus.message}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

// Loading Skeleton Component
function HomepageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container-custom py-20">
        <div className="animate-pulse space-y-8">
          {/* Profile image skeleton */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
          
          {/* Badge skeleton */}
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto"></div>
          
          {/* Title skeleton */}
          <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6 mx-auto"></div>
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}