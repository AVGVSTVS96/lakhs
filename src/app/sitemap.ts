import { MetadataRoute } from 'next'
import { conversionPages } from '@/lib/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lakhs.vercel.app'
  
  const landingPages = Object.keys(conversionPages).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    priority: 0.8,
  }))

  const routes = [
    {
      url: baseUrl,
      priority: 1,
    },
    ...landingPages,
  ]

  return routes.map((route) => ({
    ...route,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }))
}
