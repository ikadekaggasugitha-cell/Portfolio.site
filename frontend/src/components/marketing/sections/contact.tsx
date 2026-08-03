'use client'

import { contactDefaults, type ContactData } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'
import { ContactChannels } from './contact-channels'
import { ContactForm } from './contact-form'

/** Landing "Contact" section — composes the shared, reusable contact pieces. */
export function Contact(props: ContactData = contactDefaults) {
  const { t } = useTranslation()

  return (
    <Section id="contact" tone="subtle">
      <SectionHeading
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        titleAccent={t.contact.titleAccent}
        subtitle={t.contact.subtitle}
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />

      <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <ContactChannels {...props} />
        </Reveal>
        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
