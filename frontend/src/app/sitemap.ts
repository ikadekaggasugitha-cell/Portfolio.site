import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/marketing/api.server'

const base = process.env.FRONTEND_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/projects', '/contact'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  // Best-effort: include project detail pages (empty if the API is unreachable at build).
  const projects = await getProjects(50)
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.id}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
