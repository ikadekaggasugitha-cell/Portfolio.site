import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { Profile } from '@/types'
import { serializeJsonLd } from '@/lib/json-ld'
import { getProfile, getSkills, soften } from '@/lib/marketing/api.server'
import { mapHero } from '@/lib/marketing/mappers'
import { site } from '@/lib/marketing/content'
import { Hero } from '@/components/marketing/sections/hero'
import {
  AboutLive,
  ProjectsLive,
  SkillsLive,
  TestimonialsLive,
  TrustStripLive,
  WhatIDoLive,
} from '@/components/marketing/sections/live-sections'
import {
  ProjectsSkeleton,
  SkillsSkeleton,
} from '@/components/marketing/sections/section-skeletons'

const FALLBACK_DESCRIPTION =
  'Turning Complex Workflows into Dependable Digital Solutions'

/**
 * Bounded regeneration window. Without an explicit segment value the route inherits its
 * revalidate from whichever tagged fetches happened to succeed, which makes the window
 * depend on backend health at build time. Admin saves purge this instantly through
 * /api/revalidate; this is just the floor.
 */
export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

import { localize } from '@/lib/marketing/localize'
import type { Locale } from '@/lib/marketing/translations'
import { buildAlternates, isLocale, ogLocales } from '@/lib/marketing/i18n'
import { notFound } from 'next/navigation'

type PageParams = Promise<{ locale: string }>

async function resolveLocale(params: PageParams): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  // softened: metadata is not worth failing the whole route over, and a throw here
  // bypasses error.tsx entirely.
  const { data: profile } = await soften(getProfile(), null)
  const name = profile?.name?.trim() || site.name
  const roleStr = localize(profile?.title, locale)
  const descStr = localize(profile?.description, locale)
  const role = roleStr.trim() || site.role
  const description = descStr.trim() || FALLBACK_DESCRIPTION
  const title = `${name} — ${role}`
  const og = ogLocales(locale)

  return {
    title,
    description,
    keywords: ['Full Stack Developer', 'Software Engineer', 'Backend Developer', 'Next.js', 'React', 'TypeScript', 'Node.js', name],
    alternates: buildAlternates(locale, '/'),
    openGraph: { type: 'website', title, description, siteName: name, ...og, url: `/${locale}` },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function PersonJsonLd({
  profile,
  skills,
  locale,
}: {
  profile: Profile | null
  skills: string[]
  locale: Locale
}) {
  const roleStr = localize(profile?.title, locale)
  const descStr = localize(profile?.description, locale)
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name?.trim() || site.name,
    jobTitle: roleStr.trim() || site.role,
    description: descStr.trim() || FALLBACK_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile?.location?.trim() || site.location,
      addressCountry: 'ID',
    },
    sameAs: [profile?.github, profile?.linkedin].filter((url): url is string => Boolean(url) && url !== '#'),
    knowsAbout: skills,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(json) }} />
}

export default async function HomePage({ params }: { params: PageParams }) {
  const locale = await resolveLocale(params)
  // getSkills() is also called by <SkillsLive>; Next memoizes identical fetches within a
  // request, so structured data stays consistent with the rendered section for free.
  const [{ data: profile }, { data: skills }] = await Promise.all([
    getProfile(),
    getSkills(),
  ])
  const knowsAbout = skills
    .map((skill) => skill.skill_name?.trim())
    .filter((name): name is string => Boolean(name))

  return (
    <>
      <PersonJsonLd profile={profile} skills={knowsAbout} locale={locale} />
      <Hero {...mapHero(profile)} />
      {/* Every section below is admin-editable and streams independently, so one slow
          resource never blocks the rest of the page. */}
      <Suspense fallback={null}>
        <TrustStripLive />
      </Suspense>
      <Suspense fallback={null}>
        <AboutLive profile={profile} />
      </Suspense>
      <Suspense fallback={null}>
        <WhatIDoLive />
      </Suspense>
      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsLive />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsLive />
      </Suspense>
      <Suspense fallback={null}>
        <TestimonialsLive />
      </Suspense>
    </>
  )
}
