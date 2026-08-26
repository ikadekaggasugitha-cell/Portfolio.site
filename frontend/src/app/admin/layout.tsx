import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import '../globals.css'

/**
 * Root layout for /admin — separate from the public [locale] root so each can
 * own its own <html> (multiple root layouts). Admin UI is single-language.
 */
export const metadata: Metadata = {
  title: 'Admin · Portfolio CMS',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased flex min-h-screen flex-col">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}
