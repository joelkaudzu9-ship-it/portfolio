'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Heart, TrendingUp, Users, Globe, Calendar, User, Star } from 'lucide-react'

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
}

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
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
      // Fetch hero section
      const heroRes = await fetch('/api/dynamic/hero')
      const heroData = await heroRes.json()
      setHero(heroData[0] || null)

      // Fetch core values
      const valuesRes = await fetch('/api/dynamic/values')
      const valuesData = await valuesRes.json()
      setValues(valuesData)

      // Fetch featured quotes
      const quotesRes = await fetch('/api/dynamic/quotes')
      const quotesData = await quotesRes.json()
      setQuotes(quotesData.filter((q: PersonalQuote) => q.is_featured))

      // Fetch featured projects
      const projectsRes = await fetch('/api/projects?featured=true')
      const projectsData = await projectsRes.json()
      setFeaturedProjects(projectsData.filter((p: any) => p.featured).slice(0, 3))

      // Fetch latest blog posts
      const postsRes = await fetch('/api/blog')
      const postsData = await postsRes.json()
      setLatestPosts(postsData.filter((p: any) => p.published).slice(0, 3))

      // Fetch testimonials
      const testimonialsRes = await fetch('/api/dynamic/testimonials')
      const testimonialsData = await testimonialsRes.json()
      setTestimonials(testimonialsData)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching homepage data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Default values if no data in CMS
  const displayHero = hero || {
    title: 'Joel George Kaudzu',
    subtitle: 'Dental Surgery Student • Healthcare Systems Thinker • Digital Health Builder',
    description: 'Building scalable healthcare systems for Africa. Creator of MoyoWanga — multilingual chronic disease support for low-resource environments.',
    cta_text: 'Explore Work',
    cta_link: '/projects',
  }

  const valueIcons = [Target, Globe, Heart, TrendingUp, Users]
  const iconColors = ['text-amber-500', 'text-blue-500', 'text-red-500', 'text-green-500', 'text-purple-500']

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob top-20 -left-20 animate-pulse"></div>
          <div className="blob bottom-20 -right-20 animate-pulse delay-1000"></div>
          <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 animate-pulse delay-2000"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div>
            {/* Profile Image */}
            {displayHero.profile_image_url && (
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-xl">
                  <img src={displayHero.profile_image_url} alt={displayHero.title} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <span className="text-amber-500 text-sm font-medium tracking-wide">{displayHero.subtitle}</span>
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

            {/* Rotating Quote */}
            {quotes.length > 0 && (
              <div className="max-w-3xl mx-auto mb-12 p-8 glass-card">
                <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{quotes[currentQuote]?.quote}"
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={displayHero.cta_link} className="btn-primary inline-flex items-center gap-2 group">
                {displayHero.cta_text} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center">
            <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      {values.length > 0 && (
        <section className="section bg-gray-50/50 dark:bg-gray-950/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Core Principles</span>
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
                  <div
                    key={value.id}
                    className="glass-card-hover p-6"
                  >
                    <IconComponent size={40} className={iconColors[index % iconColors.length]} />
                    <h3 className="text-xl font-bold mb-2 mt-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement */}
      <section className="section">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent p-8 md:p-12 text-center border border-amber-500/20">
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
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section bg-gray-50/50 dark:bg-gray-950/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Featured Work</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Featured <span className="gradient-text-gold">Projects</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <div key={project.id}>
                  <Link href={`/projects/${project.slug}`}>
                    <div className="glass-card-hover overflow-hidden h-full">
                      {project.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/projects" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all">
                View All Projects <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="section">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Latest Insights</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                From My <span className="gradient-text-gold">Blog</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="glass-card-hover overflow-hidden h-full">
                      {post.featured_image && (
                        <div className="h-48 overflow-hidden">
                          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><User size={12} /> Joel Kaudzu</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
                        <div className="mt-3 text-amber-500 text-sm font-medium">Read more →</div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-amber-500 hover:gap-3 transition-all">
                Read All Posts <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-gray-50/50 dark:bg-gray-950/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Kind Words</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                What People <span className="gradient-text-gold">Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="glass-card p-6"
                >
                  <Star size={24} className="text-amber-500 mb-3" />
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.role && <p className="text-sm text-gray-500">{testimonial.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}