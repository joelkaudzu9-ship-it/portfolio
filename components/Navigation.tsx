'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import BlogSearch from './BlogSearch'
import { Sun, Moon, X, ChevronDown } from 'lucide-react'

// Main navigation items
const mainNavItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/about', label: 'About', icon: '👤' },
  { href: '/journey', label: 'Journey', icon: '🛤️' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/blog', label: 'Insights', icon: '📝' },
  { href: '/contact', label: 'Contact', icon: '📧' },
]

// Dropdown items
const dropdownItems = [
  { href: '/education', label: 'Education', icon: '🎓' },
  { href: '/values', label: 'Values', icon: '💎' },
  { href: '/skills', label: 'Skills', icon: '⚡' },
  { href: '/achievements', label: 'Achievements', icon: '🏆' },
  { href: '/poetry', label: 'Poetry', icon: '📖' },
  { href: '/testimonials', label: 'Testimonials', icon: '⭐' },
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
          ? 'bg-white dark:bg-black shadow-md' 
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
                        {item.label}
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
              <div className="relative w-4 h-4">
                <span
                  className={`absolute left-0 w-4 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-out ${
                    isOpen ? 'rotate-45 top-1.5' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 w-4 h-0.5 bg-gray-900 dark:bg-white transition-all duration-200 ease-out ${
                    isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 top-1.5'
                  }`}
                />
                <span
                  className={`absolute left-0 w-4 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-out ${
                    isOpen ? '-rotate-45 top-1.5' : 'top-3'
                  }`}
                />
              </div>
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
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-lg">Menu</span>
              <span className="text-xs text-gray-500">v1.0</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          <div className="flex flex-col p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Theme Toggle - At Top */}
            <button
              onClick={() => {
                toggleTheme()
                setIsOpen(false)
              }}
              className="flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-500 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                transitionDelay: `0ms`,
                transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="text-sm font-medium">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
            
            {/* Main Nav Items - 2 COLUMN GRID */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 px-1">Main</p>
              <div className="grid grid-cols-2 gap-2">
                {mainNavItems.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      pathname === item.href 
                        ? 'bg-amber-500/20 text-amber-500' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    style={{
                      transitionDelay: `${(index + 1) * 50}ms`,
                      transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Dropdown Items - 2 COLUMN GRID */}
            <div>
              <p className="text-xs text-gray-500 mb-2 px-1">More</p>
              <div className="grid grid-cols-2 gap-2">
                {dropdownItems.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      pathname === item.href 
                        ? 'bg-amber-500/20 text-amber-500' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    style={{
                      transitionDelay: `${(mainNavItems.length + index + 1) * 50}ms`,
                      transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 text-center bg-gray-900"
            style={{
              transitionDelay: `${(mainNavItems.length + dropdownItems.length + 2) * 50}ms`,
              transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Joel George Kaudzu
            </p>
            <p className="text-gray-600 text-xs mt-0.5">
              Building systems that matter
            </p>
          </div>
        </div>
      </div>
    </>
  )
}