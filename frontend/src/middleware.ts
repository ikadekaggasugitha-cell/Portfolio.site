import { NextResponse, type NextRequest } from 'next/server'
import { isLocale, LOCALE_COOKIE } from '@/lib/marketing/i18n'
import { DEFAULT_LOCALE } from '@/lib/marketing/translations'

/**
 * Locale gateway for the public site.
 *
 * Every public route lives under /id or /en. Requests without a locale prefix
 * are permanently redirected (308) to the preferred locale, resolved as:
 * stored cookie (last explicit choice via the toggle) → Accept-Language →
 * the site default. Admin, API, Next internals and static files are untouched.
 */

function detectFromHeader(header: string | null): 'id' | 'en' {
  if (!header) return DEFAULT_LOCALE
  for (const part of header.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase()
    // Indonesian ("id", "id-ID") wins over bare "en" only when listed first;
    // otherwise English prefixes match more loosely across browsers.
    if (tag === 'id' || tag.startsWith('id-')) return 'id'
    if (tag === 'en' || tag.startsWith('en-')) return 'en'
  }
  return DEFAULT_LOCALE
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1]

  // Already prefixed — nothing to do.
  if (isLocale(first)) return NextResponse.next()

  const cookie = req.cookies.get(LOCALE_COOKIE)?.value
  const target = isLocale(cookie) ? cookie : detectFromHeader(req.headers.get('accept-language'))

  const url = req.nextUrl.clone()
  url.pathname = `/${target}${pathname === '/' ? '' : pathname}`
  const res = NextResponse.redirect(url, 308)
  // Remember the choice so the next direct hit on "/" skips detection.
  res.cookies.set(LOCALE_COOKIE, target, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return res
}

export const config = {
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\..*).*)'],
}
