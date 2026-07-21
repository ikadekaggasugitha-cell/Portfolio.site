import { contactDefaults, type ContactData } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'
import { ContactChannels } from './contact-channels'
import { ContactForm } from './contact-form'
import { ContactFaq } from './contact-faq'

/** Landing "Contact" section — composes the shared, reusable contact pieces. */
export function Contact(props: ContactData = contactDefaults) {
  return (
    <Section id="contact" tone="subtle">
      <SectionHeading
        eyebrow="07 — Contact"
        title="Let's build something great together"
        titleAccent="great together"
        subtitle="Have a project or role in mind? Send a message — I usually reply within a day."
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

      <div className="mt-[clamp(56px,7vw,88px)]">
        <ContactFaq />
      </div>
    </Section>
  )
}
