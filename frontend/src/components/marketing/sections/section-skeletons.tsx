import { Section } from '../primitives/section'
import { Skeleton } from '../primitives/skeleton'

/** Skeleton fallbacks shown while a streamed section's data is in flight. */

function HeadingSkeleton({ center = false }: { center?: boolean }) {
  return (
    <div className={center ? 'mx-auto mb-[clamp(40px,6vw,68px)] max-w-[620px] text-center' : 'mb-[clamp(40px,6vw,68px)] max-w-[620px]'}>
      <Skeleton className={`h-3.5 w-28 ${center ? 'mx-auto' : ''}`} />
      <Skeleton className={`mt-4 h-9 w-[min(100%,420px)] ${center ? 'mx-auto' : ''}`} />
      <Skeleton className={`mt-3 h-4 w-[min(100%,320px)] ${center ? 'mx-auto' : ''}`} />
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <Section id="skills" tone="subtle">
      <HeadingSkeleton center />
      <div className="grid gap-[18px] md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-mk border border-mk-hairline bg-mk-surface p-7">
            <div className="mb-5 flex items-center gap-3">
              <Skeleton className="size-[42px] rounded-xl" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function ProjectsSkeleton() {
  return (
    <Section id="work">
      <HeadingSkeleton />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-mk border border-mk-hairline bg-mk-surface">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="p-6">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
              <div className="mt-[18px] flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-16 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/** Grid-only skeleton for the /projects listing (heading rendered separately). */
export function ProjectsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-mk border border-mk-hairline bg-mk-surface">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="p-6">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <div className="mt-[18px] flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-6 w-16 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ExperienceSkeleton() {
  return (
    <Section id="experience" tone="subtle">
      <HeadingSkeleton center />
      <div className="mx-auto max-w-[760px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-10 pl-[52px]">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="mt-3 h-5 w-52" />
            <Skeleton className="mt-2 h-4 w-40" />
            <Skeleton className="mt-3 h-4 w-full max-w-[520px]" />
          </div>
        ))}
      </div>
    </Section>
  )
}
