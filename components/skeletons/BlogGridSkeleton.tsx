export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}