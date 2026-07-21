import { Inter, JetBrains_Mono } from 'next/font/google'

/**
 * Fonts for the V2 marketing design system.
 *
 * `next/font/google` self-hosts these at build time — the browser never
 * touches a Google CDN, so there is no external request, no layout shift,
 * and no privacy leak. The CSS variables are consumed by the `mk-*` Tailwind
 * font utilities defined in globals.css (`--font-mk-sans`, `--font-mk-mono`).
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

/** Convenience: attach both font variables to the marketing wrapper. */
export const fontVariables = `${inter.variable} ${jetbrainsMono.variable}`
