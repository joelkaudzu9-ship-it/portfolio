'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '',
  priority = false 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const getOptimizedSrc = () => {
    if (error) return null
    if (src.includes('cloudinary.com')) {
      // Back to q_40 for better quality without sacrificing speed
      return src.replace('/upload/', '/upload/f_auto,q_40,w_600/')
    }
    if (src.includes('youtube.com') || src.includes('ytimg.com')) {
      return src
    }
    return src
  }

  const optimizedSrc = getOptimizedSrc()

  if (!optimizedSrc || error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-amber-500/5 ${className}`}>
        <span className="text-text-muted text-2xl">📷</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        sizes={priority ? '100vw' : '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'}
        className={`
          duration-200 ease-in-out object-cover
          ${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  )
}