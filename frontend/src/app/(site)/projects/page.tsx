import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { getProjectTechnologies, getProjectsPage } from '@/lib/marketing/api.server'
import { mapProjectCards } from '@/lib/marketing/mappers'
import { projects as projectDefaults, site } from '@/lib/marketing/content'
import { Container } from '@/components/marketing/primitives/container'
import { SectionHeading } from '@/components/marketing/primitives/section-heading'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { ProjectCard } from '@/components/marketing/sections/project-card'
import { ProjectsControls } from '@/components/marketing/sections/projects-controls'
import { Pagination } from '@/components/marketing/sections/pagination'
import { HeroBackdrop } from '@/components/marketing/sections/hero-backdrop'

const PER_PAGE = 9

const DESCRIPTION =
  'Selected work by I Kadek Agga Sugitha — web applications, backend services, dashboards and automation tooling built with React, Next.js, Node.js and modern cloud infrastructure.'

export const metadata: Metadata = {
  title: `Projects · ${site.name}`,
  description: DESCRIPTION,
  alternates: { canonical: '/projects' },
  openGraph: { type: 'website', title: `Projects · ${site.name}`, description: DESCRIPTION, siteName: site.name },
  twitter: { card: 'summary_large_image', title: `Projects · ${site.name}`, description: DESCRIPTION },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const search = firstParam(sp.search).trim()
  const technology = firstParam(sp.tech).trim()
  const page = Math.max(1, Number.parseInt(firstParam(sp.page), 10) || 1)

  const [{ items, meta }, tags] = await Promise.all([
    getProjectsPage({ page, perPage: PER_PAGE, search, technology }),
    getProjectTechnologies(),
  ])

  const hasFilters = search !== '' || technology !== ''
  let cards = mapProjectCards(items)
  // Graceful fallback: unfiltered first page with no data (e.g. API unreachable)
  // shows representative projects rather than an empty page.
  if (cards.length === 0 && !hasFilters && page === 1) cards = projectDefaults

  const total = meta.total || cards.length

  return (
    <>
      <section className="relative overflow-hidden pb-[clamp(32px,5vw,48px)] pt-[clamp(48px,7vw,88px)]">
        <HeroBackdrop />
        <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
        <Container className="relative z-[2]">
          <SectionHeading
            eyebrow="Work"
            title="Projects & case studies"
            titleAccent="case studies"
            subtitle="A collection of things I've designed, built and shipped. Search or filter by technology."
            align="center"
          />
        </Container>
      </section>

      {/* Explicit bottom-only padding (no shared Section py) — the hero band
          above already provides top spacing, so this only needs to close it out. */}
      <section id="projects" className="relative scroll-mt-20 pb-[clamp(72px,11vw,132px)]">
        <Container>
          <ProjectsControls tags={tags} search={search} technology={technology} total={total} />

          {cards.length === 0 ? (
            <div className="mx-auto max-w-[440px] rounded-mk border border-dashed border-mk-hairline bg-mk-surface/60 px-6 py-16 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-mk-brand/10 text-mk-accent">
                <Search className="size-5" aria-hidden />
              </div>
              <p className="font-semibold">No projects match your search</p>
              <p className="mt-1.5 text-[0.92rem] text-mk-muted">Try a different keyword or clear the filters.</p>
              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-mk-hairline bg-mk-surface px-4 py-2 text-[0.88rem] font-semibold transition-colors hover:border-mk-brand-soft"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((project, i) => (
                  <Reveal key={project.id} delay={Math.min(i, 5) * 0.06}>
                    <ProjectCard project={project} href={`/projects/${project.id}`} priority={i < 3} />
                  </Reveal>
                ))}
              </div>
              <Pagination meta={meta} search={search} technology={technology} />
            </>
          )}
        </Container>
      </section>
    </>
  )
}
