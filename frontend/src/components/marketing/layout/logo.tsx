'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  textClassName?: string
  href?: string
}

export function Logo({ className, textClassName, href = '/' }: LogoProps) {
  const reduce = useReducedMotion()

  const content = (
    <motion.div
      className={cn(
        'group relative inline-flex items-center select-none transition-transform duration-300 ease-out hover:scale-[1.03]',
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: -5, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* Gradient wordmark with a slow, flowing sheen. The glow is applied as a
          text-shaped drop-shadow (follows the glyphs), not a rectangular box. */}
      <motion.span
        className={cn(
          'relative font-mk-sans font-extrabold tracking-[0.2em] uppercase',
          'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#06B6D4] bg-clip-text text-transparent',
          'dark:from-[#3B82F6] dark:via-[#A855F7] dark:to-[#38BDF8]',
          'bg-[length:220%_auto]',
          'drop-shadow-[0_0_10px_rgba(147,51,234,0.18)] dark:drop-shadow-[0_0_14px_rgba(147,51,234,0.32)]',
          'transition-[filter] duration-500',
          'group-hover:drop-shadow-[0_0_18px_rgba(168,85,247,0.55)]',
          'dark:group-hover:drop-shadow-[0_0_24px_rgba(56,189,248,0.8)]',
          textClassName,
        )}
        style={{ backgroundPosition: '0% 50%' }}
        animate={reduce ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={reduce ? undefined : { duration: 9, ease: 'linear', repeat: Infinity }}
      >
        {site.shortName}
      </motion.span>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} aria-label={site.name} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
