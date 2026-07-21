// NOTE: this module is imported only by Server Components (the landing page and
// its async section wrappers). It reads server-only env (`API_BACKEND_URL`) and
// must never be imported into a Client Component.
import type { Profile, Skill, Experience, Project, Education, Certificate } from '@/types'

/**
 * Server-only data layer for the marketing landing.
 *
 * The browser talks to the backend through the Next rewrite (`NEXT_PUBLIC_API_URL=/api/v1`),
 * but Server Components fetch it directly over the internal URL (`API_BACKEND_URL`), so we
 * build an absolute base here. Every call is cached with `revalidate` (ISR) and fails soft:
 * on any network/HTTP error it returns an empty result and the mappers fall back to the
 * static defaults, so the page always renders (and the build never breaks if the API is down).
 */

const API_BASE = `${process.env.API_BACKEND_URL ?? 'http://localhost:8000'}/api/v1`

/** Revalidation windows (seconds). Content changes rarely; projects a bit more often. */
export const REVALIDATE = {
  profile: 3600,
  skills: 3600,
  experiences: 3600,
  projects: 600,
  educations: 3600,
  certificates: 3600,
} as const

const FETCH_TIMEOUT_MS = 4000

export interface PageMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

type Envelope<T> = { success?: boolean; message?: string; data?: T; meta?: PageMeta }

async function fetchEnvelope<T>(path: string, revalidate: number): Promise<Envelope<T> | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
      signal: controller.signal,
    })
    if (!res.ok) return null
    return (await res.json()) as Envelope<T>
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchData<T>(path: string, revalidate: number): Promise<T | null> {
  const json = await fetchEnvelope<T>(path, revalidate)
  return json?.data ?? null
}

/** Normalizes a payload that may be a plain array or a nested paginator (`{ data: [] }`). */
function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  const nested = (payload as { data?: unknown } | null)?.data
  return Array.isArray(nested) ? (nested as T[]) : []
}

export async function getProfile(): Promise<Profile | null> {
  const data = await fetchData<Profile[]>('/profile', REVALIDATE.profile)
  return toList<Profile>(data)[0] ?? null
}

export async function getSkills(): Promise<Skill[]> {
  return toList<Skill>(await fetchData<Skill[]>('/skills', REVALIDATE.skills))
}

export async function getExperiences(): Promise<Experience[]> {
  return toList<Experience>(await fetchData<Experience[]>('/experiences', REVALIDATE.experiences))
}

export async function getProjects(limit = 4): Promise<Project[]> {
  return toList<Project>(await fetchData<Project[]>(`/projects?per_page=${limit}`, REVALIDATE.projects))
}

export async function getProjectById(id: string | number): Promise<Project | null> {
  return (await fetchData<Project>(`/projects/${id}`, REVALIDATE.projects)) ?? null
}

export interface ProjectsPage {
  items: Project[]
  meta: PageMeta
}

/** Server-side search + technology filter + pagination for the /projects listing. */
export async function getProjectsPage(params: {
  page?: number
  perPage?: number
  search?: string
  technology?: string
}): Promise<ProjectsPage> {
  const page = Math.max(1, params.page ?? 1)
  const perPage = params.perPage ?? 9
  const qs = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.search?.trim()) qs.set('search', params.search.trim())
  if (params.technology?.trim()) qs.set('technology', params.technology.trim())

  const json = await fetchEnvelope<Project[]>(`/projects?${qs.toString()}`, REVALIDATE.projects)
  const items = toList<Project>(json?.data)
  const meta: PageMeta = json?.meta ?? {
    current_page: page,
    last_page: 1,
    per_page: perPage,
    total: items.length,
    from: items.length ? 1 : null,
    to: items.length || null,
  }
  return { items, meta }
}

/** Distinct technology tags across projects, for the filter chips. */
export async function getProjectTechnologies(): Promise<string[]> {
  const projects = await getProjects(50)
  const set = new Set<string>()
  for (const project of projects) {
    ;(project.technology ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => set.add(t))
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function getEducations(): Promise<Education[]> {
  return toList<Education>(await fetchData<Education[]>('/educations', REVALIDATE.educations))
}

export async function getCertificates(): Promise<Certificate[]> {
  return toList<Certificate>(await fetchData<Certificate[]>('/certificates', REVALIDATE.certificates))
}
