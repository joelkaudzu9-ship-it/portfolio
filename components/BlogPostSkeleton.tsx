export function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
      </div>
    </div>
  )
}