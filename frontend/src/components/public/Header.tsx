'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-surface-container-low text-on-surface sticky top-0 z-50 border-b border-outline-variant/20 inner-glow-top">
      <div className="max-w-container-max mx-auto flex items-center justify-between h-11 px-gutter">
        <Link
          href="/"
          className="font-label-sm text-primary-fixed-dim hover:text-primary transition-colors"
        >
          Portfolio
        </Link>

        <nav className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label-sm transition-opacity ${
                  isActive
                    ? 'text-primary-fixed-dim opacity-100'
                    : 'text-on-surface-variant hover:text-primary opacity-70 hover:opacity-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-on-surface-variant hover:text-primary p-1"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {menuOpen ? (
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M2 4.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20">
          <div className="px-gutter py-3 space-y-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-label-sm py-xs transition-opacity ${
                    isActive
                      ? 'text-primary-fixed-dim opacity-100'
                      : 'text-on-surface-variant hover:text-primary opacity-70 hover:opacity-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
