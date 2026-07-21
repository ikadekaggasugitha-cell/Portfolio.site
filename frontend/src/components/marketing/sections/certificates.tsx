import { Award, ExternalLink } from 'lucide-react'
import type { CertificateEntry } from '@/lib/marketing/content'
import { Section } from '../primitives/section'
import { SectionHeading } from '../primitives/section-heading'
import { Reveal } from '../primitives/reveal'

/** Certifications & credentials. Renders nothing when there are no entries. */
export function Certificates({
  entries,
  id = 'certificates',
  tone = 'subtle',
}: {
  entries: CertificateEntry[]
  id?: string
  tone?: 'canvas' | 'subtle'
}) {
  if (!entries.length) return null

  return (
    <Section id={id} tone={tone}>
      <SectionHeading
        eyebrow="Credentials"
        title="Certifications"
        align="center"
        className="mb-[clamp(40px,6vw,68px)]"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((cert, i) => (
          <Reveal key={`${cert.title}-${i}`} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-mk border border-mk-hairline bg-mk-surface p-7 shadow-mk-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-mk-brand-soft/60 hover:shadow-mk-md">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-[42px] place-items-center rounded-xl bg-mk-brand/10 text-mk-accent">
                  <Award className="size-5" aria-hidden />
                </span>
                {cert.date && (
                  <span className="font-mk-mono text-[0.72rem] uppercase tracking-[0.08em] text-mk-faint">
                    {cert.date}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-[1.05rem] font-bold leading-snug">{cert.title}</h3>
              <p className="mt-1 text-[0.92rem] text-mk-muted">{cert.issuer}</p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-mk-accent transition-opacity hover:opacity-80"
                >
                  View credential
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
