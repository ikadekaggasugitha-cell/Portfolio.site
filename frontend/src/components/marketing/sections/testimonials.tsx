import { testimonials } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

export function Testimonials() {
  return (
    <Section id="voices">
      <SectionHeading
        eyebrow="05 — Kind words"
        title="What collaborators say"
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-mk border border-mk-hairline bg-mk-surface p-7 shadow-mk-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-mk-md">
              <div aria-hidden className="font-mk-mono text-[2.4rem] leading-[0.4] text-mk-accent opacity-60">
                &ldquo;
              </div>
              <blockquote className="mt-3.5 flex-1 text-[0.98rem] text-mk-ink">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-[42px] place-items-center rounded-full bg-mk-brand text-[0.9rem] font-bold text-mk-on-brand">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-[0.9rem] font-semibold">{t.name}</span>
                  <span className="block text-[0.78rem] text-mk-faint">{t.title}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
