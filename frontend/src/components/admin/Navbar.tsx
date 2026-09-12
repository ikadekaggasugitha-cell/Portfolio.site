'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="navbar-stitch bg-canvas border-b border-hairline px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid size-9 flex-none place-items-center rounded-[8px] text-ink transition-colors hover:bg-white/10 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h2 className="truncate text-sm font-semibold tracking-[-0.12px] text-ink">
          Admin Panel
        </h2>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-4">
        <ThemeToggle />
        <span className="hidden text-xs tracking-[-0.12px] text-ink sm:inline">
          {user?.name}
        </span>
        <button
          onClick={logout}
          className="btn-stitch btn-primary text-xs tracking-[-0.12px] transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
