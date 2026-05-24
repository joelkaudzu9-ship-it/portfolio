import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joelkaudzu-portfolio.vercel.app'
  
  // Static routes - only include pages that actually exist
  const staticRoutes = [
    { route: '', priority: 1.0 },
    { route: '/about', priority: 0.8 },
    { route: '/journey', priority: 0.8 },
    { route: '/education', priority: 0.8 },
    { route: '/projects', priority: 0.9 },
    { route: '/leadership', priority: 0.7 },
    { route: '/blog', priority: 0.9 },
    { route: '/testimonials', priority: 0.7 },
    { route: '/contact', priority: 0.7 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: priority,
  }))
  
  return staticRoutes
}