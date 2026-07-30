import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Which public routes each resource tag feeds.
 *
 * `revalidateTag` handles the data these routes fetch. The paths are belt-and-braces for
 * everything a tag can't reach on its own: a route whose data comes from a `generateStaticParams`
 * set that just changed (a new or deleted project), and the sitemap. Purging both keeps
 * invalidation correct without having to reason about which fetches a given render completed.
 *
 * The tag list doubles as the allow-list: it keeps the endpoint from being usable for
 * anything beyond "refresh this known public dataset".
 */
const PROFILE_PAGES = ['/', '/about', '/contact']

const TAG_TARGETS: Record<string, { paths: string[]; dynamicRoutes?: string[] }> = {
  // Purging a page also regenerates its layout, which is where the footer's profile
  // links come from — so enumerating pages is enough. Deliberately not
  // revalidatePath('/', 'layout'): that purges every route at once, and each one then
  // re-renders against a multi-second backend.
  profile: { paths: PROFILE_PAGES },
  skills: { paths: ['/', '/about'] },
  experiences: { paths: ['/', '/about'] },
  educations: { paths: ['/about'] },
  certificates: { paths: ['/about'] },
  projects: { paths: ['/', '/projects', '/sitemap.xml'], dynamicRoutes: ['/projects/[id]'] },
  // Marketing copy the admin owns. Stats and the About text share the homepage;
  // the FAQ lives on /contact.
  stats: { paths: ['/'] },
  capabilities: { paths: ['/'] },
  testimonials: { paths: ['/'] },
  faqs: { paths: ['/contact'] },
  // Media URLs are embedded in profile, project and page payloads, so a re-upload or
  // delete can change any of them.
  media: {
    paths: [...PROFILE_PAGES, '/projects'],
    dynamicRoutes: ['/projects/[id]', '/pages/[slug]'],
  },
  pages: { paths: [], dynamicRoutes: ['/pages/[slug]'] },
}

const VALID_TAGS = new Set(Object.keys(TAG_TARGETS))

/**
 * On-demand cache invalidation for the public site's server-fetched data. The admin
 * panel calls this right after a successful save so edits show up immediately instead
 * of waiting out the ISR window (see REVALIDATE in lib/marketing/api.server.ts).
 *
 * No auth check: this only busts caches for a fixed allow-list of public, read-only
 * resources — there's nothing sensitive to protect here.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const requested: string[] = Array.isArray(body?.tags)
    ? body.tags
    : typeof body?.tag === 'string'
      ? [body.tag]
      : []

  const tags = requested.filter((t) => VALID_TAGS.has(t))
  if (tags.length === 0) {
    return NextResponse.json({ success: false, message: 'No valid tag(s) provided' }, { status: 400 })
  }

  const paths = new Set<string>()
  const dynamicRoutes = new Set<string>()

  for (const tag of tags) {
    revalidateTag(tag)
    const target = TAG_TARGETS[tag]
    target.paths.forEach((p) => paths.add(p))
    target.dynamicRoutes?.forEach((r) => dynamicRoutes.add(r))
  }

  paths.forEach((p) => revalidatePath(p))
  // Per-id/per-slug pages are cached per rendered instance, so they take the
  // dynamic-route form: one call covers every instance of that route.
  dynamicRoutes.forEach((r) => revalidatePath(r, 'page'))

  return NextResponse.json({
    success: true,
    revalidated: tags,
    paths: [...paths, ...dynamicRoutes],
  })
}
