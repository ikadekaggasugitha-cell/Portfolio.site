'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost'
type Size = 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
}

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold ' +
  'transition-[background-color,border-color,box-shadow,color] duration-200 ' +
  'disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-mk-brand text-mk-on-brand shadow-mk-brand hover:bg-mk-brand-strong',
  ghost: 'border border-mk-hairline bg-mk-surface text-mk-ink shadow-mk-sm hover:border-mk-brand-soft',
}

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-7 py-3.5 text-base',
}

/** Hash, absolute URLs and mailto links use a plain <a>; route paths use next/link. */
function isPlainAnchor(href: string) {
  return href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')
}

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  onClick,
  disabled,
  ariaLabel,
}: ButtonProps) {
  const reduce = useReducedMotion()
  const classes = cn(base, variants[variant], sizes[size], className)
  const hover = reduce ? undefined : { y: -2 }
  const tap = reduce ? undefined : { scale: 0.98 }

  if (href) {
    // Animate the element that actually renders a box (a `display:contents`
    // wrapper would swallow the transform), so the hover-lift is visible.
    if (isPlainAnchor(href)) {
      return (
        <motion.a
          href={href}
          aria-label={ariaLabel}
          onClick={onClick}
          className={classes}
          whileHover={hover}
          whileTap={tap}
        >
          {children}
        </motion.a>
      )
    }
    return (
      <motion.span className="inline-flex" whileHover={hover} whileTap={tap}>
        <Link href={href} aria-label={ariaLabel} className={classes} onClick={onClick}>
          {children}
        </Link>
      </motion.span>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : hover}
      whileTap={disabled ? undefined : tap}
      className={classes}
    >
      {children}
    </motion.button>
  )
}
