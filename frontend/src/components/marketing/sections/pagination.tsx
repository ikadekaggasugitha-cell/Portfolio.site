import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PageMeta } from '@/lib/marketing/api.server'
import { cn } from '@/lib/utils'

/** Server-rendered numbered pagination that preserves the active search/tag. */
export function Pagination({
  meta,
  search,
  technology,
}: {
  meta: PageMeta
  search: string
  technology: string
}) {
  if (meta.last_page <= 1) return null

  const href = (page: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (technology) params.set('tech', technology)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `/projects?${qs}` : '/projects'
  }

  const { current_page: current, last_page: last } = meta
  const cell = 'grid size-10 place-items-center rounded-xl border text-[0.9rem] font-medium tabular-nums transition-colors'
  const idle = 'border-mk-hairline bg-mk-surface text-mk-muted hover:border-mk-brand-soft hover:text-mk-ink'
  const disabled = 'cursor-not-allowed border-mk-hairline/60 text-mk-faint/50'

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {current > 1 ? (
        <Link href={href(current - 1)} aria-label="Previous page" className={cn(cell, idle)}>
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span aria-hidden className={cn(cell, disabled)}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageRange(current, last).map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="px-1 text-mk-faint" aria-hidden>…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            className={cn(cell, p === current ? 'border-transparent bg-mk-brand text-mk-on-brand' : idle)}
          >
            {p}
          </Link>
        ),
      )}

      {current < last ? (
        <Link href={href(current + 1)} aria-label="Next page" className={cn(cell, idle)}>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span aria-hidden className={cn(cell, disabled)}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}

/** Compact page list: 1 … (current-1, current, current+1) … last */
function pageRange(current: number, last: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < last - 1) pages.push('ellipsis')
  if (last > 1) pages.push(last)
  return pages
}
