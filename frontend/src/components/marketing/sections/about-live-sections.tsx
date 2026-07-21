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
 * live sections, but with page-appropriate headings/tones. Skills & Experience
 * fall back to static content; Education & Certificates self-hide when empty.
 */

export async function AboutSkillsLive() {
  const skills = await getSkills()
  return (
    <Skills
      groups={categorizeSkills(skills)}
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
  const experiences = await getExperiences()
  return (
    <Experience
      entries={mapExperience(experiences)}
      id="experience"
      tone="canvas"
      eyebrow="Career"
      title="Where I've worked"
    />
  )
}

export async function AboutEducationLive() {
  const educations = await getEducations()
  return <Education entries={mapEducation(educations)} tone="subtle" />
}

export async function AboutCertificatesLive() {
  const certificates = await getCertificates()
  return <Certificates entries={mapCertificates(certificates)} tone="canvas" />
}
