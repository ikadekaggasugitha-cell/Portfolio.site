'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/**
 * Scoped theme controller for the V2 marketing system.
 *
 * Writes `data-theme="light|dark"` to <html> (or removes it for "system"),
 * which only the `.theme-v2`-scoped tokens in globals.css react to — every
 * other route is unaffected. Persists the choice in localStorage.
 */

export type ThemePref = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemePref
  resolved: ResolvedTheme
  setTheme: (t: ThemePref) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'agga-theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>('system')
  const [resolved, setResolved] = useState<ResolvedTheme>('light')

  // Hydrate from storage after mount (server render is always "system").
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') setThemeState(stored)
    } catch {
      /* ignore */
    }
  }, [])

  // Reflect the preference onto <html> and keep `resolved` in sync.
  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const next = theme === 'system' ? getSystemTheme() : theme
      setResolved(next)
      if (theme === 'system') root.removeAttribute('data-theme')
      else root.setAttribute('data-theme', theme)
    }
    apply()

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])

  const setTheme = useCallback((next: ThemePref) => {
    setThemeState(next)
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}

/**
 * Inline, render-blocking script that applies the stored theme before paint
 * to avoid a flash. Rendered high in the marketing tree (server component).
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
