/**
 * Single source of truth for the marketing landing page content.
 *
 * Everything the landing renders comes from here, so wiring it to the live
 * API later is a drop-in swap: each block below maps to an existing type in
 * `@/types` (Profile, Skill, Project, Experience, …). Until then these are
 * representative values grounded in the real profile.
 */
import type { LucideIcon } from 'lucide-react'

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
    "Hi, I'm I Kadek Agga Sugitha — an Full Stack Developer who builds software end to end: web applications, REST APIs and backend services, databases, and the automation that ties them together.",
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
  label: string
}

export const stats: StatTile[] = [
  { value: 5, suffix: '+', label: 'Years shipping' },
  { value: 42, suffix: '+', label: 'Projects delivered' },
  { value: 18, suffix: '+', label: 'Happy clients' },
  { value: 99, suffix: '%', label: 'On-time delivery' },
]

/**
 * "What I do" — the general scope of work, shown right after About so the
 * page reads as an IT Full Stack Developer working across the stack, not a
 * single-project web builder. Deliberately not framed around any one project.
 */
export interface Capability {
  title: string
  description: string
  icon: string | LucideIcon
}

export const capabilities: Capability[] = [
  {
    title: 'Web & Applications',
    description: 'Responsive web apps, dashboards and internal tools built with React and Next.js.',
    icon: 'globe',
  },
  {
    title: 'Backend & APIs',
    description: 'REST APIs and backend services with Node.js and Express — the systems that power the frontend.',
    icon: 'server',
  },
  {
    title: 'Data & Databases',
    description: 'Schema design and data modeling with PostgreSQL and MongoDB, built to stay maintainable as they grow.',
    icon: 'database',
  },
  {
    title: 'Automation & DevOps',
    description: 'CI/CD pipelines, Docker containers and scripts that keep deployment and maintenance painless.',
    icon: 'settings',
  },
]

