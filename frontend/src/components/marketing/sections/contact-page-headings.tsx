'use client'

import { useTranslation } from '../theme/language-provider'
import { SectionHeading } from '../primitives/section-heading'

/**
 * Client-side FAQ section heading that reads from translations.
 * Used by the /contact page (a Server Component) to render translated text.
 */
export function ContactFaqHeading() {
  const { t } = useTranslation()
  return (
    <SectionHeading
      eyebrow={t.contactFaq.eyebrow}
      title={t.contactFaq.title}
      align="center"
      className="mb-[clamp(32px,5vw,56px)]"
    />
  )
}
