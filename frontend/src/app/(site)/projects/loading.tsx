import { Section } from '@/components/marketing/primitives/section'
import { Skeleton } from '@/components/marketing/primitives/skeleton'
import { ProjectsGridSkeleton } from '@/components/marketing/sections/section-skeletons'

/** Route-level loading UI shown while /projects (re)fetches on filter/page changes. */
export default function ProjectsLoading() {
  return (
    <Section id="projects">
      <div className="mx-auto mb-[clamp(40px,6vw,60px)] max-w-[620px] text-center">
        <Skeleton className="mx-auto h-3.5 w-24" />
        <Skeleton className="mx-auto mt-4 h-9 w-[min(100%,420px)]" />
        <Skeleton className="mx-auto mt-3 h-4 w-[min(100%,320px)]" />
      </div>
      <div className="mx-auto mb-10 max-w-[860px]">
        <Skeleton className="h-12 w-full rounded-full" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <ProjectsGridSkeleton />
    </Section>
  )
}
