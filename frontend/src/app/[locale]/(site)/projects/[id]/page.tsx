import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getProjectById, getProjects, soften } from '@/lib/marketing/api.server'
import { mapProjectDetail, relatedProjects } from '@/lib/marketing/mappers'
import { site } from '@/lib/marketing/content'
import { Section } from '@/components/marketing/primitives/section'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { Button } from '@/components/marketing/primitives/button'
import { ProjectGallery } from '@/components/marketing/sections/project-gallery'
import { ProjectCard } from '@/components/marketing/sections/project-card'
import { GithubIcon } from '@/components/marketing/icons/brand-icons'
import { localize } from '@/lib/marketing/localize'
import { translations, type Locale } from '@/lib/marketing/translations'
import { buildAlternates, isLocale, localeHref, ogLocales } from '@/lib/marketing/i18n'
import { notFound } from 'next/navigation'

type Params = Promise<{ locale: string; id: string }>

async function resolveParams(params: Params): Promise<{ locale: Locale; id: string }> {
  const { locale, id } = await params
  if (!isLocale(locale)) notFound()
  return { locale, id }
}

/**
 * Bounded regeneration window — see the note in page.tsx. Also matters here because
 * generateStaticParams only knows the ids that existed at build time; a project added later
 * is rendered on demand and must not be cached indefinitely.
 */
export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

/** Pre-render known projects at build (both locales); unknown ids still render on-demand (ISR). */
export async function generateStaticParams() {
  const { data: projects } = await getProjects(100)
  return projects.flatMap((p) => ['id', 'en'].map((locale) => ({ id: String(p.id), locale })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await resolveParams(params)
  const { data: project } = await soften(getProjectById(id), null)

  if (!project) {
    return { title: `${translations[locale].projectDetail.notFoundTitle} · ${site.name}` }
  }

  const projectTitle = typeof project.title === 'string' ? project.title : project.title?.id || project.title?.en || ''
  const projectDesc = typeof project.description === 'string' ? project.description : project.description?.id || project.description?.en || ''
  const title = `${projectTitle} · ${site.name}`
  const description = projectDesc.trim() || `${projectTitle} — a project by ${site.name}.`
  const image = project.images?.[0]?.image
  const path = `/projects/${project.id}`

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'article',
      title,
      description,
      siteName: site.name,
      ...ogLocales(locale),
      url: localeHref(locale, path),
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { locale, id } = await resolveParams(params)
  const t = translations[locale]
  const [{ data: project }, { data: all }] = await Promise.all([getProjectById(id), getProjects(100)])

  if (!project) {
    return (
      <Section id="project-detail">
        <div className="mx-auto max-w-[440px] py-16 text-center">
          <h1 className="text-3xl font-extrabold tracking-[-0.02em]">{t.projectDetail.notFoundTitle}</h1>
          <p className="mt-3 text-mk-muted">{t.projectDetail.notFoundBody}</p>
          <div className="mt-8 flex justify-center">
            <Button href={localeHref(locale, '/projects')} variant="ghost">
              <ArrowLeft className="size-[17px]" aria-hidden />
              {t.projectDetail.backToProjects}
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  const detail = mapProjectDetail(project)
  const detailTitleStr = localize(detail.title, locale)
  const detailDescStr = localize(detail.description, locale)
  const related = relatedProjects(all, project.id, project.technology, 3)

  return (
    <Section id="project-detail">
      <Reveal>
        <Link
          href={localeHref(locale, '/projects')}
          className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-mk-muted transition-colors hover:text-mk-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t.projectDetail.backToProjects}
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
          {detailTitleStr}
        </h1>
        {detail.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-mk-subtle px-2.5 py-1 font-mk-mono text-[0.74rem] text-mk-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <ProjectGallery images={detail.images} title={detailTitleStr} motif={detail.motif} />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Reveal>
          <div className="whitespace-pre-line text-[1.05rem] leading-relaxed text-mk-muted">
            {detailDescStr || t.projectDetail.noDescription}
          </div>
        </Reveal>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-mk border border-mk-hairline bg-mk-surface p-6 shadow-mk-sm">
            {(detail.demoUrl || detail.repoUrl) && (
              <>
                <h2 className="font-mk-mono text-[0.72rem] uppercase tracking-[0.1em] text-mk-faint">{t.projectDetail.links}</h2>
                <div className="mt-3 flex flex-col gap-2.5">
                  {detail.demoUrl && (
                    <Button href={detail.demoUrl} size="md" className="w-full">
                      {t.projectDetail.liveDemo}
                      <ExternalLink className="size-[16px]" aria-hidden />
                    </Button>
                  )}
                  {detail.repoUrl && (
                    <Button href={detail.repoUrl} variant="ghost" size="md" className="w-full">
                      <GithubIcon className="size-[16px]" />
                      {t.projectDetail.viewSource}
                    </Button>
                  )}
                </div>
              </>
            )}

            {detail.tags.length > 0 && (
              <div className={detail.demoUrl || detail.repoUrl ? 'mt-6' : ''}>
                <h2 className="font-mk-mono text-[0.72rem] uppercase tracking-[0.1em] text-mk-faint">{t.projectDetail.builtWith}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-mk-subtle-2 px-3 py-1.5 text-[0.84rem] font-medium"
                    >
                      <span aria-hidden className="size-[6px] rounded-full bg-mk-brand-soft" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-[clamp(64px,9vw,110px)]">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.02em]">{t.projectDetail.relatedProjects}</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProjectCard project={p} href={localeHref(locale, `/projects/${p.id}`)} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
