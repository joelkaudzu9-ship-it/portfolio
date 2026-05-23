import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
              "Every problem becomes temporary once you prove to yourself that you can build something real from nothing."
            </p>
            <p className="mt-2 text-teal-500 font-medium">— Joel George Kaudzu</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/journey" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">My Journey</Link></li>
              <li><Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Projects</Link></li>
              <li><Link href="/poetry" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Poetry</Link></li>
              <li><Link href="/systems" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Systems Thinking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors text-xl">
                <FaGithub />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors text-xl">
                <FaLinkedin />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors text-xl">
                <FaEnvelope />
              </a>
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">joel@example.com</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>© {currentYear} Joel George Kaudzu. Building systems that improve lives.</p>
        </div>
      </div>
    </footer>
  )
}