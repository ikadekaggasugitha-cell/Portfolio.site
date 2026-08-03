'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  translations,
  DEFAULT_LOCALE,
  type Locale,
  type Translations,
} from '@/lib/marketing/translations'

/**
 * Scoped language controller for the V2 marketing system.
 *
 * Same localStorage-persist pattern as ThemeProvider: reads stored preference
 * after mount, toggles between `'en'` and `'id'`, and exposes a `t` object
 * with every translated string for the active locale.
 *
 * Default locale: **id** (Indonesian).
 */

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  toggleLocale: () => void
  /** Typed translation bundle for the active locale. */
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = 'agga-locale'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Hydrate from localStorage after mount (server render always uses default).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored === 'en' || stored === 'id') setLocaleState(stored)
    } catch {
      /* SSR or storage error — keep default */
    }
  }, [])

  // Set `lang` attribute on <html> so screen readers pick up the language.
  useEffect(() => {
    document.documentElement.lang = locale === 'id' ? 'id' : 'en'
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'id' ? 'en' : 'id')
  }, [locale, setLocale])

  const t = translations[locale] as unknown as Translations

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Access the current locale and translations. Must be within a LanguageProvider. */
export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx)
    throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}
