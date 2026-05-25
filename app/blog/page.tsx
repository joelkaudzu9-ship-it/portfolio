'use client'


import { Suspense } from 'react'
import { BlogGridSkeleton } from '@/components/skeletons/BlogGridSkeleton'
import BlogContent from './BlogContent'

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <Suspense fallback={<BlogGridSkeleton />}>
          <BlogContent />
        </Suspense>
      </div>
    </div>
  )
}