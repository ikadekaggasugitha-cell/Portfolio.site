import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, LOCALES } from '@/lib/marketing/i18n'
import '../globals.css'

/**
 * Root layout for the public, locale-prefixed site (/id/... and /en/...).
 *
 * It owns <html> so `lang` is correct from the server render on — no flash of
 * the wrong language, no post-hydration patching. Admin keeps its own root
 * layout (multiple root layouts pattern), so nothing here can affect it.
 */

const siteUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale}>
      <body className="antialiased flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
