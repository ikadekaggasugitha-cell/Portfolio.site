'use client'

import { testimonials as testimonialDefaults, type Testimonial } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

export function Testimonials({
  testimonials = testimonialDefaults,
}: {
  testimonials?: Testimonial[]
}) {
  const { t } = useTranslation()
  if (!testimonials.length) return null

  /** Translate known testimonials by name match. */
  const translated = testimonials.map((item) => {
    const match = t.testimonials.quotes.find((q) => q.name === item.name)
    return match ? { ...item, quote: match.quote, title: match.title } : item
  })

  return (
    <Section id="voices">
      <SectionHeading
        eyebrow={t.testimonials.eyebrow}
        title={t.testimonials.title}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {translated.map((item, i) => (
          <Reveal key={`${item.name}-${i}`} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-mk border border-mk-hairline bg-mk-surface p-7 shadow-mk-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-mk-md">
              <div aria-hidden className="font-mk-mono text-[2.4rem] leading-[0.4] text-mk-accent opacity-60">
                &ldquo;
              </div>
              <blockquote className="mt-3.5 flex-1 text-[0.98rem] text-mk-ink">{item.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-[42px] place-items-center rounded-full bg-mk-brand text-[0.9rem] font-bold text-mk-on-brand">
                  {item.initials}
                </span>
                <span>
                  <span className="block text-[0.9rem] font-semibold">{item.name}</span>
                  <span className="block text-[0.78rem] text-mk-faint">{item.title}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
