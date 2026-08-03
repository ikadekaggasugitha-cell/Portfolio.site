import type { LucideIcon } from 'lucide-react'
import {
  Cloud,
  Code2,
  Database,
  Gauge,
  Globe,
  PenTool,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
} from 'lucide-react'
import type {
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  Skill,
  Stat,
  // Aliased: content.ts exports view-model types with the same names.
  Capability as CapabilityRecord,
  Testimonial as TestimonialRecord,
  Faq,
} from '@/types'
import {
  aboutDefaults,
  aboutHeroDefaults,
  contactDefaults,
  heroDefaults,
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
  type StatTile,
  type FaqEntry,
  type Capability as CapabilityCard,
  type Testimonial as TestimonialCard,
  type TimelineEntry,
} from './content'

/* --------------------------- Fallback policy ------------------------ */

/**
 * Decides when the static defaults in `content.ts` may stand in for live data.
 *
 * Live content always wins. When the API answered but the admin has no content of that
 * kind, we render nothing — "I deleted them all" is a legitimate published state, and the
 * old behaviour of silently re-inserting seeded demo content meant the admin panel could
 * never actually empty a section. Defaults are only used when the API was unreachable, so
 * an outage degrades to a plausible page instead of a blank one.
 */
export function liveOrFallback<T>(mapped: T[], apiReachable: boolean, fallback: T[]): T[] {
  if (mapped.length) return mapped
  return apiReachable ? [] : fallback
}

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

/**
 * Homepage About section. `about_lead` / `about_body` are dedicated fields (the hero already
 * uses `description`), so this section is now editable from Admin → Profile instead of being
 * hardcoded. Blank lines in `about_body` separate paragraphs.
 */
export function mapAbout(profile: Profile | null): AboutData {
  if (!profile) return aboutDefaults

  const paragraphs = (profile.about_body ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    lead: orDefault(profile.about_lead, aboutDefaults.lead),
    paragraphs: paragraphs.length ? paragraphs : aboutDefaults.paragraphs,
  }
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

const CATEGORY_META: Record<CategoryKey, { title: string; icon: string }> = {
  frontend: { title: 'Frontend', icon: 'code' },
  backend: { title: 'Backend', icon: 'database' },
  devops: { title: 'DevOps & Cloud', icon: 'cloud' },
  design: { title: 'Design & Craft', icon: 'design' },
  other: { title: 'More', icon: 'sparkles' },
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
 *
 * Returns an empty array for an empty input — see `liveOrFallback`, which owns
 * the decision of when static defaults are appropriate.
 */
export function categorizeSkills(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, { title: string; icon: string; skills: string[] }>()
  const push = (key: string, title: string, icon: string, name: string) => {
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
      const known = CATEGORY_META[key as CategoryKey] as { title: string; icon: string } | undefined
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

  return orderedKeys.map((k) => {
    const group = groups.get(k)!
    return { title: group.title, icon: group.icon, skills: group.skills }
  })
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

/* ------------- Marketing copy owned by the admin panel ------------------ */

/** About-section stat tiles. */
export function mapStats(stats: Stat[]): StatTile[] {
  return stats.map((stat) => ({
    value: stat.value,
    suffix: stat.suffix ?? '',
    label: stat.label,
  }))
}

/**
 * Icon keys the "What I do" editor offers. Kept small and descriptive rather than exposing
 * every Lucide name — the admin picks from a dropdown, and an unrecognised key still renders.
 */
export const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  server: Server,
  database: Database,
  settings: Settings2,
  code: Code2,
  cloud: Cloud,
  design: PenTool,
  mobile: Smartphone,
  security: ShieldCheck,
  performance: Gauge,
  automation: Workflow,
  sparkles: Sparkles,
}

export function mapCapabilities(capabilities: CapabilityRecord[]): CapabilityCard[] {
  return capabilities.map((capability) => ({
    title: capability.title,
    description: capability.description ?? '',
    icon: capability.icon?.trim().toLowerCase() || 'sparkles',
  }))
}

/** Falls back to initials derived from the name, so the monogram is never blank. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function mapTestimonials(testimonials: TestimonialRecord[]): TestimonialCard[] {
  return testimonials.map((testimonial) => ({
    quote: testimonial.quote,
    name: testimonial.author_name,
    title: testimonial.author_title ?? '',
    initials: testimonial.initials?.trim() || initialsOf(testimonial.author_name),
  }))
}

export function mapFaqs(faqs: Faq[]): FaqEntry[] {
  return faqs.map((faq) => ({ q: faq.question, a: faq.answer }))
}

/**
 * The decorative technology marquee. Sourced from live skills so it stays in step with
 * Admin → Skills instead of being a second, hand-maintained list.
 */
export function mapMarqueeItems(skills: Skill[]): string[] {
  const seen = new Set<string>()
  for (const skill of skills) {
    const name = skill.skill_name?.trim()
    if (name) seen.add(name)
  }
  return [...seen]
}
