'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideShell = pathname?.startsWith('/admin')

  return (
    <>
      {!hideShell && <Header />}
      <main className="flex-1">{children}</main>
      {!hideShell && <Footer />}
    </>
  )
}
