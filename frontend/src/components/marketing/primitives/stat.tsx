'use client'

import { useCountUp } from '../hooks/use-count-up'

/** Card with a count-up number that animates when scrolled into view. */
export function Stat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const { ref, value: display } = useCountUp<HTMLDivElement>(value)

  return (
    <div
      ref={ref}
      className="rounded-mk-sm border border-mk-hairline bg-mk-surface p-6 shadow-mk-sm"
    >
      <div className="text-[clamp(2rem,3.4vw,2.6rem)] font-extrabold tracking-[-0.03em] tabular-nums leading-none">
        {display}
        <span className="text-mk-accent">{suffix}</span>
      </div>
      <div className="mt-2 font-mk-mono text-[0.72rem] uppercase tracking-[0.1em] text-mk-faint">
        {label}
      </div>
    </div>
  )
}
