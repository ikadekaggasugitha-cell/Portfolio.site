'use client'

import { Mail } from 'lucide-react'
import { navItems, site } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { Container } from '../primitives/container'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'

const social = 'grid size-[42px] place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted shadow-mk-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:text-mk-ink'

const isLive = (href: string | undefined) => Boolean(href && href !== '#')

/** Map each nav href to the key used in translations.nav */
const navLabelKey: Record<string, 'home' | 'about' | 'projects' | 'contact'> = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/contact': 'contact',
}

export interface FooterLinks {
  githubUrl?: string
  linkedinUrl?: string
  email?: string
  cvUrl?: string
}

/** Falls back to the static `site` defaults when no live profile data is passed. */
export function Footer({ githubUrl = site.githubUrl, linkedinUrl = site.linkedinUrl, email = site.email, cvUrl = site.cvUrl }: FooterLinks = {}) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const elsewhereLinks = [
    isLive(githubUrl) && { label: 'GitHub', href: githubUrl! },
    isLive(linkedinUrl) && { label: 'LinkedIn', href: linkedinUrl! },
    { label: 'Email', href: `mailto:${email}` },
    isLive(cvUrl) && { label: t.footer.downloadCv, href: cvUrl! },
  ].filter((link): link is { label: string; href: string } => Boolean(link))

  const translatedNavItems = navItems.map((item) => ({
    label: navLabelKey[item.href] ? t.nav[navLabelKey[item.href]] : item.label,
    href: item.href,
  }))

  return (
    <footer className="border-t border-mk-hairline bg-mk-surface pb-8 pt-[clamp(52px,7vw,84px)]">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-mk-mono text-2xl font-bold text-mk-ink">
              &lt;<span className="text-mk-accent">{site.shortName}</span>/&gt;
            </a>
            <p className="mt-4 max-w-[40ch] text-[0.96rem] text-mk-muted">
              {t.footer.description}
            </p>
            <div className="mt-5 flex gap-2.5">
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

          <FooterCol
            title={t.footer.navigate}
            links={translatedNavItems}
          />
          <FooterCol title={t.footer.elsewhere} links={elsewhereLinks} />
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-3 border-t border-mk-hairline pt-6 text-[0.85rem] text-mk-faint">
          <p>© {year} {site.name}. {t.footer.allRightsReserved}</p>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-4 font-mk-mono text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-mk-faint">
        {title}
      </h3>
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="inline-block py-1 text-[0.95rem] text-mk-muted transition-colors hover:text-mk-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
