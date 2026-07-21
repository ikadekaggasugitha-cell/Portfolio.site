import type { Metadata } from 'next'
import './globals.css'

// Every public route now lives in the app/(site) group (its layout renders the
// V2 MarketingShell) and admin routes render their own layout — so the root
// layout no longer needs the legacy RootShell/Header/Footer.
const siteUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'I Kadek Agga Sugitha — IT Programmer',
  description: 'Personal portfolio showcasing projects, skills and experience across web, backend, data and automation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
