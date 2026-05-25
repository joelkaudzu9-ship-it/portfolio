'use client'

interface BlogHeaderProps {
  sortOrder: 'newest' | 'oldest'
  onSortChange: (order: 'newest' | 'oldest') => void
}

export default function BlogHeader({ sortOrder, onSortChange }: BlogHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-amber-500 text-sm font-semibold">Blog</span>
      </div>
      
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => onSortChange('newest')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            sortOrder === 'newest' 
              ? 'bg-amber-500 text-white' 
              : 'bg-surface border border-border hover:border-amber-500/30'
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => onSortChange('oldest')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            sortOrder === 'oldest' 
              ? 'bg-amber-500 text-white' 
              : 'bg-surface border border-border hover:border-amber-500/30'
          }`}
        >
          Oldest
        </button>
      </div>
    </div>
  )
}