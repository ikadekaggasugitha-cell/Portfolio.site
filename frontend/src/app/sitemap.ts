import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/marketing/api.server'
import { localeHref, type Locale } from '@/lib/marketing/i18n'

const base = process.env.FRONTEND_URL ?? 'http://localhost:3000'
const LOCALES: Locale[] = ['id', 'en']

/** Keep the sitemap in step with projects added from the admin panel. */
export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

/**
 * One entry per locale per route, cross-linked through hreflang alternates so
 * search engines index both languages and understand they are equivalents.
 * URLs are locale-prefixed (e.g. /id/projects) — the same shape the pages
 * declare in their own metadata.
 */
function entry(locale: Locale, path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}): MetadataRoute.Sitemap[number] {
  return {
    url: `${base}${localeHref(locale, path)}`,
    changeFrequency: 'monthly',
    alternates: {
      languages: {
        'id-ID': `${base}${localeHref('id', path)}`,
        'en-US': `${base}${localeHref('en', path)}`,
      },
    },
    ...extra,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/about', '/projects', '/contact']
  const staticRoutes = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => entry(locale, path, { priority: path === '/' ? 1 : 0.8 })),
  )

  // Best-effort: include project detail pages (empty if the API is unreachable at build).
  const { data: projects } = await getProjects(50)
  const projectRoutes = LOCALES.flatMap((locale) =>
    projects.map((project) =>
      entry(locale, `/projects/${project.id}`, {
        lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
        priority: 0.6,
      }),
    ),
  )

  return [...staticRoutes, ...projectRoutes]
}
