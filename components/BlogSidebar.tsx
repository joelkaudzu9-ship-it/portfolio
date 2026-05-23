import Newsletter from './Newsletter'
import Link from 'next/link'

export default function BlogSidebar() {
  return (
    <div className="space-y-6">
      <Newsletter />
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-3">Recent Posts</h3>
        {/* You can fetch recent posts here */}
        <Link href="/blog" className="text-amber-500 text-sm hover:underline">
          View all posts →
        </Link>
      </div>
    </div>
  )
}