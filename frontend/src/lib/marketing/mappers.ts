import type { LucideIcon } from 'lucide-react'
import { Cloud, Code2, Database, PenTool, Sparkles } from 'lucide-react'
import type { Certificate, Education, Experience, Profile, Project, Skill } from '@/types'
import {
  aboutDefaults,
  aboutHeroDefaults,
  contactDefaults,
  heroDefaults,
  projects as projectDefaults,
  skillGroups as skillGroupDefaults,
  timeline as timelineDefaults,
  type AboutData,
  type AboutHeroData,
  type CertificateEntry,
  type ContactData,
  type EducationEntry,
  type FeaturedProject,
  type HeroData,
  type ProjectDetail,
  type ProjectMotif,
  type SkillGroup,
  type TimelineEntry,
} from './content'

/* ----------------------------- Profile ----------------------------- */

/** `??` only substitutes null/undefined; treat empty strings as "missing" too. */
const orDefault = (value: string | null | undefined, fallback: string) =>
  value && value.trim() ? value : fallback

export function mapHero(profile: Profile | null): HeroData {
  if (!profile) return heroDefaults
  return {
    ...heroDefaults,
    name: orDefault(profile.name, heroDefaults.name),
    role: orDefault(profile.title, heroDefaults.role),
    photo: profile.photo?.trim() ? profile.photo : null,
    intro: orDefault(profile.description, heroDefaults.intro),
    githubUrl: orDefault(profile.github, heroDefaults.githubUrl),
    linkedinUrl: orDefault(profile.linkedin, heroDefaults.linkedinUrl),
    cvUrl: orDefault(profile.cv, heroDefaults.cvUrl),
    email: orDefault(profile.email, heroDefaults.email),
    location: orDefault(profile.location, heroDefaults.location),
    available: profile.is_available ?? heroDefaults.available,
  }
}

export function mapAbout(profile: Profile | null): AboutData {
  // Profile exposes a single `description`, which the hero already surfaces as the
  // headline intro. About keeps its richer default copy until a dedicated long-form
  // bio field exists on the backend.
  void profile
  return aboutDefaults
}

export function mapContact(profile: Profile | null): ContactData {
  if (!profile) return contactDefaults
  return {
    ...contactDefaults,
    githubUrl: orDefault(profile.github, contactDefaults.githubUrl),
    linkedinUrl: orDefault(profile.linkedin, contactDefaults.linkedinUrl),
    email: orDefault(profile.email, contactDefaults.email),
    location: orDefault(profile.location, contactDefaults.location),
    available: profile.is_available ?? contactDefaults.available,
  }
}

export function mapAboutHero(profile: Profile | null): AboutHeroData {
  if (!profile) return aboutHeroDefaults
  return {
    ...aboutHeroDefaults,
    name: orDefault(profile.name, aboutHeroDefaults.name),
    role: orDefault(profile.title, aboutHeroDefaults.role),
    bio: orDefault(profile.description, aboutHeroDefaults.bio),
    photo: profile.photo?.trim() ? profile.photo : null,
    githubUrl: orDefault(profile.github, aboutHeroDefaults.githubUrl),
    linkedinUrl: orDefault(profile.linkedin, aboutHeroDefaults.linkedinUrl),
    cvUrl: orDefault(profile.cv, aboutHeroDefaults.cvUrl),
    email: orDefault(profile.email, aboutHeroDefaults.email),
    location: orDefault(profile.location, aboutHeroDefaults.location),
    available: profile.is_available ?? aboutHeroDefaults.available,
  }
}

/* ----------------------------- Skills ------------------------------ */

const CATEGORY_ORDER = ['frontend', 'backend', 'devops', 'design', 'other'] as const
type CategoryKey = (typeof CATEGORY_ORDER)[number]

const CATEGORY_META: Record<CategoryKey, { title: string; icon: LucideIcon }> = {
  frontend: { title: 'Frontend', icon: Code2 },
  backend: { title: 'Backend', icon: Database },
  devops: { title: 'DevOps & Cloud', icon: Cloud },
  design: { title: 'Design & Craft', icon: PenTool },
  other: { title: 'More', icon: Sparkles },
}

