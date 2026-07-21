import { cn } from '@/lib/utils'

/**
 * Mono, uppercase section label with a leading rule. The optional `index`
 * is only used where the sections form a real read-order sequence.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-mk-mono text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mk-accent',
        className,
      )}
    >
      <span aria-hidden className="h-px w-[18px] bg-current opacity-60" />
      {children}
    </span>
  )
}
