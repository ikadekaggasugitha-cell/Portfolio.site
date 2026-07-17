'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Profile', href: '/admin/profile' },
  { label: 'Skills', href: '/admin/skills' },
  { label: 'Experiences', href: '/admin/experiences' },
  { label: 'Educations', href: '/admin/educations' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Certificates', href: '/admin/certificates' },
  { label: 'Messages', href: '/admin/messages' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 sidebar-stitch bg-surface text-ink min-h-screen p-5">
      <div className="text-sm font-semibold tracking-[-0.12px] mb-8 opacity-90">
        Portfolio Admin
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
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
      </nav>
    </aside>
  )
}
