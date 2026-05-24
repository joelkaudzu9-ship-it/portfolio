export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
      
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      
      {/* Featured image skeleton */}
      <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
      
      {/* Technologies skeleton */}
      <div className="mb-8">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      
      {/* Buttons skeleton */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <div className="h-11 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-11 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  )
}