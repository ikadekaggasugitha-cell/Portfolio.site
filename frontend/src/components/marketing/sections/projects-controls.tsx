'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * URL-driven search + tag filter. Updates the query string (debounced for the
 * search box); the /projects Server Component re-fetches with the new params,
 * so filtering is truly server-side. `useTransition` keeps the current results
 * visible with a pending hint instead of a jarring reload.
 */
export function ProjectsControls({
  tags,
  search,
  technology,
  total,
}: {
  tags: string[]
  search: string
  technology: string
  total: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Sync local input if the URL changes externally (back/forward).
  useEffect(() => {
    setQuery(search)
  }, [search])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const buildUrl = (nextSearch: string, nextTech: string) => {
    const params = new URLSearchParams()
    if (nextSearch.trim()) params.set('search', nextSearch.trim())
    if (nextTech.trim()) params.set('tech', nextTech.trim())
    const qs = params.toString()
    return qs ? `/projects?${qs}` : '/projects'
  }

  const navigate = (url: string) => startTransition(() => router.replace(url, { scroll: false }))

  const onSearchChange = (value: string) => {
    setQuery(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(buildUrl(value, technology)), 350)
  }

  const selectTag = (tag: string | null) => navigate(buildUrl(query, tag ?? ''))
  const clearAll = () => {
    setQuery('')
    navigate('/projects')
  }

  const hasFilters = query.trim() !== '' || technology !== ''

  return (
    <div className="mx-auto mb-10 max-w-[860px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-mk-faint" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by name, description or technology…"
          aria-label="Search projects"
          className="w-full rounded-full border border-mk-hairline bg-mk-surface py-3 pl-12 pr-11 text-[0.96rem] text-mk-ink shadow-mk-sm placeholder:text-mk-faint transition-[border-color,box-shadow] focus:border-mk-brand focus:outline-none focus:ring-4 focus:ring-mk-brand/15"
        />
        {pending && (
          <Loader2 className="absolute right-4 top-1/2 size-[18px] -translate-y-1/2 animate-spin text-mk-accent" aria-hidden />
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 font-mk-mono text-[0.7rem] uppercase tracking-[0.1em] text-mk-faint">
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Filter
          </span>
          <TagChip label="All" active={technology === ''} onClick={() => selectTag(null)} />
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={technology.toLowerCase() === tag.toLowerCase()}
              onClick={() => selectTag(technology.toLowerCase() === tag.toLowerCase() ? null : tag)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 text-[0.85rem] text-mk-faint">
        <span aria-live="polite">
          {total} {total === 1 ? 'project' : 'projects'}
          {hasFilters && ' found'}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 font-medium text-mk-accent transition-opacity hover:opacity-80"
          >
            <X className="size-3.5" aria-hidden />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

function TagChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors',
        active
          ? 'border-transparent bg-mk-brand text-mk-on-brand'
          : 'border-mk-hairline bg-mk-surface text-mk-muted hover:border-mk-brand-soft hover:text-mk-ink',
      )}
    >
      {label}
    </button>
  )
}
