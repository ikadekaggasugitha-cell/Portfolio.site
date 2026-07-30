// NOTE: this module is imported only by Server Components (the landing page and
// its async section wrappers). It reads server-only env (`API_BACKEND_URL`) and
// must never be imported into a Client Component.
import type {
  Profile,
  Skill,
  Experience,
  Project,
  Education,
  Certificate,
  Page,
  Stat,
  Capability,
  Testimonial,
  Faq,
} from '@/types'

/**
 * Server-only data layer for the marketing landing.
 *
 * The browser talks to the backend through the Next rewrite (`NEXT_PUBLIC_API_URL`),
 * but Server Components fetch it directly over the internal URL (`API_BACKEND_URL`), so we
 * build an absolute base here. Every call is cached with `revalidate` (ISR) and tagged, so an
 * admin save can bust it on demand through /api/revalidate.
 *
 * Every getter returns a `Fetched<T>`: `ok` distinguishes "the API answered" from "the API
 * could not be reached". That distinction matters — a successful empty response means the
 * admin genuinely has no content and the section must render empty. Collapsing the two (the
 * previous behaviour) made an outage look like real content, and made it impossible to ever
 * remove the last item in a section from the admin panel.
 *
 * Failure policy — the heart of the CMS bug this module caused:
 *   • At runtime a failed fetch THROWS. Next then abandons the regeneration and keeps serving
 *     the last good cached page (see response-cache: a generator that throws after a previous
 *     entry resolved is logged, not committed). Returning placeholder content instead, as this
 *     module used to, meant every regeneration re-committed that placeholder as a fresh 200 —
 *     so purging the cache from the admin "worked" and immediately re-published the same wrong
 *     page. Cache tags were never the problem; they are attached even when a fetch fails.
 *   • During `next build` it returns null instead, so a backend outage can never break a
 *     deploy. That render can still bake in the static defaults, but `revalidate` on each
 *     public route bounds how long that survives.
 */

const API_BASE = `${(process.env.API_BACKEND_URL ?? 'http://localhost:8000').replace(/\/+$/, '')}/api/v1`

/** Revalidation windows (seconds). Kept uniform and short: admin saves purge these tags on
 *  demand, so this is only the safety net for a purge that never arrived. */
export const REVALIDATE = {
  profile: 600,
  skills: 600,
  experiences: 600,
  projects: 600,
  educations: 600,
  certificates: 600,
  pages: 600,
  stats: 600,
  capabilities: 600,
  testimonials: 600,
  faqs: 600,
} as const

/**
 * The Laravel API runs as a PHP function on Vercel talking to a managed MySQL over TLS.
 * Measured against production: ~6s warm p50, ~9.2s warm p95, >10s on a cold function.
 *
 * This used to be 4s — below even the median — so in production *every* server-side fetch
 * aborted and the public site rendered entirely from the static defaults in content.ts.
 * 12s was also too tight: cold starts still aborted twice and took the render down.
 *
 * Keep the worst case (timeout × attempts) comfortably inside each route's `maxDuration`,
 * or the platform kills the render and nothing gets cached at all.
 */
const FETCH_TIMEOUT_MS = Number(process.env.API_FETCH_TIMEOUT_MS) || 20000

/** One retry, to ride out a cold start or a transient 5xx from the PHP function. */
const FETCH_ATTEMPTS = 2

/** Prerendering during `next build`: degrade instead of failing the deploy. */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build'

/**
 * Downgrades a getter's runtime throw back into `{ ok: false }`.
 *
 * Only for call sites where a failure must not take the whole route down: the shared
 * layout (which renders chrome, not content) and `generateMetadata` (which sits outside
 * error.tsx, so a throw there escapes to the global error page instead of the boundary).
 * Page bodies must NOT use this — their throw is what stops a failed render from
 * overwriting the last good cached page.
 */
export async function soften<T>(request: Promise<Fetched<T>>, fallback: T): Promise<Fetched<T>> {
  try {
    return await request
  } catch {
    return { ok: false, data: fallback }
  }
}

export interface PageMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

/** `ok: false` means the API was unreachable (network error, timeout or HTTP error).
 *  `ok: true` with empty `data` means the admin simply has no content of that type. */
export interface Fetched<T> {
  ok: boolean
  data: T
}

type Envelope<T> = { success?: boolean; message?: string; data?: T; meta?: PageMeta }

