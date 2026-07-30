export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  token: string
  token_type: string
  expires_in: number
  user: User
}

export interface Profile {
  id: number
  photo: string | null
  name: string | null
  title: string | null
  description: string | null
  /** Homepage About section: emphasised opening line. */
  about_lead: string | null
  /** Homepage About section body; blank lines separate paragraphs. */
  about_body: string | null
  phone: string | null
  email: string | null
  location: string | null
  is_available: boolean
  github: string | null
  linkedin: string | null
  cv: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  skill_name: string
  category: string | null
  level: number
}

export interface Experience {
  id: number
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
}

export interface Education {
  id: number
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string
  end_date: string | null
  description: string | null
}

export interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  github_url: string | null
  demo_url: string | null
  technology: string | null
  is_featured?: boolean
  sort_order?: number
  images?: ProjectImage[]
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: number
  project_id: number
  image: string
  caption: string | null
  sort_order: number
}

export interface Media {
  id: number
  filename: string
  path: string
  url: string
  mime_type: string | null
  size: number | null
  collection: string | null
  caption: string | null
  alt: string | null
  meta?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: number
  slug: string
  title: string
  content: string | null
  template: string | null
  meta?: Record<string, unknown> | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  blocks?: PageBlock[]
}

export interface PageBlock {
  id?: number | string
  type: string
  sort_order?: number
  data?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface Certificate {
  id: number
  title: string
  issuer: string
  issued_date: string
  file: string | null
  description: string | null
  expiry_date: string | null
  credential_url: string | null
}

export interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  read_at: string | null
  created_at: string
  updated_at: string
}

/* ---------------------------------------------------------------------------
 * Marketing copy owned by the admin panel. These replaced hardcoded values in
 * lib/marketing/content.ts so the public site is fully editable.
 * ------------------------------------------------------------------------- */

/** A stat tile in the homepage About section, e.g. 5 "+" "Years shipping". */
export interface Stat {
  id: number
  label: string
  value: number
  suffix: string | null
  sort_order: number
}

/** A "What I do" card. `icon` is a key resolved to a Lucide icon on render. */
export interface Capability {
  id: number
  title: string
  description: string | null
  icon: string | null
  sort_order: number
}

export interface Testimonial {
  id: number
  quote: string
  author_name: string
  author_title: string | null
  /** Monogram; derived from author_name when blank. */
  initials: string | null
  sort_order: number
}

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
}
