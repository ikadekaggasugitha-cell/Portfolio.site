import {
  getCertificates,
  getEducations,
  getExperiences,
  getSkills,
} from '@/lib/marketing/api.server'
import {
  categorizeSkills,
  mapCertificates,
  mapEducation,
  mapExperience,
} from '@/lib/marketing/mappers'
import { Skills } from './skills'
import { Experience } from './experience'
import { Education } from './education'
import { Certificates } from './certificates'

/**
 * Async Server Components for the /about page. Same pattern as the landing's
 * live sections, but with page-appropriate headings/tones. Every section hides
 * itself when the admin has no content of that kind. We do not publish
 * representative defaults because dummy portfolio content looks real.
 */

export async function AboutSkillsLive() {
  const { data } = await getSkills()
  const groups = categorizeSkills(data)
  if (!groups.length) return null
  return (
    <Skills
      groups={groups}
      id="skills"
      tone="subtle"
      aboutVariant
    />
  )
}

export async function AboutExperienceLive() {
  const { data } = await getExperiences()
  const entries = mapExperience(data)
  if (!entries.length) return null
  return (
    <Experience
      entries={entries}
      id="experience"
      tone="canvas"
      aboutVariant
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
