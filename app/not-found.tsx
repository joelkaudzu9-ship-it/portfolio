import Link from 'next/link'
//www
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container-custom text-center">
        <h1 className="text-6xl font-bold gradient-text-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Return Home
        </Link>
      </div>
    </div>
  )
}