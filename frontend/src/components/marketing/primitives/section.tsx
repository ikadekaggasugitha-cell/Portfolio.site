import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

type Tone = 'canvas' | 'subtle'

/** A page section with consistent vertical rhythm and an optional tinted ground. */
export function Section({
  id,
  children,
  tone = 'canvas',
  className,
  containerClassName,
}: {
  id?: string
  children: ReactNode
  tone?: Tone
  className?: string
  containerClassName?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-20 py-[clamp(72px,11vw,132px)]',
        tone === 'subtle' && 'bg-mk-subtle',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
