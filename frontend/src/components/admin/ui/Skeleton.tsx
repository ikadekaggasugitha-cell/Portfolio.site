export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-[8px] bg-canvas-parchment motion-reduce:animate-none ${className}`}
    />
  )
}

/** A single card-shaped placeholder, matching the .card-stitch list items used across admin CRUD pages. */
export function SkeletonCard() {
  return (
    <div className="card-stitch p-5 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3.5 w-1/3" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  )
}

/** Grid of skeleton cards for list pages (projects, skills, etc.) while the initial fetch is in flight. */
export function SkeletonList({ count = 4, className = 'grid grid-cols-1 md:grid-cols-2 gap-4' }: { count?: number; className?: string }) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/** Table-row skeleton for table-based list pages (skills, etc.) while the initial fetch is in flight. */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-canvas border border-hairline rounded-[18px] overflow-hidden" aria-busy="true" aria-label="Loading">
      <div className="divide-y divide-hairline">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }, (_, c) => (
              <Skeleton key={c} className={`h-3.5 ${c === 0 ? 'w-1/4' : 'flex-1 max-w-[140px]'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Placeholder for a single form/detail card, e.g. the Profile page while it loads. */
export function SkeletonForm({ fields = 6 }: { fields?: number }) {
  return (
    <div className="card-stitch p-6 max-w-2xl space-y-4" aria-busy="true" aria-label="Loading">
      <div className="flex items-center gap-4">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-full rounded-[11px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
