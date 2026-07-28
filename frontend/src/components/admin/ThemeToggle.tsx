'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/marketing/theme/theme-provider'

/** Light/dark toggle for the admin panel. Shares theme state (and the
 * `agga-theme` localStorage key) with the public site's theme toggle, so
 * the whole app stays in sync — but is styled with the admin's own
 * Stitch button classes since admin never uses the `.theme-v2` tokens. */
export default function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="btn-stitch grid size-9 place-items-center !p-0 transition-colors"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  )
}
