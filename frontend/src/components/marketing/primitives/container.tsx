import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Centered content column with the system's gutter. */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] px-[clamp(20px,5vw,40px)]', className)}>
      {children}
    </div>
  )
}
