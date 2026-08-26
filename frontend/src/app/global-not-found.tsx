import Link from 'next/link'
import { translations } from '@/lib/marketing/translations'

/**
 * Global 404 document (experimental.globalNotFound).
 *
 * This app has two root layouts — public /[locale] and /admin — so there is no
 * root layout to host a not-found boundary, and this file renders the whole
 * document itself. Because it sits OUTSIDE the [locale] segment, the locale is
 * not available as a param; instead both languages are rendered and the inline
 * script pins <html lang> to the URL's locale before first paint. CSS :lang
 * rules then reveal exactly one variant — zero flash, no JS dependency.
 */

const copy = {
  id: translations.id.notFoundPage,
  en: translations.en.notFoundPage,
}

const style = `
  .gnf { display: none; min-height: 100vh; flex-direction: column; align-items: center;
         justify-content: center; text-align: center; padding: 64px 24px;
         font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
  html:lang(id) .gnf-id { display: flex; }
  html:lang(en) .gnf-en { display: flex; }
  .gnf-code { margin: 0 0 12px; font-family: ui-monospace, monospace; font-size: 13px;
              letter-spacing: .14em; color: #6366f1; }
  .gnf-title { margin: 0; font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800;
               letter-spacing: -0.02em; color: #111827; }
  .gnf-body { margin: 12px 0 0; max-width: 46ch; font-size: 1rem; line-height: 1.6;
              color: #5b6472; }
  .gnf-link { display: inline-block; margin-top: 32px; padding: 14px 28px;
              border-radius: 14px; background: #2563eb; color: #fff; font-weight: 600;
              font-size: 1rem; text-decoration: none; }
  .gnf-link:hover { background: #1d4ed8; }
`

function Panel({ locale }: { locale: 'id' | 'en' }) {
  const t = copy[locale]
  return (
    <div className={`gnf gnf-${locale}`} lang={locale}>
      <p className="gnf-code" aria-hidden>
        404
      </p>
      <h1 className="gnf-title">{t.title}</h1>
      <p className="gnf-body">{t.body}</p>
      <Link href={`/${locale}`} className="gnf-link">
        {t.backHome}
      </Link>
    </div>
  )
}

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <head>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        {/* Runs before first paint: pins the document language to the URL's
            locale segment so the matching panel becomes visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.lang=location.pathname.split('/')[1]==='en'?'en':'id'",
          }}
        />
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0 }}>
        <Panel locale="id" />
        <Panel locale="en" />
      </body>
    </html>
  )
}