const CATEGORY_BY_SKILL: Record<string, CategoryKey> = {
  react: 'frontend', 'next': 'frontend', 'next.js': 'frontend', nextjs: 'frontend',
  typescript: 'frontend', javascript: 'frontend', tailwind: 'frontend', 'tailwind css': 'frontend',
  'framer motion': 'frontend', vue: 'frontend', 'vue.js': 'frontend', html: 'frontend', html5: 'frontend',
  css: 'frontend', css3: 'frontend', redux: 'frontend', sass: 'frontend',
  node: 'backend', 'node.js': 'backend', nodejs: 'backend', express: 'backend', 'express.js': 'backend',
  laravel: 'backend', php: 'backend', python: 'backend', go: 'backend', golang: 'backend',
  postgresql: 'backend', postgres: 'backend', mysql: 'backend', mongodb: 'backend', redis: 'backend',
  'rest apis': 'backend', rest: 'backend', graphql: 'backend',
  docker: 'devops', kubernetes: 'devops', aws: 'devops', gcp: 'devops', azure: 'devops',
  nginx: 'devops', git: 'devops', github: 'devops', gitlab: 'devops', 'ci/cd': 'devops',
  linux: 'devops', terraform: 'devops', firebase: 'devops',
  figma: 'design', 'ui/ux': 'design', ui: 'design', ux: 'design', 'design systems': 'design',
  accessibility: 'design', photoshop: 'design', illustrator: 'design', sketch: 'design',
}

/**
 * Group API skills. Prefers the real `category` field; for skills without one
 * (older rows), falls back to inferring from the skill name. Unknown category
 * strings become their own group so the backend can add categories freely.
 */
export function categorizeSkills(skills: Skill[]): SkillGroup[] {
  if (!skills.length) return skillGroupDefaults

  const groups = new Map<string, { title: string; icon: LucideIcon; skills: string[] }>()
  const push = (key: string, title: string, icon: LucideIcon, name: string) => {
    const group = groups.get(key) ?? { title, icon, skills: [] }
    group.skills.push(name)
    groups.set(key, group)
  }

  for (const skill of skills) {
    const name = skill.skill_name?.trim()
    if (!name) continue
    const rawCategory = skill.category?.trim()

    if (rawCategory) {
      const key = rawCategory.toLowerCase()
      const known = CATEGORY_META[key as CategoryKey] as { title: string; icon: LucideIcon } | undefined
      push(key, known?.title ?? rawCategory, known?.icon ?? CATEGORY_META.other.icon, name)
    } else {
      const key = CATEGORY_BY_SKILL[name.toLowerCase()] ?? 'other'
      push(key, CATEGORY_META[key].title, CATEGORY_META[key].icon, name)
    }
  }

  // Known categories in canonical order, then custom groups, then "other" last.
  const known = CATEGORY_ORDER.filter((k) => k !== 'other' && groups.has(k))
  const custom = [...groups.keys()].filter((k) => !(CATEGORY_ORDER as readonly string[]).includes(k))
  const orderedKeys = [...known, ...custom, ...(groups.has('other') ? ['other'] : [])]

  const result = orderedKeys.map((k) => {
    const group = groups.get(k)!
    return { title: group.title, icon: group.icon, skills: group.skills }
  })
  return result.length ? result : skillGroupDefaults
}

/* ----------------------------- Projects ---------------------------- */

const MOTIF_ROTATION: ProjectMotif[] = ['cms', 'analytics', 'commerce', 'devops']

/** Stable, per-project motif so the same project shows the same mockup everywhere. */
function motifForId(id: number): ProjectMotif {
  return MOTIF_ROTATION[Math.abs(id) % MOTIF_ROTATION.length]
}

