import { cn } from '@/lib/utils'

/** Mono, uppercase section label. */
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
        'inline-flex items-center font-mk-mono text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mk-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}
