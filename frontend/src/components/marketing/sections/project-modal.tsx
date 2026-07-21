'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import type { FeaturedProject } from '@/lib/marketing/content'
import { ProjectMockup } from './project-mockup'
import { GithubIcon } from '../icons/brand-icons'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ProjectModal({
  project,
  onClose,
}: {
  project: FeaturedProject | null
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!project) return
    lastFocused.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 20)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      window.clearTimeout(focusTimer)
      lastFocused.current?.focus()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-[rgba(6,9,18,0.55)] p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-title"
            className="w-[min(620px,100%)] max-h-[88vh] overflow-auto rounded-[22px] border border-mk-hairline bg-mk-surface shadow-mk-lg"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[16/9]">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={`${project.title} preview`}
                  fill
                  sizes="620px"
                  className="object-cover"
                />
              ) : (
                <ProjectMockup motif={project.motif} />
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-[10px] bg-mk-surface/90 text-mk-ink shadow-mk-sm transition-colors hover:bg-mk-surface"
              >
                <X className="size-[18px]" aria-hidden />
              </button>
            </div>

            <div className="p-7">
              <span className="font-mk-mono text-[0.72rem] uppercase tracking-[0.18em] text-mk-accent">
                Case study
              </span>
              <h3 id="pm-title" className="mt-3 text-[1.5rem] font-extrabold tracking-[-0.02em]">
                {project.title}
              </h3>
              <p className="mt-3.5 text-mk-muted">{project.detail}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-mk-subtle px-2.5 py-1 font-mk-mono text-[0.74rem] text-mk-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={project.demoUrl}
                  className="inline-flex items-center gap-2 rounded-[14px] bg-mk-brand px-6 py-3 text-[0.95rem] font-semibold text-mk-on-brand shadow-mk-brand transition-colors hover:bg-mk-brand-strong"
                >
                  Live demo
                  <ExternalLink className="size-[17px]" aria-hidden />
                </a>
                <a
                  href={project.repoUrl}
                  className="inline-flex items-center gap-2 rounded-[14px] border border-mk-hairline bg-mk-surface px-6 py-3 text-[0.95rem] font-semibold text-mk-ink shadow-mk-sm transition-colors hover:border-mk-brand-soft"
                >
                  <GithubIcon className="size-[17px]" />
                  Source
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