const splitTech = (technology: string | null): string[] =>
  (technology ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

function toCard(project: Project, featured: boolean): FeaturedProject {
  return {
    id: String(project.id),
    title: project.title,
    featured,
    motif: motifForId(project.id),
    imageUrl: project.images?.[0]?.image ?? undefined,
    summary: project.description ?? '',
    detail: project.description ?? '',
    tags: splitTech(project.technology),
    demoUrl: project.demo_url ?? '#',
    repoUrl: project.github_url ?? '#',
  }
}

/** Landing "Featured" grid — the API already orders featured-first. */
export function mapProjects(projects: Project[], limit = 4): FeaturedProject[] {
  if (!projects.length) return projectDefaults.slice(0, limit)
  return projects.slice(0, limit).map((project) => toCard(project, project.is_featured ?? false))
}

/** Listing cards for /projects. No static fallback — the page decides how to
 *  handle an empty result (graceful defaults on first load vs. "no matches"). */
export function mapProjectCards(projects: Project[]): FeaturedProject[] {
  return projects.map((project) => toCard(project, project.is_featured ?? false))
}

export function mapProjectDetail(project: Project): ProjectDetail {
  return {
    id: String(project.id),
    title: project.title,
    description: project.description ?? '',
    tags: splitTech(project.technology),
    images: (project.images ?? []).map((img) => img.image).filter(Boolean),
    motif: motifForId(project.id),
    demoUrl: project.demo_url?.trim() ? project.demo_url : null,
    repoUrl: project.github_url?.trim() ? project.github_url : null,
  }
}

/** Other projects sharing the most technologies with the current one. */
export function relatedProjects(
  all: Project[],
  currentId: number,
  currentTech: string | null,
  limit = 3,
): FeaturedProject[] {
  const currentTags = splitTech(currentTech).map((t) => t.toLowerCase())
  return all
    .filter((p) => p.id !== currentId)
    .map((p) => {
      const tags = splitTech(p.technology).map((t) => t.toLowerCase())
      const overlap = tags.filter((t) => currentTags.includes(t)).length
      return { project: p, overlap }
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ project }) => toCard(project, false))
}

/* ---------------------------- Experience --------------------------- */

function yearOf(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) return String(parsed.getFullYear())
  const match = value.match(/\d{4}/)
  return match ? match[0] : null
}

function formatPeriod(start: string | null, end: string | null): string {
  const startYear = yearOf(start)
  const endLabel = end ? yearOf(end) : 'Present'
  if (startYear && endLabel) return `${startYear} — ${endLabel}`
  return startYear ?? endLabel ?? ''
}

export function mapExperience(experiences: Experience[]): TimelineEntry[] {
  if (!experiences.length) return timelineDefaults

  return [...experiences]
    .sort((a, b) => (b.start_date ?? '').localeCompare(a.start_date ?? ''))
    .map((exp) => ({
      period: formatPeriod(exp.start_date, exp.end_date),
      role: exp.position,
      company: exp.company,
      location: exp.location ?? '',
      description: exp.description ?? '',
      current: !exp.end_date,
    }))
}

/* ------------------- Education & Certificates (About) -------------------- */
/* These sections hide entirely when empty — no fabricated fallback content. */

export function mapEducation(educations: Education[]): EducationEntry[] {
  return [...educations]
    .sort((a, b) => (b.start_date ?? '').localeCompare(a.start_date ?? ''))
    .map((edu) => ({
      degree: edu.degree?.trim() || 'Studies',
      institution: edu.institution,
      field: edu.field_of_study?.trim() || '',
      period: formatPeriod(edu.start_date, edu.end_date),
      description: edu.description ?? '',
    }))
}

export function mapCertificates(certificates: Certificate[]): CertificateEntry[] {
  return [...certificates]
    .sort((a, b) => (b.issued_date ?? '').localeCompare(a.issued_date ?? ''))
    .map((cert) => ({
      title: cert.title,
      issuer: cert.issuer,
      date: yearOf(cert.issued_date) ?? '',
      credentialUrl: cert.credential_url?.trim() ? cert.credential_url : null,
    }))
}
