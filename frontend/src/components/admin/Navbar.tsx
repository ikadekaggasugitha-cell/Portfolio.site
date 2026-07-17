'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar-stitch bg-canvas border-b border-hairline px-6 py-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold tracking-[-0.12px] text-ink">
        Admin Panel
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-xs tracking-[-0.12px] text-ink">
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
