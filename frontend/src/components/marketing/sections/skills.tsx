import { skillGroups, type SkillGroup } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

interface SkillsProps {
  groups?: SkillGroup[]
  id?: string
  tone?: 'canvas' | 'subtle'
  eyebrow?: string
  title?: string
  titleAccent?: string
  subtitle?: string
}

export function Skills({
  groups = skillGroups,
  id = 'skills',
  tone = 'subtle',
  eyebrow = '03 — Capabilities',
  title = 'A stack that covers the whole product',
  titleAccent = 'whole product',
  subtitle = 'The tools I reach for daily — grouped by where they live in the stack.',
}: SkillsProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        titleAccent={titleAccent}
        subtitle={subtitle}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-[18px] md:grid-cols-2">
        {groups.map((group, i) => {
          const Icon = group.icon
          return (
            <Reveal key={group.title} delay={i * 0.08}>
              <div className="group h-full rounded-mk border border-mk-hairline bg-mk-surface p-7 shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-mk-brand-soft/60 hover:shadow-mk-md">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-[42px] place-items-center rounded-xl bg-mk-brand/10 text-mk-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-[1.12rem] font-bold">{group.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-transparent bg-mk-subtle-2 px-3.5 py-2 text-[0.86rem] font-medium text-mk-ink transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:bg-mk-surface"
                    >
                      <span aria-hidden className="size-[7px] rounded-full bg-mk-brand-soft" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
