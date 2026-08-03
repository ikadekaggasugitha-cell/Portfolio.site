'use client'

import { useTranslation } from './language-provider'

/**
 * Compact EN/ID toggle button. Matches the ThemeToggle's size and styling
 * so the two sit side-by-side in the navbar.
 *
 * Renders the current locale's label and swaps on click. The `aria-label`
 * updates to reflect the action.
 */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLocale } = useTranslation()

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      className={
        'grid size-10 place-items-center rounded-xl border border-mk-hairline bg-mk-surface ' +
        'font-mk-mono text-[0.7rem] font-bold tracking-[0.04em] text-mk-muted ' +
        'transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:text-mk-ink ' +
        className
      }
    >
      {locale === 'id' ? 'ID' : 'EN'}
    </button>
  )
}
