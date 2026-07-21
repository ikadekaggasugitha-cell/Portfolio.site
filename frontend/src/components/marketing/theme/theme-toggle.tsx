'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

/**
 * Sun/Moon toggle. Both icons render; CSS (scoped to `.theme-v2`) shows the
 * correct one based on `data-theme`, so there is no hydration flash.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={
        'grid size-10 place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted ' +
        'transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:text-mk-ink ' +
        className
      }
    >
      <Sun className="mk-sun size-[18px]" aria-hidden />
      <Moon className="mk-moon size-[18px]" aria-hidden />
    </button>
  )
}
