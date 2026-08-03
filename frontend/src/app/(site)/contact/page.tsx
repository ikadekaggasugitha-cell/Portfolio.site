import type { Metadata } from 'next'
import { serializeJsonLd } from '@/lib/json-ld'
import { getFaqs, getProfile, soften } from '@/lib/marketing/api.server'
import { liveOrFallback, mapContact, mapFaqs } from '@/lib/marketing/mappers'
import { faqs as faqDefaults, site } from '@/lib/marketing/content'
import { Section } from '@/components/marketing/primitives/section'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { ContactHero } from '@/components/marketing/sections/contact-hero'
import { ContactChannels } from '@/components/marketing/sections/contact-channels'
import { ContactForm } from '@/components/marketing/sections/contact-form'
import { ContactFaq } from '@/components/marketing/sections/contact-faq'
import { ContactCtaBand } from '@/components/marketing/sections/cta-band'
import { ContactFaqHeading } from '@/components/marketing/sections/contact-page-headings'

const DESCRIPTION =
  'Get in touch with I Kadek Agga Sugitha — available for IT programming roles, freelance projects and collaborations across web, backend and automation. Usually replies within a day.'

/**
 * Bounded regeneration window. Without an explicit segment value the route inherits its
 * revalidate from whichever tagged fetches happened to succeed, which makes the window
 * depend on backend health at build time. Admin saves purge this instantly through
 * /api/revalidate; this is just the floor.
 */
export const revalidate = 600

/** Worst-case data fetch is FETCH_TIMEOUT_MS x FETCH_ATTEMPTS (~40s) against a slow PHP
 *  backend; declare headroom so the platform can't kill the render mid-flight and leave
 *  nothing cached. */
export const maxDuration = 60

export async function generateMetadata(): Promise<Metadata> {
  // softened: metadata is not worth failing the whole route over, and a throw here
  // bypasses error.tsx entirely.
  const { data: profile } = await soften(getProfile(), null)
  const name = profile?.name?.trim() || site.name
  const title = `Contact · ${name}`
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: '/contact' },
    openGraph: { type: 'website', title, description: DESCRIPTION, siteName: name },
    twitter: { card: 'summary_large_image', title, description: DESCRIPTION },
  }
}

function ContactJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact · ${site.name}`,
    description: DESCRIPTION,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(json) }} />
}

export default async function ContactPage() {
  const [{ data: profile }, { ok: faqsOk, data: faqRecords }] = await Promise.all([
    getProfile(),
    getFaqs(),
  ])
  const data = mapContact(profile)
  const faqs = liveOrFallback(mapFaqs(faqRecords), faqsOk, faqDefaults)

  return (
    <>
      <ContactJsonLd />
      <ContactHero {...data} />

      <Section id="get-in-touch" tone="subtle">
        <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <ContactChannels {...data} />
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section id="faq">
          <ContactFaqHeading />
          <ContactFaq faqs={faqs} />
        </Section>
      )}

      <ContactCtaBand email={data.email} />
    </>
  )
}
