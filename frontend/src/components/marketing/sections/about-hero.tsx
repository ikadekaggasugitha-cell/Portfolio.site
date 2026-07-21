import Image from 'next/image'
import { Mail } from 'lucide-react'
import { aboutHeroDefaults, type AboutHeroData } from '@/lib/marketing/content'
import { Container } from '../primitives/container'
import { Eyebrow } from '../primitives/eyebrow'
import { Reveal } from '../primitives/reveal'
import { Button } from '../primitives/button'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'
import { HeroBackdrop } from './hero-backdrop'

const socialClass =
  'grid size-[42px] place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted shadow-mk-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-mk-brand-soft hover:text-mk-ink'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function AboutHero(props: AboutHeroData = aboutHeroDefaults) {
  const { name, role, bio, photo, available, location, githubUrl, linkedinUrl, email, cvUrl } = props

  return (
    <section className="relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(48px,7vw,88px)]">
      <HeroBackdrop />
      <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative z-[2]">
        <div className="grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.35fr_1fr]">
          <div className="max-w-[640px]">
            <Reveal>
              <Eyebrow>About me</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-[18px] text-[clamp(2.4rem,5.2vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
                {name}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 text-[clamp(1.05rem,1.8vw,1.3rem)] font-medium text-mk-accent">{role}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-[54ch] text-[1.05rem] leading-relaxed text-mk-muted">{bio}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {available && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-mk-hairline bg-mk-surface px-3.5 py-1.5 font-mk-mono text-[0.72rem] tracking-[0.06em] text-mk-muted shadow-mk-sm">
                    <span className="size-2 rounded-full bg-mk-amber" />
                    AVAILABLE FOR WORK
                  </span>
                )}
                <span className="font-mk-mono text-[0.78rem] text-mk-faint">{location}</span>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Button href="/contact" size="lg">
                  Get in touch
                  <Mail className="size-[17px]" aria-hidden />
                </Button>
                <div className="flex gap-2.5">
                  <a href={githubUrl} aria-label="GitHub" className={socialClass}>
                    <GithubIcon className="size-[19px]" />
                  </a>
                  <a href={linkedinUrl} aria-label="LinkedIn" className={socialClass}>
                    <LinkedinIcon className="size-[19px]" />
                  </a>
                  <a href={`mailto:${email}`} aria-label="Email" className={socialClass}>
                    <Mail className="size-[19px]" aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Portrait / monogram */}
          <Reveal delay={0.15} className="mx-auto w-full max-w-[360px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-mk-hairline bg-mk-subtle shadow-mk-lg">
              {photo ? (
                <Image src={photo} alt={name} fill sizes="360px" className="object-cover" priority />
              ) : (
                <div className="grid size-full place-items-center">
                  <span className="font-mk-mono text-[clamp(3rem,10vw,5rem)] font-bold text-mk-accent/80">
                    {initials(name)}
                  </span>
                </div>
              )}
              <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10" />
            </div>
            {cvUrl && cvUrl !== '#' && (
              <a
                href={cvUrl}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-mk-hairline bg-mk-surface px-5 py-3 text-[0.92rem] font-semibold text-mk-ink shadow-mk-sm transition-colors hover:border-mk-brand-soft"
              >
                Download résumé
              </a>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
