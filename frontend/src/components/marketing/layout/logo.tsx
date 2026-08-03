'use client'

import Link from 'next/link'
import { site } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  textClassName?: string
  href?: string
}

export function Logo({ className, textClassName, href = '/' }: LogoProps) {
  const content = (
    <div
      className={cn(
        'group relative inline-flex items-center select-none transition-transform duration-300 ease-out hover:scale-[1.04]',
        className,
      )}
    >
      {/* Soft ambient glow overlay for Dark mode & Hover */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-400/30 opacity-0 blur-md transition-all duration-500 group-hover:opacity-100 dark:opacity-40 dark:group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Main Gradient Text */}
      <span
        className={cn(
          'relative font-mk-sans font-extrabold tracking-[0.2em] uppercase',
          'bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#06B6D4] bg-clip-text text-transparent',
          'dark:from-[#3B82F6] dark:via-[#A855F7] dark:to-[#38BDF8]',
          'transition-all duration-300',
          'group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]',
          'dark:drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] dark:group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.85)]',
          textClassName,
        )}
      >
        {site.shortName}
      </span>
    </div>
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
