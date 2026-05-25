'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import BlogSearch from './BlogSearch'
import { 
  Sun, Moon, X, ChevronDown, 
  Home, User, Compass, Rocket, 
  PenLine, Mail, GraduationCap, 
  Diamond, Zap, Trophy, BookOpen, 
  Star, Menu
} from 'lucide-react'

// Main navigation items with professional icons
const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/journey', label: 'Journey', icon: Compass },
  { href: '/projects', label: 'Projects', icon: Rocket },
  { href: '/blog', label: 'Insights', icon: PenLine },
  { href: '/contact', label: 'Contact', icon: Mail },
]

// Dropdown items with professional icons
const dropdownItems = [
  { href: '/education', label: 'Education', icon: GraduationCap },
  { href: '/values', label: 'Values', icon: Diamond },
  { href: '/skills', label: 'Skills', icon: Zap },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/poetry', label: 'Poetry', icon: BookOpen },
  { href: '/testimonials', label: 'Testimonials', icon: Star },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    setDropdownOpen(false)
    router.push(href)
  }

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) setIsOpen(false)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-md' 
          : 'bg-white dark:bg-black'
      } border-b border-gray-200 dark:border-gray-800`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="group relative z-50" onClick={() => setDropdownOpen(false)}>
              <span className="text-lg md:text-xl font-heading font-bold gradient-text-gold">
                JGK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    pathname === item.href 
                      ? 'text-amber-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-[21px] left-0 w-full h-0.5 bg-amber-500 rounded-full"></span>
                  )}
                </Link>
              ))}

              {/* Dropdown Menu */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    dropdownItems.some(item => pathname === item.href)
                      ? 'text-amber-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  More
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Panel */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setDropdownOpen(false)
                          setIsOpen(false)
                        }}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          pathname === item.href
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={14} className="opacity-70" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors hover:border-amber-500/30"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <BlogSearch />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-out ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 delay-300'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
            <div>
              <span className="text-amber-500 font-bold text-xl">Menu</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Navigate your way</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-900 dark:text-white" />
            </button>
          </div>
          
          <div className="flex flex-col p-5 h-[calc(100%-80px)] overflow-y-auto">
            {/* Theme Toggle - Full width button at top */}
            <button
              onClick={() => toggleTheme()}
              className="flex items-center justify-between w-full px-4 py-3 mb-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl transition-all hover:scale-[1.02] border border-amber-500/20"
              style={{
                transitionDelay: `0ms`,
                transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Moon size={18} className="text-amber-500" /> : <Sun size={18} className="text-amber-500" />}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Toggle</span>
            </button>
            
            {/* Main Nav Items - 2 COLUMN GRID */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Main Navigation
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mainNavItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                          : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                      style={{
                        transitionDelay: `${(index + 1) * 50}ms`,
                        transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <Icon size={22} className={isActive ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Dropdown Items - 2 COLUMN GRID */}
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Extended Journey
              </p>
              <div className="grid grid-cols-2 gap-2">
                {dropdownItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                          : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                      style={{
                        transitionDelay: `${(mainNavItems.length + index + 1) * 50}ms`,
                        transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <Icon size={22} className={isActive ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 dark:border-gray-800 text-center bg-white dark:bg-gray-900"
            style={{
              transitionDelay: `${(mainNavItems.length + dropdownItems.length + 2) * 50}ms`,
              transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              © {new Date().getFullYear()} Joel George Kaudzu
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              Building systems that matter
            </p>
          </div>
        </div>
      </div>
    </>
  )
}