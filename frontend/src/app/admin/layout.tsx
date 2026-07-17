'use client'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/admin/Sidebar'
import Navbar from '@/components/admin/Navbar'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import '@/styles/stitch_modernized_theme_redesign.css'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') {
    return null
  }

  return <>{children}</>
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AdminGuard>
        {isLoginPage ? (
          <div className="admin-theme min-h-screen bg-surface flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl">{children}</div>
          </div>
        ) : (
          <div className="admin-theme flex min-h-screen bg-surface">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        )}
      </AdminGuard>
    </AuthProvider>
  )
}
