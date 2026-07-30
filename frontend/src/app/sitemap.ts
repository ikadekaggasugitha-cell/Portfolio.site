import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/marketing/api.server'

const base = process.env.FRONTEND_URL ?? 'http://localhost:3000'

/** Keep the sitemap in step with projects added from the admin panel. */
export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/projects', '/contact'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  // Best-effort: include project detail pages (empty if the API is unreachable at build).
  const { data: projects } = await getProjects(50)
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.id}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
