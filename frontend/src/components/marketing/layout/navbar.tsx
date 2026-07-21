'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems, site } from '@/lib/marketing/content'
import { ThemeToggle } from '../theme/theme-toggle'
import { Button } from '../primitives/button'

/** A nav item is active on its exact route, or on any nested route (e.g. /projects/[id]). */
function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  const activeHref = navItems.find((item) => isActive(pathname, item.href))?.href ?? null

  const moveTo = useCallback((href: string | null) => {
    const el = href ? linkRefs.current[href] : null
    if (!el) {
      setIndicator((s) => ({ ...s, opacity: 0 }))
      return
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
  }, [])

  useEffect(() => {
    moveTo(activeHref)
  }, [activeHref, moveTo])

  useEffect(() => {
    const onResize = () => moveTo(activeHref)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeHref, moveTo])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'mk-glass sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-mk-hairline' : 'border-transparent',
      )}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-5 px-[clamp(20px,5vw,40px)]">
        <Link href="/" className="font-mk-mono text-[1.05rem] font-bold tracking-[-0.01em] text-mk-ink">
          &lt;<span className="text-mk-accent">{site.shortName}</span>/&gt;
        </Link>

        {/* Desktop links + sliding indicator */}
        <div className="relative hidden items-center gap-1 md:flex" onMouseLeave={() => moveTo(activeHref)}>
          <motion.span
            aria-hidden
            className="absolute top-0 h-full rounded-full bg-mk-subtle"
            animate={{ x: indicator.left, width: indicator.width, opacity: indicator.opacity }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
            style={{ left: 0 }}
          />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[item.href] = el
              }}
              onMouseEnter={() => moveTo(item.href)}
              aria-current={activeHref === item.href ? 'page' : undefined}
              className={cn(
                'relative z-10 rounded-full px-4 py-[9px] text-[0.92rem] font-medium transition-colors',
                activeHref === item.href ? 'text-mk-ink' : 'text-mk-muted hover:text-mk-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button href="/contact" size="md" className="px-[18px] py-2.5 text-[0.9rem]">
              Let&apos;s talk
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted transition-colors hover:text-mk-ink md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-t border-mk-hairline bg-mk-canvas md:hidden"
          >
            <div className="flex flex-col gap-1 px-[clamp(20px,5vw,40px)] py-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  className={cn(
                    'border-b border-mk-hairline py-3.5 text-xl font-semibold',
                    activeHref === item.href ? 'text-mk-accent' : 'text-mk-ink',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                <Button href="/contact" size="lg" className="w-full">
                  Let&apos;s talk
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
