import type { Metadata } from 'next'
import { DEFAULT_LOCALE, type Locale } from './translations'

export type { Locale }

/**
 * URL-locale plumbing for the public site.
 *
 * Every public route lives under `/[locale]` (`/id/...` or `/en/...`), so the
 * server always knows the active language — no hydration flash, and metadata,
 * JSON-LD and hreflang can all be rendered per locale. The locale itself is
 * validated by middleware + the [locale] layout; these helpers assume a valid one.
 */

export const LOCALES = ['id', 'en'] as const

export const LOCALE_COOKIE = 'agga-locale'

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'id' || value === 'en'
}

/** Prefix an app-relative path with the locale segment: ('en', '/projects') → '/en/projects'. */
export function localeHref(locale: Locale, path: string): string {
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

/** Strip the locale segment: '/en/projects/12' → '/projects/12'. */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(id|en)(?=\/|$)/, '') || '/'
}

/** Swap the locale segment in place: ('en', '/id/projects/12') → '/en/projects/12'. */
export function swapLocale(pathname: string, next: Locale): string {
  return `/${next}${stripLocale(pathname)}`
}

const OG_LOCALE: Record<Locale, string> = {
  id: 'id_ID',
  en: 'en_US',
}

/**
 * Canonical + per-locale alternates (hreflang) for a route. `x-default` points
 * at the default locale so search engines have an unambiguous entry point.
 */
export function buildAlternates(locale: Locale, path: string): NonNullable<Metadata['alternates']> {
  return {
    canonical: localeHref(locale, path),
    languages: {
      'id-ID': localeHref('id', path),
      'en-US': localeHref('en', path),
      'x-default': localeHref(DEFAULT_LOCALE, path),
    },
  }
}

/** OpenGraph locale tags for a page rendered in `locale`. */
export function ogLocales(locale: Locale): { locale: string; alternateLocale: string } {
  return {
    locale: OG_LOCALE[locale],
    alternateLocale: OG_LOCALE[locale === 'id' ? 'en' : 'id'],
  }
}
