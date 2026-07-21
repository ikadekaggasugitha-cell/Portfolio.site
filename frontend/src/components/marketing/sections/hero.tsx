'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Download, Mail, Zap } from 'lucide-react'
import { heroDefaults, type HeroData } from '@/lib/marketing/content'
import { Container } from '../primitives/container'
import { Button } from '../primitives/button'
import { HeroBackdrop } from './hero-backdrop'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'
import { staggerItem, staggerParent } from '@/lib/marketing/motion'

const socialClass =
  'grid size-[42px] place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted shadow-mk-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-mk-brand-soft hover:text-mk-ink'

/** First + last initial, for the photo placeholder before one is uploaded. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Hero(props: HeroData = heroDefaults) {
  const { name, role, photo, intro, available, location, githubUrl, linkedinUrl, email, cvUrl, codeStack } = props
  const reduce = useReducedMotion()
  const container = reduce ? {} : { initial: 'hidden', animate: 'show', variants: staggerParent }
  const item = reduce ? {} : { variants: staggerItem }

  return (
    <section className="relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(48px,7vw,88px)]">
      <HeroBackdrop />
      <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0" />

      <Container className="relative z-[2]">
        <div className="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <motion.div className="max-w-[620px]" {...container}>
            {available && (
              <motion.span
                {...item}
                className="inline-flex items-center gap-2.5 rounded-full border border-mk-hairline bg-mk-surface px-3.5 py-[7px] font-mk-mono text-[0.74rem] tracking-[0.06em] text-mk-muted shadow-mk-sm"
              >
                <span className="relative flex size-2">
                  {!reduce && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-mk-amber opacity-70" />
                  )}
                  <span className="relative inline-flex size-2 rounded-full bg-mk-amber" />
                </span>
                AVAILABLE FOR NEW WORK
              </motion.span>
            )}

            <motion.h1
              {...item}
              className="mt-[22px] text-[clamp(2.7rem,6.4vw,4.7rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-balance"
            >
              IT programmer building{' '}
              <span className="mk-grad-text">reliable software</span> — from web apps to backend systems.
            </motion.h1>

            <motion.p {...item} className="mt-5 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.3rem)] text-mk-muted">
              {intro}
            </motion.p>

            <motion.div {...item} className="mt-8 flex flex-wrap gap-3.5">
              <Button href="#work" size="lg">
                View my work
                <ArrowRight className="size-[17px]" aria-hidden />
              </Button>
              <Button href={cvUrl} variant="ghost" size="lg">
                <Download className="size-[17px]" aria-hidden />
                Download CV
              </Button>
            </motion.div>

            <motion.div {...item} className="mt-8 flex gap-2.5">
              <a href={githubUrl} aria-label="GitHub" className={socialClass}>
                <GithubIcon className="size-[19px]" />
              </a>
              <a href={linkedinUrl} aria-label="LinkedIn" className={socialClass}>
                <LinkedinIcon className="size-[19px]" />
              </a>
              <a href={`mailto:${email}`} aria-label="Email" className={socialClass}>
                <Mail className="size-[19px]" aria-hidden />
              </a>
            </motion.div>
          </motion.div>

          {/* Photo + code strip card */}
          <motion.div
            className="relative mx-auto w-full max-w-[420px]"
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div className="overflow-hidden rounded-[24px] border border-mk-hairline bg-mk-surface shadow-mk-lg">
              <div className="relative aspect-[4/3] bg-mk-subtle">
                {photo ? (
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <span className="font-mk-mono text-[clamp(2.6rem,8vw,4rem)] font-bold text-mk-accent/80">
                      {initials(name)}
                    </span>
                  </div>
                )}
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>

              <div className="border-t border-mk-hairline p-[22px]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex gap-1.5">
                    <span className="size-[10px] rounded-full bg-[#FF5F57]" />
                    <span className="size-[10px] rounded-full bg-[#FEBC2E]" />
                    <span className="size-[10px] rounded-full bg-[#28C840]" />
                  </span>
                  <span className="font-mk-mono text-[0.72rem] text-mk-faint">agga.ts</span>
                </div>
                <pre className="overflow-x-auto font-mk-mono text-[0.8rem] leading-[1.85] text-mk-muted">
                  <code>
                    <span className="text-mk-brand-soft">const</span> programmer = {'{'}
                    {'\n'}  role: <span className="text-mk-cyan">&quot;{role}&quot;</span>,
                    {'\n'}  based: <span className="text-mk-cyan">&quot;{location}&quot;</span>,
                    {'\n'}  <span className="text-mk-amber">stack</span>: [
                    {codeStack.map((tech, i) => (
                      <span key={tech}>
                        <span className="text-mk-cyan">&quot;{tech}&quot;</span>
                        {i < codeStack.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    ],
                    {'\n'}  openToWork: <span className="text-mk-brand-soft">{String(available)}</span>
                    {'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-3 flex items-center gap-2.5 rounded-2xl border border-mk-hairline bg-mk-surface px-4 py-3 shadow-mk-md">
              <span className="grid size-[34px] place-items-center rounded-[10px] bg-mk-brand text-mk-on-brand">
                <Zap className="size-[18px]" aria-hidden />
              </span>
              <span className="text-[0.86rem] font-semibold">
                99 / 100
                <span className="block text-[0.72rem] font-normal text-mk-faint">Lighthouse performance</span>
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
