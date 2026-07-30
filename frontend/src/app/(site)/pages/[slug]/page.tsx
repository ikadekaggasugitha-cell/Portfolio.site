import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, soften } from '@/lib/marketing/api.server'
import { site } from '@/lib/marketing/content'
import { Section } from '@/components/marketing/primitives/section'
import { Container } from '@/components/marketing/primitives/container'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { PageBlockRenderer } from '@/components/marketing/sections/page-blocks'
import { HeroBackdrop } from '@/components/marketing/sections/hero-backdrop'

/**
 * Public renderer for the admin's Pages CMS.
 *
 * The backend has always exposed GET /api/v1/pages/slug/{slug} and the admin has always
 * been able to create, edit and publish pages — but nothing on the public site consumed
 * them, so publishing a page had no visible effect anywhere. This is that consumer; the
 * URL matches the admin editor's "View on site" link.
 *
 * Pages are rendered on demand (no generateStaticParams — there is no public index of
 * slugs) and invalidated on save through the `pages` tag.
 */

type Params = Promise<{ slug: string }>

export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

const metaString = (page: { meta?: Record<string, unknown> | null }, key: string): string => {
  const value = page.meta?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const { data: page } = await soften(getPageBySlug(slug), null)
  if (!page) return { title: `Page not found · ${site.name}` }

  const title = metaString(page, 'seo_title') || `${page.title} · ${site.name}`
  const description = metaString(page, 'seo_description')

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/pages/${page.slug}` },
    openGraph: { type: 'article', title, description, siteName: site.name },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CmsPage({ params }: { params: Params }) {
  const { slug } = await params
  const { data: page } = await getPageBySlug(slug)

  // A missing slug and an unreachable API both mean we have nothing to show. Rendering
  // 404 for an outage is the safe choice: it isn't cached as a successful page.
  if (!page) notFound()

  const blocks = (page.blocks ?? []).filter((block) => block.type)
  const hasHeroBlock = blocks.some((block) => block.type === 'hero')

  return (
    <>
      {/* Blocks own the top of the page when one of them is a hero; otherwise the
          page title provides the banner. */}
      {!hasHeroBlock && (
        <section className="relative overflow-hidden pb-[clamp(32px,5vw,48px)] pt-[clamp(48px,7vw,88px)]">
          <HeroBackdrop />
          <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
          <Container className="relative z-[2]">
            <Reveal>
              <h1 className="mx-auto max-w-[20ch] text-center text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
                {page.title}
              </h1>
            </Reveal>
          </Container>
        </section>
      )}

      {blocks.map((block, i) => (
        <PageBlockRenderer key={String(block.id ?? i)} block={block} />
      ))}

      {/* Free-form HTML from the editor's Content field. Authored by the site owner
          behind admin auth, so it is trusted markup. */}
      {page.content?.trim() && (
        <Section>
          <Reveal>
            <div
              className="mk-prose mx-auto max-w-[72ch] text-[1.05rem] leading-relaxed text-mk-muted"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </Reveal>
        </Section>
      )}

      {!blocks.length && !page.content?.trim() && (
        <Section>
          <p className="text-center text-mk-muted">This page has no content yet.</p>
        </Section>
      )}
    </>
  )
}
