import type { Metadata } from 'next'
import './globals.css'
import RootShell from './RootShell'

export const metadata: Metadata = {
  title: 'Portfolio IT',
  description: 'Personal portfolio showcasing projects, skills, and experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  )
}
