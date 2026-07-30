import Image from 'next/image'
import type { PageBlock } from '@/types'
import { getProjects } from '@/lib/marketing/api.server'
import { mapProjects } from '@/lib/marketing/mappers'
import { Section } from '../primitives/section'
import { Container } from '../primitives/container'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'
import { Button } from '../primitives/button'
import { ProjectCard } from './project-card'
import { HeroBackdrop } from './hero-backdrop'

/**
 * Renders the block types the admin's Pages editor can produce
 * (see components/admin/PageEditor.tsx): hero, text, cta and recent-projects.
 *
 * Block `data` is free-form JSON from the editor, so every field is read defensively
 * and an unrecognised block type renders nothing rather than breaking the page.
 */

const str = (data: Record<string, unknown> | undefined, key: string): string =>
  typeof data?.[key] === 'string' ? (data[key] as string).trim() : ''

const num = (data: Record<string, unknown> | undefined, key: string): number | null => {
  const value = data?.[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  return null
}

function HeroBlock({ data }: { data?: Record<string, unknown> }) {
  const heading = str(data, 'heading')
  const subheading = str(data, 'subheading')
  const background = str(data, 'background_url')
  if (!heading && !subheading && !background) return null

  return (
    <section className="relative overflow-hidden pb-[clamp(32px,5vw,56px)] pt-[clamp(48px,7vw,88px)]">
      {background ? (
        <>
          <Image
            src={background}
            alt={str(data, 'background_alt')}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-mk-canvas/72" />
        </>
      ) : (
        <HeroBackdrop />
      )}
      <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative z-[2]">
        <Reveal>
          {heading && (
            <h1 className="mx-auto max-w-[20ch] text-center text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
              {heading}
            </h1>
          )}
          {subheading && (
            <p className="mx-auto mt-5 max-w-[62ch] text-center text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-mk-muted">
              {subheading}
            </p>
          )}
        </Reveal>
        {str(data, 'background_caption') && (
          <p className="relative z-[2] mt-6 text-center text-[0.82rem] text-mk-faint">
            {str(data, 'background_caption')}
          </p>
        )}
      </Container>
    </section>
  )
}

/**
 * Rich text authored in the admin's HTML editor. The content is written by the site
 * owner through an authenticated admin route, so it is trusted markup — the same trust
 * model as the page's own `content` field.
 */
function TextBlock({ data }: { data?: Record<string, unknown> }) {
  const content = str(data, 'content')
  if (!content) return null
  return (
    <Section>
      <Reveal>
        <div
          className="mk-prose mx-auto max-w-[72ch] text-[1.05rem] leading-relaxed text-mk-muted"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Reveal>
    </Section>
  )
}

function CtaBlock({ data }: { data?: Record<string, unknown> }) {
  const text = str(data, 'text')
  const url = str(data, 'url')
  if (!text || !url) return null
  return (
    <Section tone="subtle">
      <Reveal>
        <div className="flex justify-center">
          <Button href={url} size="lg">
            {text}
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}

async function RecentProjectsBlock({ data }: { data?: Record<string, unknown> }) {
  const count = Math.min(Math.max(num(data, 'count') ?? 4, 1), 12)
  const filter = str(data, 'filter').toLowerCase()

  // Over-fetch when filtering so the tag filter still yields `count` cards.
  const { data: fetched } = await getProjects(filter ? Math.max(count * 4, 24) : count)
  const matching = filter
    ? fetched.filter((project) =>
        (project.technology ?? '')
          .split(',')
          .some((tech) => tech.trim().toLowerCase() === filter),
      )
    : fetched

  const projects = mapProjects(matching, count)
  if (!projects.length) return null

  return (
    <Section id="recent-projects" tone="subtle">
      <SectionHeading
        eyebrow="Work"
        title="Recent projects"
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={Math.min(i, 5) * 0.06}>
            <ProjectCard project={project} href={`/projects/${project.id}`} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function PageBlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock data={block.data} />
    case 'text':
      return <TextBlock data={block.data} />
    case 'cta':
      return <CtaBlock data={block.data} />
    case 'recent-projects':
      return <RecentProjectsBlock data={block.data} />
    default:
      return null
  }
}
