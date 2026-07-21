import { cn } from '@/lib/utils'

/**
 * Shimmering placeholder. Use ONLY while real data is actually loading
 * (e.g. an in-flight API request) — never to fake latency for static content.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('mk-shimmer rounded-lg bg-mk-subtle', className)} aria-hidden />
}
