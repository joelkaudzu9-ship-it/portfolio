'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'  // Add this import

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

  // Add Cloudinary optimization parameters if using Cloudinary
  const getOptimizedSrc = () => {
    if (error) return null
    if (src.includes('cloudinary.com')) {
      return src.replace('/upload/', '/upload/f_auto,q_auto,w_800/')
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
        <ImageIcon size={32} className="text-text-muted" />
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
        loading={priority ? 'eager' : 'lazy'}
        className={`
          duration-700 ease-in-out object-cover
          ${isLoading ? 'scale-110 blur-md' : 'scale-100 blur-0'}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  )
}