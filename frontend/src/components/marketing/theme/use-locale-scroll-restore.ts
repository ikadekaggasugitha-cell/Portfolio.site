'use client'

import { useEffect } from 'react'

/**
 * Anchor-aware scroll preservation across locale switches.
 *
 * A locale toggle swaps every string on the page, so blocks above the reading
 * position change height. Keeping the raw pixel offset (the default with
 * `scroll: false`) can land the reader visibly off-section. Instead, right
 * before navigating we remember the nearest `<section id>` at/above the
 * viewport plus the pixels scrolled into it; once the same route under the
 * other prefix renders, `useLocaleScrollRestore` re-docks that section.
 *
 * Streaming complicates restoration: live sections resolve out of <Suspense>
 * after navigation commits, shifting everything below them. A short-lived
 * ResizeObserver on the document re-docks the anchor until heights settle or
 * the window expires. A manual scroll cancels correction so the mechanism
 * never fights the reader. Positions are measured via offsetTop chains, which
 * ignore the transform-based page transition (getBoundingClientRect would not).
 */

interface ScrollAnchor {
  anchorId: string
  /** Pixels scrolled past the anchor section's top edge. */
  offset: number
  /** Full pathname (with locale prefix) the restore applies to. */
  targetPath: string
}

/** Lives outside React on purpose: written by the click handler, read by the
 * effect that runs after navigation. Holds at most one in-flight toggle. */
let pendingAnchor: ScrollAnchor | null = null

/** How far below the viewport top a section edge may sit and still count as
 * the one being read (~ sticky navbar + scroll margin). */
const ACTIVE_THRESHOLD_PX = 100

/** Upper bound on post-navigation stream corrections. */
const SETTLE_TIMEOUT_MS = 2000

/** Scroll drift beyond this during settle means the user took over. */
const TAKEOVER_PX = 4

/** Layout-based absolute top — immune to transforms used by PageTransition. */
function absoluteTop(el: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

/**
 * Snapshot the reader's position relative to the nearest section. Call in the
 * same tick as the locale push, while the old DOM is still mounted. When no
 * section qualifies (top of page, footer-only view) nothing is recorded and
 * the switch falls back to plain pixel retention.
 */
export function captureLocaleScrollAnchor(targetPath: string): void {
  const scrollY = window.scrollY
  let anchor: HTMLElement | null = null
  for (const el of document.querySelectorAll<HTMLElement>('main section[id]')) {
    if (absoluteTop(el) <= scrollY + ACTIVE_THRESHOLD_PX) anchor = el
    else break
  }
  pendingAnchor = anchor
    ? { anchorId: anchor.id, offset: Math.max(0, scrollY - absoluteTop(anchor)), targetPath }
    : null
}

/**
 * Re-dock the captured anchor after a locale navigation commits. No-op for
 * every pathname change except the one recorded by captureLocaleScrollAnchor,
 * so back/forward and normal links are untouched.
 */
export function useLocaleScrollRestore(pathname: string): void {
  useEffect(() => {
    if (!pendingAnchor || pendingAnchor.targetPath !== pathname) return
    const { anchorId, offset } = pendingAnchor
    pendingAnchor = null

    let expectedY = Number.NaN
    let frame = 0
    let timer = 0
    let observer: ResizeObserver | null = null
    let cancelled = false

    const stop = () => {
      observer?.disconnect()
      observer = null
      window.clearTimeout(timer)
    }

    const dock = (): boolean => {
      const el = document.getElementById(anchorId)
      if (!el) return false
      // Clamp into the section's new extent: shorter translated copy must not
      // drag the viewport past its bottom edge.
      const slack = Math.max(0, el.offsetHeight - window.innerHeight)
      const y = absoluteTop(el) + Math.min(offset, slack)
      if (Math.abs(window.scrollY - y) > 1) {
        expectedY = y
        window.scrollTo({ top: y, behavior: 'auto' })
      } else {
        expectedY = window.scrollY
      }
      return true
    }

    // Wait one frame: the route has committed, but the keyed page transition
    // mounts its content in this same tick.
    frame = requestAnimationFrame(() => {
      if (cancelled || !dock()) return
      observer = new ResizeObserver(() => {
        if (!observer) return
        if (Math.abs(window.scrollY - expectedY) > TAKEOVER_PX) {
          stop()
          return
        }
        dock()
      })
      observer.observe(document.documentElement)
      timer = window.setTimeout(stop, SETTLE_TIMEOUT_MS)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      stop()
    }
  }, [pathname])
}
