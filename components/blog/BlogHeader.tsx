'use client'

interface BlogHeaderProps {
  sortOrder: 'newest' | 'oldest'
  onSortChange: (order: 'newest' | 'oldest') => void
}

export default function BlogHeader({ sortOrder, onSortChange }: BlogHeaderProps) {
  return (
    <div className="text-center mb-12">
      <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Insights</span>
      <h1 className="text-4xl sm:text-5xl font-bold mt-2">
        My <span className="gradient-text-gold">Blog</span>
      </h1>
      <p className="text-text-secondary max-w-2xl mx-auto mt-4">
        Thoughts on healthcare, technology, innovation, and African systems
      </p>
      
      <div className="flex justify-end mt-6">
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => onSortChange('newest')}
            className={`px-3 py-1 rounded-full transition-colors ${
              sortOrder === 'newest' 
                ? 'bg-amber-500 text-white' 
                : 'bg-surface border border-border hover:border-amber-500/30'
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => onSortChange('oldest')}
            className={`px-3 py-1 rounded-full transition-colors ${
              sortOrder === 'oldest' 
                ? 'bg-amber-500 text-white' 
                : 'bg-surface border border-border hover:border-amber-500/30'
            }`}
          >
            Oldest First
          </button>
        </div>
      </div>
    </div>
  )
}