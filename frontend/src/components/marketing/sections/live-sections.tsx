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
  mapAbout,
  mapCapabilities,
  mapExperience,
  mapMarqueeItems,
  mapProjects,
  mapStats,
  mapTestimonials,
} from '@/lib/marketing/mappers'
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
 * A section hides itself when the admin has no content of that kind. We do not
 * publish representative defaults because dummy portfolio content looks real.
 */

export async function SkillsLive() {
  const { data } = await getSkills()
  const groups = categorizeSkills(data)
  if (!groups.length) return null
  return <Skills groups={groups} />
}

export async function ProjectsLive() {
  const { data } = await getProjects(4)
  const projects = mapProjects(data, 4)
  if (!projects.length) return null
  return <FeaturedProjects projects={projects} />
}

export async function ExperienceLive() {
  const { data } = await getExperiences()
  const entries = mapExperience(data)
  if (!entries.length) return null
  return <Experience entries={entries} />
}

/** Technology marquee, driven by Admin → Skills rather than a second hand-kept list. */
export async function TrustStripLive() {
  const { data } = await getSkills()
  return <TrustStrip items={mapMarqueeItems(data)} />
}

/**
 * About copy comes from the profile the page already fetched; only the stat tiles need
 * their own request, which is why this takes `profile` as a prop instead of re-fetching.
 */
export async function AboutLive({ profile }: { profile: Profile | null }) {
  const { data } = await getStats()
  return <About {...mapAbout(profile)} stats={mapStats(data)} />
}

export async function WhatIDoLive() {
  const { data } = await getCapabilities()
  return <WhatIDo capabilities={mapCapabilities(data)} />
}

export async function TestimonialsLive() {
  const { data } = await getTestimonials()
  return <Testimonials testimonials={mapTestimonials(data)} />
}
