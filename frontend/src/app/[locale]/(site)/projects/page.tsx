import type { Metadata } from 'next'
import { getProjectTechnologies, getProjectsPage } from '@/lib/marketing/api.server'
import { mapProjectCards } from '@/lib/marketing/mappers'
import { site } from '@/lib/marketing/content'
import type { Locale } from '@/lib/marketing/translations'
import { buildAlternates, isLocale, ogLocales } from '@/lib/marketing/i18n'
import { notFound } from 'next/navigation'
import { Container } from '@/components/marketing/primitives/container'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { ProjectCard } from '@/components/marketing/sections/project-card'
import { ProjectsControls } from '@/components/marketing/sections/projects-controls'
import { Pagination } from '@/components/marketing/sections/pagination'
import { HeroBackdrop } from '@/components/marketing/sections/hero-backdrop'
import { ProjectsPageHeading, ProjectsEmptyState } from '@/components/marketing/sections/projects-page-headings'

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60


const PER_PAGE = 9

const DESCRIPTION =
  'Selected work by I Kadek Agga Sugitha — web applications, backend services, dashboards and automation tooling built with React, Next.js, Node.js and modern cloud infrastructure.'

type SearchParams = Promise<Record<string, string | string[] | undefined>>
type PageParams = Promise<{ locale: string }>

async function resolveLocale(params: PageParams): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const title = `Projects · ${site.name}`
  const og = ogLocales(locale)
  return {
    title,
    description: DESCRIPTION,
    alternates: buildAlternates(locale, '/projects'),
    openGraph: { type: 'website', title, description: DESCRIPTION, siteName: site.name, ...og, url: '/projects' },
    twitter: { card: 'summary_large_image', title, description: DESCRIPTION },
  }
}

export default async function ProjectsPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams
  params: PageParams
}) {
  const locale = await resolveLocale(params)
  const sp = await searchParams
  const search = firstParam(sp.search).trim()
  const technology = firstParam(sp.tech).trim()
  const page = Math.max(1, Number.parseInt(firstParam(sp.page), 10) || 1)

  const [{ items, meta }, tags] = await Promise.all([
    getProjectsPage({ page, perPage: PER_PAGE, search, technology }),
    getProjectTechnologies(),
  ])

  const hasFilters = search !== '' || technology !== ''
  const cards = mapProjectCards(items)

  const total = meta.total || cards.length

  return (
    <>
      <section className="relative overflow-hidden pb-[clamp(32px,5vw,48px)] pt-[clamp(48px,7vw,88px)]">
        <HeroBackdrop />
        <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
        <Container className="relative z-[2]">
          <ProjectsPageHeading />
        </Container>
      </section>

      {/* Explicit bottom-only padding (no shared Section py) — the hero band
          above already provides top spacing, so this only needs to close it out. */}
      <section id="projects" className="relative scroll-mt-20 pb-[clamp(72px,11vw,132px)]">
        <Container>
          <ProjectsControls tags={tags} search={search} technology={technology} total={total} />

          {cards.length === 0 ? (
            <ProjectsEmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((project, i) => (
                  <Reveal key={project.id} delay={Math.min(i, 5) * 0.06}>
                    <ProjectCard
                      project={project}
                      href={`/${locale}/projects/${project.id}`}
                      priority={i < 3}
                    />
                  </Reveal>
                ))}
              </div>
              <Pagination meta={meta} search={search} technology={technology} locale={locale} />
            </>
          )}
        </Container>
      </section>
    </>
  )
}
