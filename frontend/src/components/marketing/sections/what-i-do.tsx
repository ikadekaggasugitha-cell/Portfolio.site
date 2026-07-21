import { capabilities } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

/**
 * States the general scope of work right after About — web, backend, data
 * and automation — so the page reads as an IT programmer working across the
 * stack rather than someone who only builds websites.
 */
export function WhatIDo() {
  return (
    <Section id="what-i-do" tone="subtle">
      <SectionHeading
        eyebrow="02 — What I do"
        title="Software, end to end — not just websites"
        titleAccent="not just websites"
        subtitle="A general-purpose IT programmer's toolkit: the frontend is one part of a bigger picture."
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((capability, i) => {
          const Icon = capability.icon
          return (
            <Reveal key={capability.title} delay={i * 0.08}>
              <div className="h-full rounded-mk border border-mk-hairline bg-mk-surface p-6 shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-mk-brand-soft/60 hover:shadow-mk-md">
                <span className="grid size-[44px] place-items-center rounded-xl bg-mk-brand/10 text-mk-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-[1.02rem] font-bold">{capability.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-mk-muted">{capability.description}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
