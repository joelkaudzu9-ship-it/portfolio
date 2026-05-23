import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quote Section */}
          <div className="md:col-span-2">
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
              "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
            </p>
            <p className="mt-2 text-teal-500 font-medium">— Joel George Kaudzu</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/journey" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">My Journey</Link></li>
              <li><Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Projects</Link></li>
              <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Blog</Link></li>
              <li><Link href="/poetry" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Poetry</Link></li>
              <li><Link href="/systems" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Systems Thinking</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Connect & Admin */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4 text-2xl mb-6">
              <a href="https://github.com/joelkaudzu9-ship-it" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors" aria-label="GitHub">
                📂
              </a>
              <a href="https://www.linkedin.com/in/joel-kaudzu-0bba48392" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors" aria-label="LinkedIn">
                🔗
              </a>
              <a href="https://x.com/joelkaudzu" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors" aria-label="Twitter/X">
                🐦
              </a>
              <a href="mailto:joelkaudzu9@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors" aria-label="Email">
                ✉️
              </a>
            </div>
            
            {/* Admin Login Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-teal-500/10 hover:bg-teal-500/20 text-teal-500 rounded-lg transition-colors border border-teal-500/30"
            >
              🔐 Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>© {currentYear} Joel George Kaudzu. Building systems that improve lives.</p>
        </div>
      </div>
    </footer>
  )
}