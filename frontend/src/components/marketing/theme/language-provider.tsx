'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { translations, type Locale, type Translations } from '@/lib/marketing/translations'
import { localize as localizeText } from '@/lib/marketing/localize'
import { LOCALE_COOKIE, swapLocale } from '@/lib/marketing/i18n'
import type { LocalizedText } from '@/types'
import { captureLocaleScrollAnchor, useLocaleScrollRestore } from './use-locale-scroll-restore'

/**
 * Locale controller for the V2 marketing system.
 *
 * The active locale is a *URL fact* — `/id/...` or `/en/...` — passed in as a
 * prop by the [locale] root layout. Switching language therefore means
 * navigating to the same route under the other prefix and remembering the
 * choice in a cookie the middleware reads on the next direct visit. Server
 * components re-render natively in the new language; no hydration flash.
 *
 * Navigation runs with `scroll: false` and, when the reader is inside a
 * `<section id>`, re-docks that section after commit (see
 * use-locale-scroll-restore) so toggling never yanks them back to the top.
 */

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  toggleLocale: () => void
  /** Typed translation bundle for the active locale. */
  t: Translations
  /** Resolve an API-sourced translatable field to a string in the active locale. */
  localize: (value: LocalizedText | null | undefined) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useLocaleScrollRestore(pathname)

  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`
      const target = swapLocale(pathname, next)
      captureLocaleScrollAnchor(target)
      router.push(target, { scroll: false })
    },
    [router, pathname],
  )

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'id' ? 'en' : 'id')
  }, [locale, setLocale])

  const value = useMemo<LanguageContextValue>(() => {
    const t = translations[locale] as unknown as Translations
    return {
      locale,
      setLocale,
      toggleLocale,
      t,
      localize: (value) => localizeText(value, locale),
    }
  }, [locale, setLocale, toggleLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/** Access the current locale and translations. Must be within a LanguageProvider. */
export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx)
    throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}
