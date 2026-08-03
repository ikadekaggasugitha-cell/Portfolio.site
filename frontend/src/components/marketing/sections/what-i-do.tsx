'use client'

import { capabilities as capabilityDefaults, type Capability } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'
import { MarketingIcon } from '../primitives/marketing-icon'

/**
 * States the general scope of work right after About — web, backend, data
 * and automation — so the page reads as an IT Full Stack Developer working across the
 * stack rather than someone who only builds websites.
 */
export function WhatIDo({ capabilities = capabilityDefaults }: { capabilities?: Capability[] }) {
  const { t } = useTranslation()
  if (!capabilities.length) return null

  return (
    <Section id="what-i-do" tone="subtle">
      <SectionHeading
        eyebrow={t.whatIDo.eyebrow}
        title={t.whatIDo.title}
        titleAccent={t.whatIDo.titleAccent}
        subtitle={t.whatIDo.subtitle}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((capability, i) => {
          const translated = t.whatIDo.capabilities[i]
          return (
            <Reveal key={capability.title} delay={i * 0.08}>
              <div className="h-full rounded-mk border border-mk-hairline bg-mk-surface p-6 shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-mk-brand-soft/60 hover:shadow-mk-md">
                <span className="grid size-[44px] place-items-center rounded-xl bg-mk-brand/10 text-mk-accent">
                  <MarketingIcon icon={capability.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-[1.02rem] font-bold">{translated?.title ?? capability.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-mk-muted">{translated?.description ?? capability.description}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
