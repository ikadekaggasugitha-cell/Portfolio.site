import {
  getCertificates,
  getEducations,
  getExperiences,
  getSkills,
} from '@/lib/marketing/api.server'
import {
  categorizeSkills,
  liveOrFallback,
  mapCertificates,
  mapEducation,
  mapExperience,
} from '@/lib/marketing/mappers'
import {
  skillGroups as skillGroupDefaults,
  timeline as timelineDefaults,
} from '@/lib/marketing/content'
import { Skills } from './skills'
import { Experience } from './experience'
import { Education } from './education'
import { Certificates } from './certificates'

/**
 * Async Server Components for the /about page. Same pattern as the landing's
 * live sections, but with page-appropriate headings/tones. Every section hides
 * itself when the admin has no content of that kind; Skills & Experience keep a
 * static fallback for when the API is unreachable (see `liveOrFallback`).
 */

export async function AboutSkillsLive() {
  const { ok, data } = await getSkills()
  const groups = liveOrFallback(categorizeSkills(data), ok, skillGroupDefaults)
  if (!groups.length) return null
  return (
    <Skills
      groups={groups}
      id="skills"
      tone="subtle"
      eyebrow="Toolkit"
      title="Skills & tools"
      titleAccent="tools"
      subtitle="The technologies I reach for day to day, grouped by where they live in the stack."
    />
  )
}

export async function AboutExperienceLive() {
  const { ok, data } = await getExperiences()
  const entries = liveOrFallback(mapExperience(data), ok, timelineDefaults)
  if (!entries.length) return null
  return (
    <Experience
      entries={entries}
      id="experience"
      tone="canvas"
      eyebrow="Career"
      title="Where I've worked"
    />
  )
}

export async function AboutEducationLive() {
  const { data } = await getEducations()
  return <Education entries={mapEducation(data)} tone="subtle" />
}

export async function AboutCertificatesLive() {
  const { data } = await getCertificates()
  return <Certificates entries={mapCertificates(data)} tone="canvas" />
}
