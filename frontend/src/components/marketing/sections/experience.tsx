import { timeline, type TimelineEntry } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

interface ExperienceProps {
  entries?: TimelineEntry[]
  id?: string
  tone?: 'canvas' | 'subtle'
  eyebrow?: string
  title?: string
  subtitle?: string
}

export function Experience({
  entries = timeline,
  id = 'experience',
  tone = 'subtle',
  eyebrow = '06 — Experience',
  title = 'The road so far',
  subtitle,
}: ExperienceProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="relative mx-auto max-w-[760px]">
        <span aria-hidden className="absolute bottom-1.5 left-4 top-1.5 w-px bg-mk-hairline" />
        {entries.map((entry, i) => (
          <Reveal key={entry.period} delay={i * 0.08}>
            <div className="relative pb-10 pl-[52px] last:pb-0">
              <span
                className={cn(
                  'absolute left-[6px] top-1 grid size-5 place-items-center rounded-full border-2 bg-mk-surface',
                  entry.current
                    ? 'border-mk-amber shadow-[0_0_0_4px_rgba(245,158,11,0.16)]'
                    : 'border-mk-brand',
                )}
              >
                <span className={cn('size-2 rounded-full', entry.current ? 'bg-mk-amber' : 'bg-mk-brand')} />
              </span>

              <span className="font-mk-mono text-[0.74rem] uppercase tracking-[0.08em] text-mk-accent">
                {entry.period}
              </span>
              <h3 className="mt-2 text-[1.15rem] font-bold">{entry.role}</h3>
              <p className="mt-1 font-medium text-mk-ink">
                {entry.company}
                {entry.location && <span className="text-mk-faint"> · {entry.location}</span>}
              </p>
              <p className="mt-2.5 text-[0.96rem] text-mk-muted">{entry.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
