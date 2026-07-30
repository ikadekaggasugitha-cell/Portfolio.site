'use client'

import { useEffect } from 'react'
import { Section } from '@/components/marketing/primitives/section'
import { Button } from '@/components/marketing/primitives/button'

/**
 * Shown when a public page cannot be rendered — in practice, when the portfolio API is
 * unreachable and there is no cached version of this route to fall back on.
 *
 * The data layer deliberately throws rather than substituting placeholder content, so
 * pages that *do* have a cached version keep serving it and only genuinely uncacheable
 * routes land here. An honest "try again" beats publishing content nobody entered.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[site] render failed', error)
  }, [error])

  return (
    <Section>
      <div className="mx-auto max-w-[480px] py-16 text-center">
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-extrabold tracking-[-0.02em]">
          This page is taking a break
        </h1>
        <p className="mt-3 text-mk-muted">
          We couldn&apos;t load the latest content just now. It&apos;s usually back within a moment.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="ghost">
            Go home
          </Button>
        </div>
      </div>
    </Section>
  )
}
