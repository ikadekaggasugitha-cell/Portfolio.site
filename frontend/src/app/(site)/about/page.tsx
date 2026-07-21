import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { Profile } from '@/types'
import { getProfile } from '@/lib/marketing/api.server'
import { mapAboutHero } from '@/lib/marketing/mappers'
import { site, skillGroups } from '@/lib/marketing/content'
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
  'I Kadek Agga Sugitha is an IT programmer building reliable software end to end — web applications, backend APIs, databases and automation — with TypeScript, React, Next.js, Node.js and cloud infrastructure.'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const name = profile?.name?.trim() || site.name
  const role = profile?.title?.trim() || site.role
  const description = profile?.description?.trim() || FALLBACK_BIO
  const title = `About · ${name}`

  return {
    title,
    description,
    alternates: { canonical: '/about' },
    openGraph: { type: 'profile', title, description, siteName: name },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function PersonJsonLd({ profile }: { profile: Profile | null }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name?.trim() || site.name,
    jobTitle: profile?.title?.trim() || site.role,
    description: profile?.description?.trim() || FALLBACK_BIO,
    address: { '@type': 'PostalAddress', addressLocality: 'Bali', addressCountry: 'ID' },
    sameAs: [profile?.github, profile?.linkedin].filter((url): url is string => Boolean(url) && url !== '#'),
    knowsAbout: skillGroups.flatMap((group) => group.skills),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default async function AboutPage() {
  const profile = await getProfile()

  return (
    <>
      <PersonJsonLd profile={profile} />
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
