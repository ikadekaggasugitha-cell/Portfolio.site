/**
 * Single source of truth for the marketing landing page content.
 *
 * Everything the landing renders comes from here, so wiring it to the live
 * API later is a drop-in swap: each block below maps to an existing type in
 * `@/types` (Profile, Skill, Project, Experience, …). Until then these are
 * representative values grounded in the real profile.
 */
import type { LucideIcon } from 'lucide-react'
import type { LocalizedText } from '@/types'

export const site = {
  name: 'I Kadek Agga Sugitha',
  shortName: 'PORTOFOLIO',
  role: 'Full Stack Developer',
  location: 'Jakarta, Indonesia',
  available: true,
  email: 'hello@agga.dev',
  githubUrl: '#',
  linkedinUrl: '#',
  cvUrl: '#',
  tagline: 'building reliable software, end to end.',
  intro:
    "Hi, I'm I Kadek Agga Sugitha, an Full Stack Developer who builds software end to end: web applications, REST APIs and backend services, databases, and the automation that ties them together.",
} as const

// Page-level navigation — the V2 site is multi-page (/, /about, and, once
// migrated, /projects, /contact). Active state is derived from the route.
export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
] as const


/** A stat tile in the About section. Editable from Admin -> Stats. */
export interface StatTile {
  value: number
  suffix: string
  label: LocalizedText
}

/**
 * "What I do" — the general scope of work, shown right after About so the
 * page reads as an IT Full Stack Developer working across the stack, not a
 * single-project web builder. Deliberately not framed around any one project.
 */
export interface Capability {
  title: LocalizedText
  description: LocalizedText
  icon: string | LucideIcon
}

export interface SkillGroup {
  title: string
  icon: string | LucideIcon
  skills: string[]
}

/**
 * `motif` drives a distinct, per-project stylized mockup (see ProjectMockup) —
 * so the Work grid reads as four different products, not one gradient repeated.
 * Swap `motif` for real screenshot URLs when available.
 */
export type ProjectMotif = 'cms' | 'analytics' | 'commerce' | 'devops'

export interface FeaturedProject {
  id: string
  title: LocalizedText
  featured: boolean
  motif: ProjectMotif
  /** Cover image — the first screenshot. Falls back to the stylized motif mockup. */
  imageUrl?: string
  /** Every screenshot, for the case-study modal's slider. */
  images?: string[]
  summary: LocalizedText
  detail: LocalizedText
  tags: string[]
  demoUrl: string
  repoUrl: string
}

export interface TimelineEntry {
  period: string
  role: LocalizedText
  company: string
  location: string
  description: LocalizedText
  current?: boolean
}

export interface Testimonial {
  quote: LocalizedText
  name: string
  title: LocalizedText
  initials: string
}

/** A contact-page FAQ entry. Editable from Admin -> FAQ. */
export interface FaqEntry {
  q: LocalizedText
  a: LocalizedText
}

/* ---------------------------------------------------------------------------
 * View models — the shape each section consumes. Mappers (lib/marketing/mappers.ts)
 * produce these from the live API and fall back to the `*Defaults` below, so a
 * section always receives a complete, render-ready object.
 * ------------------------------------------------------------------------- */

export interface HeroData {
  name: string
  role: LocalizedText
  /** Profile photo URL; null shows an initials monogram instead. */
  photo: string | null
  intro: LocalizedText
  available: boolean
  location: string
  githubUrl: string
  linkedinUrl: string
  email: string
  cvUrl: string
  codeStack: string[]
}

export interface AboutData {
  lead: LocalizedText
  /** Raw body; blank lines separate paragraphs. Split after localizing on the client. */
  body: LocalizedText
}

export interface ContactData {
  email: string
  githubUrl: string
  linkedinUrl: string
  location: string
  available: boolean
}

export const heroDefaults: HeroData = {
  name: site.name,
  role: site.role,
  photo: null,
  intro: site.intro,
  available: site.available,
  location: site.location,
  githubUrl: site.githubUrl,
  linkedinUrl: site.linkedinUrl,
  email: site.email,
  cvUrl: site.cvUrl,
  codeStack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Postgres'],
}


export const contactDefaults: ContactData = {
  email: site.email,
  githubUrl: site.githubUrl,
  linkedinUrl: site.linkedinUrl,
  location: site.location,
  available: site.available,
}

/* ---- /about page view models ---- */

export interface AboutHeroData {
  name: string
  role: LocalizedText
  bio: LocalizedText
  photo: string | null
  available: boolean
  location: string
  githubUrl: string
  linkedinUrl: string
  email: string
  cvUrl: string
}

export const aboutHeroDefaults: AboutHeroData = {
  name: site.name,
  role: site.role,
  bio: site.intro,
  photo: null,
  available: site.available,
  location: site.location,
  githubUrl: site.githubUrl,
  linkedinUrl: site.linkedinUrl,
  email: site.email,
  cvUrl: site.cvUrl,
}

export interface EducationEntry {
  degree: LocalizedText
  institution: string
  field: LocalizedText
  period: string
  description: LocalizedText
}

export interface CertificateEntry {
  title: LocalizedText
  issuer: string
  date: string
  credentialUrl: string | null
}

/* ---- /projects detail view model ---- */

export interface ProjectDetail {
  id: string
  title: LocalizedText
  description: LocalizedText
  tags: string[]
  images: string[]
  motif: ProjectMotif
  demoUrl: string | null
  repoUrl: string | null
}
