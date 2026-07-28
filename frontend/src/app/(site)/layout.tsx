import type { ReactNode } from 'react'
import { MarketingShell } from '@/components/marketing/layout/marketing-shell'
import { getProfile } from '@/lib/marketing/api.server'
import { mapHero } from '@/lib/marketing/mappers'

/**
 * Shared layout for every V2 public route (/, /about, /projects, …).
 * MarketingShell (navbar + footer + theme + scroll-to-top) mounts ONCE here,
 * so the sticky header persists across navigations and only the page content
 * transitions. Routes still resolve at their normal URLs — `(site)` is a
 * route group and does not appear in the path.
 *
 * Fetches the profile here (in addition to page.tsx / about's own fetch) so
 * the footer's social/CV links reflect live admin data too — Next.js
 * memoizes identical fetch() calls within a single request, so this doesn't
 * add an extra network round trip.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile()
  const { githubUrl, linkedinUrl, email, cvUrl } = mapHero(profile)

  return (
    <MarketingShell footerLinks={{ githubUrl, linkedinUrl, email, cvUrl }}>
      {children}
    </MarketingShell>
  )
}
