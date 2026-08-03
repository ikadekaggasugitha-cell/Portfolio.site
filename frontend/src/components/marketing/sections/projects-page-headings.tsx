'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useTranslation } from '../theme/language-provider'
import { SectionHeading } from '../primitives/section-heading'

/**
 * Client-side projects page heading that reads from translations.
 * Used by the /projects page (a Server Component) to render translated text.
 */
export function ProjectsPageHeading() {
  const { t } = useTranslation()
  return (
    <SectionHeading
      eyebrow={t.projectsPage.eyebrow}
      title={t.projectsPage.title}
      titleAccent={t.projectsPage.titleAccent}
      subtitle={t.projectsPage.subtitle}
      align="center"
    />
  )
}

/**
 * Empty-state card shown when no projects match the current filters.
 * Client component so it can read translated strings.
 */
export function ProjectsEmptyState({ hasFilters }: { hasFilters: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-[440px] rounded-mk border border-dashed border-mk-hairline bg-mk-surface/60 px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-mk-brand/10 text-mk-accent">
        <Search className="size-5" aria-hidden />
      </div>
      <p className="font-semibold">
        {hasFilters ? t.projectsPage.noMatch : t.projectsPage.noPublished}
      </p>
      <p className="mt-1.5 text-[0.92rem] text-mk-muted">
        {hasFilters ? t.projectsPage.tryDifferent : t.projectsPage.checkBack}
      </p>
      {hasFilters && (
        <Link
          href="/projects"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-mk-hairline bg-mk-surface px-4 py-2 text-[0.88rem] font-semibold transition-colors hover:border-mk-brand-soft"
        >
          {t.projectsPage.clearFilters}
        </Link>
      )}
    </div>
  )
}
