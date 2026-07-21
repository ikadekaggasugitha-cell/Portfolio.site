import { getExperiences, getProjects, getSkills } from '@/lib/marketing/api.server'
import { categorizeSkills, mapExperience, mapProjects } from '@/lib/marketing/mappers'
import { Skills } from './skills'
import { FeaturedProjects } from './featured-projects'
import { Experience } from './experience'

/**
 * Async Server Components that fetch their own slice of live data and render the
 * prop-driven section. Each is wrapped in <Suspense> on the page so it can stream
 * with a skeleton fallback; if the API is unreachable the mappers fall back to the
 * static defaults, so the section always renders.
 */

export async function SkillsLive() {
  const skills = await getSkills()
  return <Skills groups={categorizeSkills(skills)} />
}

export async function ProjectsLive() {
  const projects = await getProjects(4)
  return <FeaturedProjects projects={mapProjects(projects, 4)} />
}

export async function ExperienceLive() {
  const experiences = await getExperiences()
  return <Experience entries={mapExperience(experiences)} />
}
