import type { Variants, Transition } from 'framer-motion'

/**
 * Shared Framer Motion variants and easings for the marketing system.
 * All motion is GPU-friendly (opacity + transform only) and every consumer
 * pairs these with `useReducedMotion()` so reduced-motion users get no travel.
 */

export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]
export const EASE: Transition['ease'] = [0.22, 0.61, 0.36, 1]

/** Fade + rise. Use with whileInView / animate. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
}

/** Fade only (no travel) — for reduced-motion or subtle reveals. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
}

/** Parent that staggers its children on reveal. */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

/** Child item for a staggerParent. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/** Default viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, margin: '0px 0px -10% 0px' } as const
