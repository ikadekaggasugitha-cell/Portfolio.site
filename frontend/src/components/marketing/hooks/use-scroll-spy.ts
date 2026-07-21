'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently centered in the viewport.
 * Used to drive the animated navbar indicator.
 */
export function useScrollSpy(ids: string[], rootMargin = '-45% 0px -50% 0px') {
  const [activeId, setActiveId] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin, threshold: 0 },
    )

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootMargin])

  return activeId
}
