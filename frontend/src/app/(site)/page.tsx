import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { Profile } from '@/types'
import { serializeJsonLd } from '@/lib/json-ld'
import { getProfile, getSkills, soften } from '@/lib/marketing/api.server'
import { liveOrFallback, mapContact, mapHero } from '@/lib/marketing/mappers'
import { site, skillGroups } from '@/lib/marketing/content'
import { Hero } from '@/components/marketing/sections/hero'
import { Contact } from '@/components/marketing/sections/contact'
import {
  AboutLive,
  ExperienceLive,
  ProjectsLive,
  SkillsLive,
  TestimonialsLive,
  TrustStripLive,
  WhatIDoLive,
} from '@/components/marketing/sections/live-sections'
import {
  ExperienceSkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
} from '@/components/marketing/sections/section-skeletons'

const FALLBACK_DESCRIPTION =
  'I Kadek Agga Sugitha is an Full Stack Developer building reliable software end to end — web applications, backend APIs, databases and automation — with TypeScript, React, Next.js, Node.js and cloud infrastructure.'

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

export async function generateMetadata(): Promise<Metadata> {
  // softened: metadata is not worth failing the whole route over, and a throw here
  // bypasses error.tsx entirely.
  const { data: profile } = await soften(getProfile(), null)
  const name = profile?.name?.trim() || site.name
  const role = profile?.title?.trim() || site.role
  const description = profile?.description?.trim() || FALLBACK_DESCRIPTION
  const title = `${name} — ${role}`

  return {
    title,
    description,
    keywords: ['Full Stack Developer', 'Software Engineer', 'Backend Developer', 'Next.js', 'React', 'TypeScript', 'Node.js', name],
    alternates: { canonical: '/' },
    openGraph: { type: 'website', title, description, siteName: name },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function PersonJsonLd({ profile, skills }: { profile: Profile | null; skills: string[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name?.trim() || site.name,
    jobTitle: profile?.title?.trim() || site.role,
    description: profile?.description?.trim() || FALLBACK_DESCRIPTION,
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

export default async function HomePage() {
  // getSkills() is also called by <SkillsLive>; Next memoizes identical fetches within a
  // request, so structured data stays consistent with the rendered section for free.
  const [{ data: profile }, { ok: skillsOk, data: skills }] = await Promise.all([
    getProfile(),
    getSkills(),
  ])
  const knowsAbout = liveOrFallback(
    skills.map((skill) => skill.skill_name?.trim()).filter((name): name is string => Boolean(name)),
    skillsOk,
    skillGroups.flatMap((group) => group.skills),
  )

  return (
    <>
      <PersonJsonLd profile={profile} skills={knowsAbout} />
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
      <Suspense fallback={<ExperienceSkeleton />}>
        <ExperienceLive />
      </Suspense>
      <Contact {...mapContact(profile)} />
    </>
  )
}
