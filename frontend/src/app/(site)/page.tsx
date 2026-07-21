import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { Profile } from '@/types'
import { getProfile } from '@/lib/marketing/api.server'
import { mapAbout, mapContact, mapHero } from '@/lib/marketing/mappers'
import { site, skillGroups } from '@/lib/marketing/content'
import { Hero } from '@/components/marketing/sections/hero'
import { TrustStrip } from '@/components/marketing/sections/trust-strip'
import { About } from '@/components/marketing/sections/about'
import { WhatIDo } from '@/components/marketing/sections/what-i-do'
import { Testimonials } from '@/components/marketing/sections/testimonials'
import { Contact } from '@/components/marketing/sections/contact'
import { ExperienceLive, ProjectsLive, SkillsLive } from '@/components/marketing/sections/live-sections'
import {
  ExperienceSkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
} from '@/components/marketing/sections/section-skeletons'

const FALLBACK_DESCRIPTION =
  'I Kadek Agga Sugitha is an IT programmer building reliable software end to end — web applications, backend APIs, databases and automation — with TypeScript, React, Next.js, Node.js and cloud infrastructure.'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const name = profile?.name?.trim() || site.name
  const role = profile?.title?.trim() || site.role
  const description = profile?.description?.trim() || FALLBACK_DESCRIPTION
  const title = `${name} — ${role}`

  return {
    title,
    description,
    keywords: ['IT Programmer', 'Software Engineer', 'Backend Developer', 'Next.js', 'React', 'TypeScript', 'Node.js', name],
    alternates: { canonical: '/' },
    openGraph: { type: 'website', title, description, siteName: name },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function PersonJsonLd({ profile }: { profile: Profile | null }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name?.trim() || site.name,
    jobTitle: profile?.title?.trim() || site.role,
    description: profile?.description?.trim() || FALLBACK_DESCRIPTION,
    address: { '@type': 'PostalAddress', addressLocality: 'Bali', addressCountry: 'ID' },
    sameAs: [profile?.github, profile?.linkedin].filter((url): url is string => Boolean(url) && url !== '#'),
    knowsAbout: skillGroups.flatMap((group) => group.skills),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default async function HomePage() {
  const profile = await getProfile()

  return (
    <>
      <PersonJsonLd profile={profile} />
      <Hero {...mapHero(profile)} />
      <TrustStrip />
      <About {...mapAbout(profile)} />
      <WhatIDo />
      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsLive />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsLive />
      </Suspense>
      <Testimonials />
      <Suspense fallback={<ExperienceSkeleton />}>
        <ExperienceLive />
      </Suspense>
      <Contact {...mapContact(profile)} />
    </>
  )
}
