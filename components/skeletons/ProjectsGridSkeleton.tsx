export function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="glass-card overflow-hidden animate-pulse">
          <div className="h-56 bg-gray-200 dark:bg-gray-800" />
          <div className="p-6 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}