'use client'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/admin/Sidebar'
import Navbar from '@/components/admin/Navbar'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import '@/styles/stitch_modernized_theme_redesign.css'
import { GlobalLoadingProvider } from '@/components/admin/ui/GlobalLoadingOverlay'
import Spinner from '@/components/admin/ui/Spinner'
import { ThemeProvider, ThemeScript } from '@/components/marketing/theme/theme-provider'

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
        <Spinner className="h-8 w-8 border-2 text-primary" />
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
    <ThemeProvider>
      <ThemeScript />
      <AuthProvider>
        <GlobalLoadingProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--stitch-card, #0e1626)',
                color: 'var(--stitch-text, #dbeafe)',
                border: '1px solid var(--stitch-border, rgba(255,255,255,0.06))',
              },
              success: { iconTheme: { primary: 'var(--stitch-primary, #6ee7b7)', secondary: '#04201a' }, duration: 3000 },
              error: { iconTheme: { primary: 'var(--stitch-danger, #fb7185)', secondary: '#2a0a0f' }, duration: 5000 },
            }}
          />
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
        </GlobalLoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
