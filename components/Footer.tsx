import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-heading font-bold gradient-text-gold">
              Joel George Kaudzu
            </Link>
            <p className="text-text-secondary text-sm mt-4 leading-relaxed max-w-md">
              Building systems that improve lives, strengthen communities, and increase human capability across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-text-secondary hover:text-accent-gold transition-colors text-sm">About</Link></li>
              <li><Link href="/projects" className="text-text-secondary hover:text-accent-gold transition-colors text-sm">Projects</Link></li>
              <li><Link href="/journey" className="text-text-secondary hover:text-accent-gold transition-colors text-sm">Journey</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-accent-gold transition-colors text-sm">Contact</Link></li>
              <li><Link href="/admin" className="text-text-secondary hover:text-accent-gold transition-colors text-sm">Admin</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/joelkaudzu9-ship-it" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors">
                <Github size={18} className="text-text-secondary hover:text-accent-gold" />
              </a>
              <a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors">
                <Linkedin size={18} className="text-text-secondary hover:text-accent-gold" />
              </a>
              <a href="mailto:joelkaudzu9@gmail.com" className="p-2 rounded-lg bg-surface border border-border hover:border-accent-gold/30 transition-colors">
                <Mail size={18} className="text-text-secondary hover:text-accent-gold" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-text-muted text-sm">
          <p>© {currentYear} Joel George Kaudzu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}