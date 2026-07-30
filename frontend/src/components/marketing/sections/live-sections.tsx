import type { Profile } from '@/types'
import {
  getCapabilities,
  getExperiences,
  getProjects,
  getSkills,
  getStats,
  getTestimonials,
} from '@/lib/marketing/api.server'
import {
  categorizeSkills,
  liveOrFallback,
  mapAbout,
  mapCapabilities,
  mapExperience,
  mapMarqueeItems,
  mapProjects,
  mapStats,
  mapTestimonials,
} from '@/lib/marketing/mappers'
import {
  capabilities as capabilityDefaults,
  marqueeItems as marqueeDefaults,
  projects as projectDefaults,
  skillGroups as skillGroupDefaults,
  stats as statDefaults,
  testimonials as testimonialDefaults,
  timeline as timelineDefaults,
} from '@/lib/marketing/content'
import { Skills } from './skills'
import { FeaturedProjects } from './featured-projects'
import { Experience } from './experience'
import { About } from './about'
import { TrustStrip } from './trust-strip'
import { WhatIDo } from './what-i-do'
import { Testimonials } from './testimonials'

/**
 * Async Server Components that fetch their own slice of live data and render the
 * prop-driven section. Each is wrapped in <Suspense> on the page so it can stream
 * with a skeleton fallback instead of holding up the whole response.
 *
 * A section hides itself when the admin has no content of that kind, and falls back
 * to the static defaults only when the API was unreachable — see `liveOrFallback`.
 */

export async function SkillsLive() {
  const { ok, data } = await getSkills()
  const groups = liveOrFallback(categorizeSkills(data), ok, skillGroupDefaults)
  if (!groups.length) return null
  return <Skills groups={groups} />
}

export async function ProjectsLive() {
  const { ok, data } = await getProjects(4)
  const projects = liveOrFallback(mapProjects(data, 4), ok, projectDefaults.slice(0, 4))
  if (!projects.length) return null
  return <FeaturedProjects projects={projects} />
}

export async function ExperienceLive() {
  const { ok, data } = await getExperiences()
  const entries = liveOrFallback(mapExperience(data), ok, timelineDefaults)
  if (!entries.length) return null
  return <Experience entries={entries} />
}

/** Technology marquee, driven by Admin → Skills rather than a second hand-kept list. */
export async function TrustStripLive() {
  const { ok, data } = await getSkills()
  return <TrustStrip items={liveOrFallback(mapMarqueeItems(data), ok, [...marqueeDefaults])} />
}

/**
 * About copy comes from the profile the page already fetched; only the stat tiles need
 * their own request, which is why this takes `profile` as a prop instead of re-fetching.
 */
export async function AboutLive({ profile }: { profile: Profile | null }) {
  const { ok, data } = await getStats()
  return <About {...mapAbout(profile)} stats={liveOrFallback(mapStats(data), ok, statDefaults)} />
}

export async function WhatIDoLive() {
  const { ok, data } = await getCapabilities()
  return <WhatIDo capabilities={liveOrFallback(mapCapabilities(data), ok, capabilityDefaults)} />
}

export async function TestimonialsLive() {
  const { ok, data } = await getTestimonials()
  return (
    <Testimonials
      testimonials={liveOrFallback(mapTestimonials(data), ok, testimonialDefaults)}
    />
  )
}
