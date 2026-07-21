import { Section } from '../primitives/section'
import { Eyebrow } from '../primitives/eyebrow'
import { Reveal } from '../primitives/reveal'
import { Button } from '../primitives/button'

/** Reusable call-to-action band. One restrained brand moment, centered. */
export function CtaBand({
  eyebrow,
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  tone = 'canvas',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  buttonLabel: string
  buttonHref: string
  tone?: 'canvas' | 'subtle'
}) {
  return (
    <Section tone={tone}>
      <Reveal>
        <div className="relative overflow-hidden rounded-mk border border-mk-hairline bg-mk-surface px-6 py-[clamp(40px,6vw,72px)] text-center shadow-mk-md">
          <div aria-hidden className="mk-hero-glow pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative mx-auto max-w-[560px]">
            {eyebrow && <Eyebrow className="justify-center">{eyebrow}</Eyebrow>}
            <h2 className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold tracking-[-0.02em] text-balance">
              {title}
            </h2>
            {subtitle && <p className="mx-auto mt-3 max-w-[46ch] text-mk-muted">{subtitle}</p>}
            <div className="mt-7 flex justify-center">
              <Button href={buttonHref} size="lg">
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
