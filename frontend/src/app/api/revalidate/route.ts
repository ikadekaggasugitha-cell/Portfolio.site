import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

/** Only these resource tags may be revalidated — keeps the endpoint from
 * being usable for anything beyond "refresh this known public dataset". */
const VALID_TAGS = new Set([
  'profile',
  'skills',
  'experiences',
  'projects',
  'educations',
  'certificates',
])

/**
 * On-demand cache invalidation for the marketing landing's server-fetched
 * data. The admin panel calls this right after a successful save so edits
 * show up on the public site immediately instead of waiting out the ISR
 * window (up to 1h — see REVALIDATE in lib/marketing/api.server.ts).
 *
 * No auth check: this only busts a cache tag for a fixed allow-list of
 * public, read-only resources — there's nothing sensitive to protect here.
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

  for (const tag of tags) {
    revalidateTag(tag)
  }

  return NextResponse.json({ success: true, revalidated: tags })
}
