'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

/** Grouped so the homepage copy sections don't get lost among the CV-style records.
 *  Pages and Media existed as routes but were never linked here. */
const navGroups = [
  {
    label: null,
    items: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Profile', href: '/admin/profile' },
    ],
  },
  {
    label: 'Homepage content',
    items: [
      { label: 'Stats', href: '/admin/stats' },
      { label: 'What I Do', href: '/admin/capabilities' },
      { label: 'Testimonials', href: '/admin/testimonials' },
      { label: 'FAQ', href: '/admin/faqs' },
    ],
  },
  {
    label: 'Records',
    items: [
      { label: 'Skills', href: '/admin/skills' },
      { label: 'Experiences', href: '/admin/experiences' },
      { label: 'Educations', href: '/admin/educations' },
      { label: 'Projects', href: '/admin/projects' },
      { label: 'Certificates', href: '/admin/certificates' },
    ],
  },
  {
    label: 'Library',
    items: [
      { label: 'Pages', href: '/admin/pages' },
      { label: 'Media', href: '/admin/media' },
      { label: 'Messages', href: '/admin/messages' },
    ],
  },
]

export default function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`sidebar-stitch bg-surface text-ink fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto p-5 transition-transform duration-300 ease-out lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-[-0.12px] opacity-90">
          Portfolio Admin
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-8 place-items-center rounded-[8px] text-body-on-dark opacity-70 transition-colors hover:bg-white/10 hover:opacity-100 lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>
      <nav className="space-y-5">
        {navGroups.map((group, i) => (
          <div key={group.label ?? `group-${i}`} className="space-y-1">
            {group.label && (
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-body-on-dark opacity-40">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[-0.12px] rounded-[8px] transition-colors ${
                    isActive
                      ? 'bg-primary text-body-on-dark'
                      : 'text-body-on-dark opacity-70 hover:opacity-100 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