export interface SkillGroup {
  title: string
  icon: string | LucideIcon
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  { title: 'Frontend', icon: 'frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { title: 'Backend', icon: 'backend', skills: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'REST APIs'] },
  { title: 'DevOps & Cloud', icon: 'devops', skills: ['Docker', 'AWS', 'Git', 'CI / CD', 'Nginx'] },
  { title: 'Design & Craft', icon: 'design', skills: ['Figma', 'UI / UX', 'Design systems', 'Accessibility'] },
]

/**
 * `motif` drives a distinct, per-project stylized mockup (see ProjectMockup) —
 * so the Work grid reads as four different products, not one gradient repeated.
 * Swap `motif` for real screenshot URLs when available.
 */
export type ProjectMotif = 'cms' | 'analytics' | 'commerce' | 'devops'

export interface FeaturedProject {
  id: string
  title: string
  featured: boolean
  motif: ProjectMotif
  /** Cover image — the first screenshot. Falls back to the stylized motif mockup. */
  imageUrl?: string
  /** Every screenshot, for the case-study modal's slider. */
  images?: string[]
  summary: string
  detail: string
  tags: string[]
  demoUrl: string
  repoUrl: string
}

export const projects: FeaturedProject[] = [
  {
    id: 'portfolio-cms',
    title: 'Portfolio CMS Platform',
    featured: true,
    motif: 'cms',
    summary:
      'A full personal-site platform: Next.js frontend, a custom admin dashboard, media library and content blocks — the system powering this very site.',
    detail:
      'A production content platform with a public Next.js site and a full admin CMS: profile, projects, skills, experience, media library and page builder. Built for speed (99 Lighthouse) and easy content editing without touching code.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'REST API'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'analytics-dashboard',
    title: 'Realtime Analytics Dashboard',
    featured: false,
    motif: 'analytics',
    summary:
      'Live metrics dashboard with streaming charts, role-based access and sub-second updates over WebSockets.',
    detail:
      'A dashboard that ingests event streams and renders live KPIs with smooth, GPU-accelerated charts. Includes role-based access, saved views and CSV export. Backend on Node + Postgres with a WebSocket layer for realtime.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'ecommerce-storefront',
    title: 'E-commerce Storefront',
    featured: false,
    motif: 'commerce',
    summary:
      'Headless storefront with cart, checkout and a Stripe-powered payment flow — optimized for conversion.',
    detail:
      'A conversion-focused headless commerce build: fast product pages, persistent cart and a streamlined Stripe checkout. Measurable lift in conversion after launch thanks to performance and UX work.',
    tags: ['Next.js', 'Stripe', 'MongoDB'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'devops-toolkit',
    title: 'DevOps Automation Toolkit',
    featured: false,
    motif: 'devops',
    summary:
      'CLI + dashboard to provision, deploy and monitor containerized services with one command.',
    detail:
      'Internal tooling that wraps Docker and AWS into a friendly CLI and dashboard: one command to provision, deploy and roll back services, with health monitoring and log streaming built in.',
    tags: ['Docker', 'AWS', 'Node.js', 'CI/CD'],
    demoUrl: '#',
    repoUrl: '#',
  },
]

export interface TimelineEntry {
  period: string
  role: string
  company: string
  location: string
  description: string
  current?: boolean
}

export const timeline: TimelineEntry[] = [
  {
    period: '2023 — Present',
    role: 'Fullstack Software Engineer',
    company: 'Sinergi Investasi Properti',
    location: 'Jakarta, Indonesia',
    description:
      "Own the company's web platform end to end — a Next.js frontend backed by a custom CMS and admin dashboard. Built the content pipeline, media library and public site with a focus on speed and maintainability.",
    current: true,
  },
  {
    period: '2021 — 2023',
    role: 'Web Developer',
    company: 'Freelance & Agency Work',
    location: 'Remote',
    description:
      'Delivered 30+ client websites and web apps across e-commerce, dashboards and marketing sites. Introduced reusable component systems that cut delivery time significantly.',
  },
  {
    period: '2019 — 2021',
    role: 'Junior Software Engineer',
    company: 'Early career',
    location: 'Indonesia',
    description:
      'Cut my teeth building internal tools and REST APIs. Learned to ship, measure and iterate — and fell in love with the full stack.',
  },
]

export interface Testimonial {
  quote: string
  name: string
  title: string
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Agga delivered our platform ahead of schedule and the code was spotless. Rare to find someone equally strong on backend architecture and frontend polish.',
    name: 'Rina Dewanti',
    title: 'Product Lead',
    initials: 'RD',
  },
  {
    quote:
      'The dashboard he built is fast, intuitive and still easy for our team to extend a year later. Exactly the kind of engineer you want owning a product.',
    name: 'Made Surya',
    title: 'CTO, PropTech Startup',
    initials: 'MS',
  },
  {
    quote:
      'Communicative, detail-obsessed and genuinely cares about UX. Our conversion improved measurably after his rebuild.',
    name: 'Anita Kusuma',
    title: 'Marketing Director',
    initials: 'AK',
  },
]

/** A contact-page FAQ entry. Editable from Admin -> FAQ. */
export interface FaqEntry {
  q: string
  a: string
}

export const faqs: FaqEntry[] = [
  {
    q: 'What kind of projects do you take on?',
    a: "Web applications, dashboards, REST APIs, database design, and internal tooling or automation — not just websites. I'm happy to own a problem end to end or join an existing team on a specific piece of the stack.",
  },
  {
    q: 'Are you available for full-time roles?',
    a: "Yes — I'm open to full-time positions, contract work and freelance projects. Remote-first, and comfortable across time zones.",
  },
  {
    q: 'How do we get started?',
    a: "Send a message with a rough scope and timeline. I'll reply within a day to set up a quick call and share a plan.",
  },
]

export const marqueeItems = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS',
]

/* ---------------------------------------------------------------------------
 * View models — the shape each section consumes. Mappers (lib/marketing/mappers.ts)
 * produce these from the live API and fall back to the `*Defaults` below, so a
 * section always receives a complete, render-ready object.
 * ------------------------------------------------------------------------- */

export interface HeroData {
  name: string
  role: string
  /** Profile photo URL; null shows an initials monogram instead. */
  photo: string | null
  intro: string
  available: boolean
  location: string
  githubUrl: string
  linkedinUrl: string
  email: string
  cvUrl: string
  codeStack: string[]
}

export interface AboutData {
  lead: string
  paragraphs: string[]
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
  role: string
  bio: string
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
  degree: string
  institution: string
  field: string
  period: string
  description: string
}

export interface CertificateEntry {
  title: string
  issuer: string
  date: string
  credentialUrl: string | null
}

/* ---- /projects detail view model ---- */

export interface ProjectDetail {
  id: string
  title: string
  description: string
  tags: string[]
  images: string[]
  motif: ProjectMotif
  demoUrl: string | null
  repoUrl: string | null
}
