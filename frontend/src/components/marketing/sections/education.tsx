import type { EducationEntry } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

/** Academic background. Renders nothing when there are no entries. */
export function Education({
  entries,
  id = 'education',
  tone = 'canvas',
}: {
  entries: EducationEntry[]
  id?: string
  tone?: 'canvas' | 'subtle'
}) {
  if (!entries.length) return null

  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow="Education"
        title="Academic background"
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />
      <div className="mx-auto grid max-w-[900px] gap-5 md:grid-cols-2">
        {entries.map((edu, i) => (
          <Reveal key={`${edu.institution}-${i}`} delay={i * 0.08}>
            <div className="h-full rounded-mk border border-mk-hairline bg-mk-surface p-7 shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-mk-brand-soft/60 hover:shadow-mk-md">
              {edu.period && (
                <span className="font-mk-mono text-[0.74rem] uppercase tracking-[0.08em] text-mk-accent">
                  {edu.period}
                </span>
              )}
              <h3 className="mt-2 text-[1.15rem] font-bold">{edu.degree}</h3>
              <p className="mt-1 font-medium text-mk-ink">{edu.institution}</p>
              {edu.field && <p className="mt-0.5 text-[0.92rem] text-mk-muted">{edu.field}</p>}
              {edu.description && <p className="mt-3 text-[0.95rem] text-mk-muted">{edu.description}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