/** Carries the HTTP status so callers can treat specific failures as non-fatal. */
class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchEnvelope<T>(
  path: string,
  revalidate: number,
  tag?: string,
  /** For lookups where "absent" is an ordinary answer (an unpublished slug), so a 404
   *  resolves to an empty envelope instead of being reported as an API failure. */
  treat404AsEmpty = false,
): Promise<Envelope<T> | null> {
  let lastError: unknown = null
  let lastStatus: number | undefined

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate, tags: tag ? [tag] : undefined },
        signal: controller.signal,
      })
      if (res.ok) return (await res.json()) as Envelope<T>
      if (res.status === 404 && treat404AsEmpty) return {}
      lastError = `HTTP ${res.status}`
      lastStatus = res.status
      // 4xx is deterministic — retrying it just burns another cold start.
      if (res.status < 500) break
    } catch (err) {
      lastError = err
      lastStatus = undefined
    } finally {
      clearTimeout(timeout)
    }
  }

  // Loud on the server (Vercel function logs). A silent failure here is exactly how the
  // public site ends up serving placeholder content with no visible cause.
  console.error(`[api.server] GET ${path} failed after ${FETCH_ATTEMPTS} attempt(s):`, lastError)

  // See the failure policy at the top of this file: throwing is what preserves the last
  // good cached page instead of overwriting it with placeholder content.
  if (!isBuildPhase()) {
    throw new ApiError(`Portfolio API unreachable: GET ${path} (${String(lastError)})`, lastStatus)
  }
  return null
}

/** Normalizes a payload that may be a plain array or a nested paginator (`{ data: [] }`). */
function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  const nested = (payload as { data?: unknown } | null)?.data
  return Array.isArray(nested) ? (nested as T[]) : []
}

async function fetchList<T>(path: string, revalidate: number, tag: string): Promise<Fetched<T[]>> {
  try {
    const json = await fetchEnvelope<T[]>(path, revalidate, tag)
    return json ? { ok: true, data: toList<T>(json.data) } : { ok: false, data: [] }
  } catch (err) {
    // A 404 on a collection means this backend deployment doesn't expose the resource yet —
    // e.g. the frontend shipped ahead of the API, or its migrations haven't run. Report it
    // as unavailable instead of taking the page down; it heals when the backend catches up.
    if (err instanceof ApiError && err.status === 404) {
      return { ok: false, data: [] }
    }
    throw err
  }
}

export async function getProfile(): Promise<Fetched<Profile | null>> {
  const json = await fetchEnvelope<Profile[]>('/profile', REVALIDATE.profile, 'profile')
  return json ? { ok: true, data: toList<Profile>(json.data)[0] ?? null } : { ok: false, data: null }
}

export async function getSkills(): Promise<Fetched<Skill[]>> {
  return fetchList<Skill>('/skills', REVALIDATE.skills, 'skills')
}

export async function getExperiences(): Promise<Fetched<Experience[]>> {
  return fetchList<Experience>('/experiences', REVALIDATE.experiences, 'experiences')
}

export async function getProjects(limit = 4): Promise<Fetched<Project[]>> {
  return fetchList<Project>(`/projects?per_page=${limit}`, REVALIDATE.projects, 'projects')
}

export async function getProjectById(id: string | number): Promise<Fetched<Project | null>> {
  const json = await fetchEnvelope<Project>(`/projects/${id}`, REVALIDATE.projects, 'projects')
  return json ? { ok: true, data: json.data ?? null } : { ok: false, data: null }
}

export interface ProjectsPage {
  ok: boolean
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

  const json = await fetchEnvelope<Project[]>(`/projects?${qs.toString()}`, REVALIDATE.projects, 'projects')
  const items = toList<Project>(json?.data)
  const meta: PageMeta = json?.meta ?? {
    current_page: page,
    last_page: 1,
    per_page: perPage,
    total: items.length,
    from: items.length ? 1 : null,
    to: items.length || null,
  }
  return { ok: json !== null, items, meta }
}

/** Distinct technology tags across projects, for the filter chips. */
export async function getProjectTechnologies(): Promise<string[]> {
  const { data: projects } = await getProjects(50)
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

export async function getEducations(): Promise<Fetched<Education[]>> {
  return fetchList<Education>('/educations', REVALIDATE.educations, 'educations')
}

export async function getCertificates(): Promise<Fetched<Certificate[]>> {
  return fetchList<Certificate>('/certificates', REVALIDATE.certificates, 'certificates')
}

/* --------- Marketing copy the admin panel owns (formerly hardcoded) --------- */

/** Stat tiles in the homepage About section. */
export async function getStats(): Promise<Fetched<Stat[]>> {
  return fetchList<Stat>('/stats', REVALIDATE.stats, 'stats')
}

/** "What I do" cards. */
export async function getCapabilities(): Promise<Fetched<Capability[]>> {
  return fetchList<Capability>('/capabilities', REVALIDATE.capabilities, 'capabilities')
}

export async function getTestimonials(): Promise<Fetched<Testimonial[]>> {
  return fetchList<Testimonial>('/testimonials', REVALIDATE.testimonials, 'testimonials')
}

/** Contact page FAQ accordion. */
export async function getFaqs(): Promise<Fetched<Faq[]>> {
  return fetchList<Faq>('/faqs', REVALIDATE.faqs, 'faqs')
}

/** A page authored in the admin's Pages CMS. The backend only serves published slugs —
 *  a draft or unknown slug comes back 404, which surfaces here as `ok: true, data: null`. */
export async function getPageBySlug(slug: string): Promise<Fetched<Page | null>> {
  const json = await fetchEnvelope<Page>(
    `/pages/slug/${encodeURIComponent(slug)}`,
    REVALIDATE.pages,
    'pages',
    true,
  )
  return json ? { ok: true, data: json.data ?? null } : { ok: false, data: null }
}
