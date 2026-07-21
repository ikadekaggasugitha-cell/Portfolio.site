import { aboutDefaults, stats, type AboutData } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { Eyebrow } from '../primitives/eyebrow'
import { Reveal } from '../primitives/reveal'
import { Stat } from '../primitives/stat'

export function About({ lead, paragraphs }: AboutData = aboutDefaults) {
  return (
    <Section id="about">
      <div className="grid items-start gap-[clamp(40px,6vw,80px)] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>01 — About</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-[18px] text-[clamp(1.25rem,2.4vw,1.7rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-balance">
              {lead}
            </p>
          </Reveal>
          {paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="mt-4 text-[1.05rem] text-mk-muted first:mt-5">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        {/* Stats have no API source yet — kept static (see recommendations). */}
        <div className="grid grid-cols-2 gap-3.5">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <Stat value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
