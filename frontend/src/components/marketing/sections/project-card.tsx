import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/marketing/content'
import { ProjectMockup } from './project-mockup'

/**
 * Reusable project card. Pass `href` to render a navigating <Link> (listing)
 * or `onClick` to render a <button> (landing → modal). Visual is identical.
 */
const cardClass =
  'group block h-full w-full overflow-hidden rounded-mk border border-mk-hairline bg-mk-surface text-left shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-mk-brand-soft/60 hover:shadow-mk-lg'

function CardInner({ project, priority }: { project: FeaturedProject; priority?: boolean }) {
  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <ProjectMockup motif={project.motif} />
          )}
        </div>
        {project.featured && (
          <span className="mk-tag-featured absolute left-3.5 top-3.5 rounded-lg px-2.5 py-1.5 font-mk-mono text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
            ★ Featured
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="flex items-center gap-2 text-[1.28rem] font-bold">
          {project.title}
          <ArrowUpRight
            className="size-4 text-mk-faint transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-mk-accent"
            aria-hidden
          />
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[0.96rem] text-mk-muted">{project.summary}</p>
        {project.tags.length > 0 && (
          <div className="mt-[18px] flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-mk-subtle px-2.5 py-1 font-mk-mono text-[0.72rem] text-mk-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export function ProjectCard({
  project,
  href,
  onClick,
  priority,
}: {
  project: FeaturedProject
  href?: string
  onClick?: () => void
  priority?: boolean
}) {
  if (href) {
    return (
      <Link href={href} className={cardClass} aria-label={`View ${project.title}`}>
        <CardInner project={project} priority={priority} />
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-haspopup="dialog" className={cardClass}>
      <CardInner project={project} priority={priority} />
    </button>
  )
}
