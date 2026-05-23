'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/journey', label: 'Journey' },
  { href: '/education', label: 'Education' },
  { href: '/projects', label: 'Projects' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  // Close menu on browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) setIsOpen(false)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen])

  // Prevent body scroll when menu is open
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
      {/* Top Navigation Bar - Solid Background */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-black shadow-md' 
          : 'bg-white dark:bg-black'
      } border-b border-gray-200 dark:border-gray-800`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="group relative z-50">
              <span className="text-lg md:text-xl font-heading font-bold gradient-text-gold">
                JGK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
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
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors hover:border-amber-500/30"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            {/* Mobile Menu Button - Animated Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              aria-label="Toggle menu"
            >
              <div className="relative w-4 h-4">
                {/* Top line */}
                <span
                  className={`absolute left-0 w-4 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ease-out ${
                    isOpen ? 'rotate-45 top-1.5' : 'top-0'
                  }`}
                />
                {/* Middle line */}
                <span
                  className={`absolute left-0 w-4 h-0.5 bg-gray-900 dark:bg-white transition-all duration-200 ease-out ${
                    isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 top-1.5'
                  }`}
                />
                {/* Bottom line */}
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

      {/* Mobile Menu Overlay - Slide from right */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-out ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 delay-300'
        }`}
      >
        {/* Backdrop - Solid dark */}
        <div
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel - Solid dark background */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <span className="text-amber-500 font-bold text-lg">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex flex-col p-4 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform ${
                  pathname === item.href 
                    ? 'bg-amber-500/20 text-amber-500' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <span className="text-base font-medium">
                  {item.label}
                </span>
              </button>
            ))}
            
            {/* Theme Toggle in Mobile Menu */}
            <button
              onClick={() => {
                toggleTheme()
                setIsOpen(false)
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              style={{
                transitionDelay: `${navItems.length * 50}ms`,
                transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="text-base font-medium">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>
          
          {/* Footer in Mobile Menu */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 text-center"
            style={{
              transitionDelay: `${(navItems.length + 1) * 50}ms`,
              transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Joel George Kaudzu
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Building systems that matter
            </p>
          </div>
        </div>
      </div>
    </>
  )
}