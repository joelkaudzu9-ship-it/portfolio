import Link from 'next/link'
import { ArrowLeft, Smartphone, Activity } from 'lucide-react'

export default function CheckMySmilePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <Link href="/projects" className="inline-flex items-center gap-2 text-earth-600 dark:text-earth-400 hover:text-primary-500 mb-8">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
        
        <div className="text-center">
          <Smartphone size={48} className="text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">CheckMySmile</h1>
          <p className="text-xl text-earth-600 dark:text-earth-400">Mobile Dental Health Application</p>
          <div className="mt-8 p-6 bg-earth-50 dark:bg-earth-900/50 rounded-2xl">
            <p className="text-earth-700 dark:text-earth-300">More details coming soon. This project explores preventive oral healthcare through accessible mobile technologies.</p>
          </div>
        </div>
      </div>
    </div>
  )
}