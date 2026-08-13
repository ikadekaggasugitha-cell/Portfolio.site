'use client'

import { stats as statDefaults, type StatTile } from '@/lib/marketing/content'
import type { LocalizedText } from '@/types'
import { useTranslation } from '../theme/language-provider'
import { Section } from '../primitives/section'
import { Eyebrow } from '../primitives/eyebrow'
import { Reveal } from '../primitives/reveal'
import { Stat } from '../primitives/stat'

/** Map of known English stat labels → translation key. */
const STAT_LABEL_KEYS: Record<string, 'yearsShipping' | 'projectsDelivered' | 'happyClients' | 'onTimeDelivery'> = {
  'Years shipping': 'yearsShipping',
  'Projects delivered': 'projectsDelivered',
  'Happy clients': 'happyClients',
  'On-time delivery': 'onTimeDelivery',
}

export function About({
  lead,
  body,
  stats = statDefaults,
}: {
  /** From Admin → Profile → About section. Blank means "not written yet". */
  lead?: LocalizedText
  body?: LocalizedText
  stats?: StatTile[]
}) {
  const { t, localize } = useTranslation()

  // Admin copy wins for the active language; the translated default only fills a still-empty field.
  const resolvedLead = localize(lead).trim() || t.about.lead
  const localizedBody = localize(body).trim()
  const resolvedParagraphs = localizedBody
    ? localizedBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : t.about.paragraphs

  // Localize each stat label; a seeded English default still maps to its translation.
  const translatedStats = stats.map((stat) => {
    const raw = localize(stat.label)
    const key = STAT_LABEL_KEYS[raw]
    return { ...stat, label: key ? t.stats[key] : raw }
  })

  return (
    <Section id="about">
      <div className="grid items-start gap-[clamp(40px,6vw,80px)] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-[18px] text-[clamp(1.25rem,2.4vw,1.7rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-balance">
              {resolvedLead}
            </p>
          </Reveal>
          {resolvedParagraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="mt-4 text-[1.05rem] text-mk-muted first:mt-5">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        {/* Editable from Admin -> Stats; the column disappears when there are none. */}
        {translatedStats.length > 0 && (
          <div className="grid grid-cols-2 gap-3.5">
            {translatedStats.map((stat, i) => (
              <Reveal key={`${stat.label}-${i}`} delay={i * 0.08}>
                <Stat value={stat.value} suffix={stat.suffix} label={stat.label} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
