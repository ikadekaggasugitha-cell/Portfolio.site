import type { ReactNode } from 'react'
import { MarketingShell } from '@/components/marketing/layout/marketing-shell'

/**
 * Shared layout for every V2 public route (/, /about, /projects, …).
 * MarketingShell (navbar + footer + theme + scroll-to-top) mounts ONCE here,
 * so the sticky header persists across navigations and only the page content
 * transitions. Routes still resolve at their normal URLs — `(site)` is a
 * route group and does not appear in the path.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>
}
