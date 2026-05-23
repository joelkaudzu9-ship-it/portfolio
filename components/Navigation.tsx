'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { Menu, X, Sun, Moon } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/journey', label: 'Journey' },
  { href: '/education', label: 'Education' },
  { href: '/projects', label: 'Projects' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false)
  }

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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="group relative z-50">
              <span className="text-xl md:text-2xl font-heading font-bold gradient-text-gold">
                JGK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href 
                      ? 'text-accent-gold' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-gold rounded-full"></span>
                  )}
                </Link>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-surface border border-border transition-colors hover:border-accent-gold/30"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>

            {/* Mobile Menu Button - Animated Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-border"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                {/* Top line */}
                <span
                  className={`absolute left-0 top-0 w-5 h-0.5 bg-text-primary transition-all duration-300 ease-out ${
                    isOpen ? 'rotate-45 top-2' : ''
                  }`}
                />
                {/* Middle line */}
                <span
                  className={`absolute left-0 top-2 w-5 h-0.5 bg-text-primary transition-all duration-200 ease-out ${
                    isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                />
                {/* Bottom line */}
                <span
                  className={`absolute left-0 top-4 w-5 h-0.5 bg-text-primary transition-all duration-300 ease-out ${
                    isOpen ? '-rotate-45 top-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Slide from right */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-out ${
          isOpen 
            ? 'visible opacity-100' 
            : 'invisible opacity-0 delay-300'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel - Slide from right */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-background/98 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-surface border border-border"
              aria-label="Close menu"
            >
              <X size={24} className="text-text-primary" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex flex-col px-8 py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`group relative py-4 text-lg font-medium transition-all duration-300 transform ${
                  pathname === item.href 
                    ? 'text-accent-gold' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <span className="relative inline-block">
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-gold rounded-full"></span>
                  )}
                </span>
              </Link>
            ))}
            
            {/* Theme Toggle in Mobile Menu */}
            <button
              onClick={() => {
                toggleTheme()
                handleLinkClick()
              }}
              className="flex items-center gap-3 py-4 text-text-secondary hover:text-text-primary transition-colors"
              style={{
                transitionDelay: `${navItems.length * 50}ms`,
                transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-lg font-medium">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>
          
          {/* Footer in Mobile Menu */}
          <div 
            className="absolute bottom-8 left-8 right-8 text-center"
            style={{
              transitionDelay: `${(navItems.length + 1) * 50}ms`,
              transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Joel George Kaudzu
            </p>
            <p className="text-text-muted text-xs mt-1">
              Building systems that matter
            </p>
          </div>
        </div>
      </div>
    </>
  )
}