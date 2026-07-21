'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Counts up to `target` once the element scrolls into view.
 * rAF-driven (cubic ease-out), and instant for reduced-motion users.
 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  durationMs = 1500,
) {
  const ref = useRef<T>(null)
  const [value, setValue] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      setValue(target)
      return
    }

    let raf = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || started) return
        started = true
        observer.disconnect()

        let startTs = 0
        const tick = (ts: number) => {
          if (!startTs) startTs = ts
          const progress = Math.min((ts - startTs) / durationMs, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * target))
          if (progress < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, durationMs, reduce])

  return { ref, value }
}
