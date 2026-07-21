import { contactDefaults, type ContactData } from '@/lib/marketing/content'
import { Container } from '../primitives/container'
import { Eyebrow } from '../primitives/eyebrow'
import { Reveal } from '../primitives/reveal'
import { HeroBackdrop } from './hero-backdrop'

/** Hero for the dedicated /contact page: headline, availability + location + email. */
export function ContactHero({ available, location, email }: ContactData = contactDefaults) {
  return (
    <section className="relative overflow-hidden pb-[clamp(32px,5vw,56px)] pt-[clamp(48px,7vw,88px)]">
      <HeroBackdrop />
      <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative z-[2]">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal>
            <Eyebrow className="justify-center">Contact</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-[18px] text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
              Let&apos;s build something <span className="mk-grad-text">great together</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-[52ch] text-[clamp(1.05rem,1.6vw,1.2rem)] text-mk-muted">
              Have a project, role or idea in mind? Tell me about it below — I usually reply within a day.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
              {available && (
                <span className="inline-flex items-center gap-2 rounded-full border border-mk-hairline bg-mk-surface px-3.5 py-1.5 font-mk-mono text-[0.72rem] tracking-[0.06em] text-mk-muted shadow-mk-sm">
                  <span className="size-2 rounded-full bg-mk-amber" />
                  AVAILABLE FOR WORK
                </span>
              )}
              <span className="font-mk-mono text-[0.78rem] text-mk-faint">{location}</span>
              <a href={`mailto:${email}`} className="font-mk-mono text-[0.82rem] font-medium text-mk-accent transition-opacity hover:opacity-80">
                {email}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
