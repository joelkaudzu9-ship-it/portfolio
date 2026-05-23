import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joelkaudzu.netlify.app'
  
  // Static routes
  const routes = [
    '',
    '/about',
    '/journey',
    '/education',
    '/projects',
    '/leadership',
    '/blog',
    '/poetry',
    '/systems',
    '/testimonials',
    '/contact'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
  
  // Fetch blog posts for dynamic routes
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const postsRes = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (postsRes.ok) {
      const posts = await postsRes.json()
      blogRoutes = posts
        .filter((post: any) => post.published)
        .map((post: any) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.created_at),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }
  
  // Fetch projects for dynamic routes
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const projectsRes = await fetch(`${baseUrl}/api/projects`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (projectsRes.ok) {
      const projects = await projectsRes.json()
      projectRoutes = projects.map((project: any) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at || project.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }
  
  return [...routes, ...blogRoutes, ...projectRoutes]
}