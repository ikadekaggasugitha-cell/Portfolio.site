'use client'

import { Mail } from 'lucide-react'
import { site } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Container } from '../primitives/container'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'
import { Logo } from './logo'

const social = 'grid size-[42px] place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted shadow-mk-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:text-mk-ink'

const isLive = (href: string | undefined) => Boolean(href && href !== '#')

/**
 * Single-band footer: brand + one-line description on the left, social icons
 * on the right, copyright underneath. Route links live in the always-visible
 * navbar and the CV lives in the hero, so the footer repeats neither.
 */
export interface FooterLinks {
  githubUrl?: string
  linkedinUrl?: string
  email?: string
}

/** Falls back to the static `site` defaults when no live profile data is passed. */
export function Footer({ githubUrl = site.githubUrl, linkedinUrl = site.linkedinUrl, email = site.email }: FooterLinks = {}) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-mk-hairline bg-mk-surface pb-8 pt-[clamp(40px,5vw,64px)]">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
            <Logo href="#top" textClassName="text-xl md:text-2xl" />
            <p className="max-w-[46ch] text-[0.92rem] leading-relaxed text-mk-muted md:border-l md:border-mk-hairline md:pl-5">
              {t.footer.description}
            </p>
          </div>
          <div className="flex gap-2.5">
            {isLive(githubUrl) && (
              <a href={githubUrl} aria-label="GitHub" className={social}>
                <GithubIcon className="size-[19px]" />
              </a>
            )}
            {isLive(linkedinUrl) && (
              <a href={linkedinUrl} aria-label="LinkedIn" className={social}>
                <LinkedinIcon className="size-[19px]" />
              </a>
            )}
            <a href={`mailto:${email}`} aria-label="Email" className={social}>
              <Mail className="size-[19px]" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-mk-hairline pt-6 text-[0.85rem] text-mk-faint">
          <p>© {year} {site.name}. {t.footer.allRightsReserved}</p>
        </div>
      </Container>
    </footer>
  )
}
