import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { Profile } from '@/types'
import { serializeJsonLd } from '@/lib/json-ld'
import { getProfile, getSkills, soften } from '@/lib/marketing/api.server'
import { mapAboutHero } from '@/lib/marketing/mappers'
import { site } from '@/lib/marketing/content'
import { AboutHero } from '@/components/marketing/sections/about-hero'
import {
  AboutCertificatesLive,
  AboutEducationLive,
  AboutExperienceLive,
  AboutSkillsLive,
} from '@/components/marketing/sections/about-live-sections'
import {
  ExperienceSkeleton,
  SkillsSkeleton,
} from '@/components/marketing/sections/section-skeletons'

const FALLBACK_BIO =
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
  const descStr = localize(profile?.description, locale)
  const description = descStr.trim() || FALLBACK_BIO
  const title = `About · ${name}`
  const og = ogLocales(locale)

  return {
    title,
    description,
    alternates: buildAlternates(locale, '/about'),
    openGraph: { type: 'profile', title, description, siteName: name, ...og, url: '/about' },
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
  const titleStr = localize(profile?.title, locale)
  const descStr = localize(profile?.description, locale)
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name?.trim() || site.name,
    jobTitle: titleStr.trim() || site.role,
    description: descStr.trim() || FALLBACK_BIO,
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

export default async function AboutPage({ params }: { params: PageParams }) {
  const locale = await resolveLocale(params)
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
      <AboutHero {...mapAboutHero(profile)} />
      <Suspense fallback={<SkillsSkeleton />}>
        <AboutSkillsLive />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <AboutExperienceLive />
      </Suspense>
      <Suspense fallback={null}>
        <AboutEducationLive />
      </Suspense>
      <Suspense fallback={null}>
        <AboutCertificatesLive />
      </Suspense>
    </>
  )
}
