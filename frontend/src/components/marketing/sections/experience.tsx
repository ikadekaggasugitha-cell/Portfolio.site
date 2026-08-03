'use client'

import { timeline, type TimelineEntry } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'
import { useTranslation } from '../theme/language-provider'
import { translations } from '@/lib/marketing/translations'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

interface ExperienceProps {
  entries?: TimelineEntry[]
  id?: string
  tone?: 'canvas' | 'subtle'
  /** When true, uses the about-page variant headings from translations. */
  aboutVariant?: boolean
}

export function Experience({
  entries = timeline,
  id = 'experience',
  tone = 'subtle',
  aboutVariant = false,
}: ExperienceProps) {
  const { t } = useTranslation()

  const eyebrow = aboutVariant ? t.experience.aboutEyebrow : t.experience.eyebrow
  const title = aboutVariant ? t.experience.aboutTitle : t.experience.title

  /**
   * Translate only entries still identical to the seeded English default.
   *
   * The previous match was `company === … || role === …`, so a real job added in the
   * admin that merely shared a role title with the seeded data had its company, dates
   * and description silently replaced by the placeholder. Requiring company, role and
   * description to all still match means anything entered in the admin is shown verbatim.
   */
  const translated = entries.map((entry) => {
    const idx = translations.en.experience.entries.findIndex(
      (e) => e.company === entry.company && e.role === entry.role && e.description === entry.description,
    )
    const match = idx >= 0 ? t.experience.entries[idx] : undefined
    if (!match) return entry
    return { ...entry, period: match.period, role: match.role, company: match.company, location: match.location, description: match.description }
  })

  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="relative mx-auto max-w-[760px]">
        <span aria-hidden className="absolute bottom-1.5 left-4 top-1.5 w-px bg-mk-hairline" />
        {translated.map((entry, i) => (
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
