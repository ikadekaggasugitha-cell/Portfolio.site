import type { ReactNode } from 'react'
import { fontVariables } from '@/lib/marketing/fonts'
import { ThemeProvider, ThemeScript } from '../theme/theme-provider'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { ScrollToTop } from './scroll-to-top'
import { PageTransition } from './page-transition'

/**
 * Self-contained wrapper for the V2 marketing surface.
 *
 * The `.theme-v2` class is the isolation boundary: every scoped token in
 * globals.css lives under it, so this tree gets the new light/dark system
 * while the admin area keeps its own. Rendered once by the app/(site) layout,
 * so the navbar/footer persist across navigations and only content transitions.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div
      id="top"
      className={`${fontVariables} theme-v2 flex min-h-screen flex-col bg-mk-canvas font-mk-sans text-mk-ink antialiased`}
    >
      <ThemeScript />
      <ThemeProvider>
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </div>
  )
}
