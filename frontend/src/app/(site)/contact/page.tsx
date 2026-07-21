import type { Metadata } from 'next'
import { getProfile } from '@/lib/marketing/api.server'
import { mapContact } from '@/lib/marketing/mappers'
import { site } from '@/lib/marketing/content'
import { Section } from '@/components/marketing/primitives/section'
import { SectionHeading } from '@/components/marketing/primitives/section-heading'
import { Reveal } from '@/components/marketing/primitives/reveal'
import { ContactHero } from '@/components/marketing/sections/contact-hero'
import { ContactChannels } from '@/components/marketing/sections/contact-channels'
import { ContactForm } from '@/components/marketing/sections/contact-form'
import { ContactFaq } from '@/components/marketing/sections/contact-faq'
import { CtaBand } from '@/components/marketing/sections/cta-band'

const DESCRIPTION =
  'Get in touch with I Kadek Agga Sugitha — available for IT programming roles, freelance projects and collaborations across web, backend and automation. Usually replies within a day.'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}

export default async function ContactPage() {
  const profile = await getProfile()
  const data = mapContact(profile)

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

      <Section id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked"
          align="center"
          className="mb-[clamp(32px,5vw,56px)]"
        />
        <ContactFaq />
      </Section>

      <CtaBand
        tone="subtle"
        eyebrow="Prefer email?"
        title="Reach me directly"
        subtitle="Not a fan of forms? Drop me a line and I'll get straight back to you."
        buttonLabel="Email me"
        buttonHref={`mailto:${data.email}`}
      />
    </>
  )
}
