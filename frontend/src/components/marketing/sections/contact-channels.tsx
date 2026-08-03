'use client'

import type { ReactNode } from 'react'
import { Mail, MapPin } from 'lucide-react'
import type { ContactData } from '@/lib/marketing/content'
import { useTranslation } from '../theme/language-provider'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'

/** Email / GitHub / LinkedIn / location cards. Presentational + reusable. */
export function ContactChannels({ email, githubUrl, linkedinUrl, location }: ContactData) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3.5">
      <Channel icon={<Mail className="size-[19px]" aria-hidden />} label={t.contactChannels.email} value={email} href={`mailto:${email}`} />
      <Channel icon={<GithubIcon className="size-[19px]" />} label={t.contactChannels.github} value={t.contactChannels.viewMyCode} href={githubUrl} />
      <Channel icon={<LinkedinIcon className="size-[19px]" />} label={t.contactChannels.linkedin} value={t.contactChannels.connectWithMe} href={linkedinUrl} />
      <Channel icon={<MapPin className="size-[19px]" aria-hidden />} label={t.contactChannels.basedIn} value={`${location} · ${t.contactChannels.remoteOk}`} />
    </div>
  )
}

function Channel({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <>
      <span className="grid size-[42px] flex-none place-items-center rounded-xl bg-mk-brand/10 text-mk-accent">
        {icon}
      </span>
      <span>
        <span className="block font-mk-mono text-[0.68rem] uppercase tracking-[0.1em] text-mk-faint">{label}</span>
        <span className="mt-0.5 block text-[0.96rem] font-semibold">{value}</span>
      </span>
    </>
  )
  const className =
    'flex items-center gap-3.5 rounded-mk-sm border border-mk-hairline bg-mk-surface px-5 py-4 shadow-mk-sm transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-mk-brand-soft'
  return href ? (
    <a href={href} className={className}>{inner}</a>
  ) : (
    <div className={className}>{inner}</div>
  )
}
