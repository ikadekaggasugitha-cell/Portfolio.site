import { Mail } from 'lucide-react'
import { navItems, site } from '@/lib/marketing/content'
import { Container } from '../primitives/container'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'

const social = 'grid size-[42px] place-items-center rounded-xl border border-mk-hairline bg-mk-surface text-mk-muted shadow-mk-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft hover:text-mk-ink'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-mk-hairline bg-mk-surface pb-8 pt-[clamp(52px,7vw,84px)]">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-mk-mono text-2xl font-bold text-mk-ink">
              &lt;<span className="text-mk-accent">{site.shortName}</span>/&gt;
            </a>
            <p className="mt-4 max-w-[40ch] text-[0.96rem] text-mk-muted">
              IT programmer building reliable software — web, backend and automation — from {site.location}.
            </p>
            <div className="mt-5 flex gap-2.5">
              <a href={site.githubUrl} aria-label="GitHub" className={social}>
                <GithubIcon className="size-[19px]" />
              </a>
              <a href={site.linkedinUrl} aria-label="LinkedIn" className={social}>
                <LinkedinIcon className="size-[19px]" />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email" className={social}>
                <Mail className="size-[19px]" aria-hidden />
              </a>
            </div>
          </div>

          <FooterCol
            title="Navigate"
            links={navItems.map((item) => ({ label: item.label, href: item.href }))}
          />
          <FooterCol
            title="Elsewhere"
            links={[
              { label: 'GitHub', href: site.githubUrl },
              { label: 'LinkedIn', href: site.linkedinUrl },
              { label: 'Email', href: `mailto:${site.email}` },
              { label: 'Download CV', href: site.cvUrl },
            ]}
          />
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-3 border-t border-mk-hairline pt-6 text-[0.85rem] text-mk-faint">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>
            Designed &amp; built with <span className="text-mk-brand-soft">♥</span> in Bali
          </p>
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
