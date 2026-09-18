'use client'

import { useCallback, useState } from 'react'
import type { FeaturedProject } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'
import { ProjectCard } from './project-card'
import { ProjectModal } from './project-modal'

export function FeaturedProjects({ projects = [] }: { projects?: FeaturedProject[] }) {
  const [active, setActive] = useState<FeaturedProject | null>(null)
  const close = useCallback(() => setActive(null), [])
  const { t } = useTranslation()
  if (!projects.length) return null

  return (
    <Section id="work">
      <SectionHeading
        eyebrow={t.work.eyebrow}
        title={t.work.title}
        subtitle={t.work.subtitle}
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08}>
            <ProjectCard project={project} onClick={() => setActive(project)} />
          </Reveal>
        ))}
      </div>

      <ProjectModal project={active} onClose={close} />
    </Section>
  )
}
