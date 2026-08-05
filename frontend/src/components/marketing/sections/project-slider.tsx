'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectMotif } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'
import { ProjectMockup } from './project-mockup'

/**
 * Swipeable screenshot slider for a project.
 *
 * Shared by the project detail page and the homepage case-study modal so both behave the
 * same way. Falls back to the stylized mockup when a project has no screenshots, which is
 * the common case for a project that hasn't been photographed yet.
 *
 * Navigation is deliberately redundant — arrows, drag/swipe, keyboard and (optionally)
 * thumbnails — because each one covers a different input: pointer, touch, keyboard.
 */

/** How far a drag must travel before it counts as a swipe rather than a stray touch. */
const SWIPE_DISTANCE = 60
/** A short, fast flick should page even when it falls short of SWIPE_DISTANCE. */
const SWIPE_VELOCITY = 300

export function ProjectSlider({
  images,
  title,
  motif,
  showThumbnails = true,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 880px',
  className,
}: {
  images: string[]
  title: string
  motif: ProjectMotif
  showThumbnails?: boolean
  priority?: boolean
  sizes?: string
  className?: string
}) {
  const reduce = useReducedMotion()
  // `direction` only drives which way the incoming slide animates in.
  const [[active, direction], setActive] = useState<[number, number]>([0, 0])
  const count = images.length

  const paginate = useCallback(
    (step: number) => {
      if (count < 2) return
      // Wrap around: from the last image, "next" returns to the first.
      setActive(([current]) => [(current + step + count) % count, step])
    },
    [count],
  )

  const goTo = useCallback(
    (index: number) => setActive(([current]) => [index, index > current ? 1 : -1]),
    [],
  )

  // Arrow keys page the slider whenever it holds focus.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      paginate(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      paginate(1)
    }
  }

  // A project can lose images while this is mounted (admin delete + revalidate).
  useEffect(() => {
    setActive(([current]) => (current > count - 1 ? [0, 0] : [current, 0]))
  }, [count])

  if (count === 0) {
    return (
      <div
        className={cn(
          'relative aspect-[16/9] overflow-hidden rounded-mk border border-mk-hairline shadow-mk-md',
          className,
        )}
      >
        <ProjectMockup motif={motif} />
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="group relative aspect-[16/9] overflow-hidden rounded-mk border border-mk-hairline bg-mk-subtle shadow-mk-md focus:outline-none focus-visible:ring-2 focus-visible:ring-mk-brand"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? '100%' : '-100%' }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? '-100%' : '100%' }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              const { offset, velocity } = info
              if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) paginate(1)
              else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) paginate(-1)
            }}
          >
            <Image
              src={images[active]}
              alt={`${title} — screenshot ${active + 1} of ${count}`}
              fill
              sizes={sizes}
              priority={priority && active === 0}
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            {/* Always reachable, but only fully opaque on hover/focus so they don't
                compete with the screenshot itself. */}
            <SliderButton side="left" onClick={() => paginate(-1)} label="Previous screenshot" />
            <SliderButton side="right" onClick={() => paginate(1)} label="Next screenshot" />

            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-mk-canvas/75 px-2.5 py-1 font-mk-mono text-[0.72rem] tabular-nums text-mk-ink backdrop-blur-sm">
              {active + 1} / {count}
            </div>

            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((img, i) => (
                <button
                  key={`${img}-dot-${i}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === active ? 'w-5 bg-mk-brand' : 'w-1.5 bg-mk-canvas/70 hover:bg-mk-canvas',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Screen readers get the position without hearing the whole strip re-announced. */}
      <span aria-live="polite" className="sr-only">
        Screenshot {active + 1} of {count}
      </span>

      {showThumbnails && count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img}-thumb-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative aspect-[16/10] w-24 flex-none overflow-hidden rounded-lg border-2 transition-colors',
                i === active ? 'border-mk-brand' : 'border-mk-hairline hover:border-mk-brand-soft',
              )}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SliderButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right'
  onClick: () => void
  label: string
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full',
        'bg-mk-canvas/85 text-mk-ink shadow-mk-sm backdrop-blur-sm transition-all',
        'hover:bg-mk-canvas focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-brand',
        // Hidden until hover on pointer devices; always visible on touch, where there is
        // no hover state to reveal them.
        'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  )
}
