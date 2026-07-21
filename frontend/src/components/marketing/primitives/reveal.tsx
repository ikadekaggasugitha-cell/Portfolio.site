'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT, viewportOnce } from '@/lib/marketing/motion'

/**
 * Scroll-triggered fade + rise, once. Reduced-motion users get the content
 * immediately with no travel and no opacity animation.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}
