'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}