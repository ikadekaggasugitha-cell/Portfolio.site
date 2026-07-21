import { cn } from '@/lib/utils'
import { Eyebrow } from './eyebrow'
import { Reveal } from './reveal'

/**
 * Standard section header: eyebrow → title → optional subtitle.
 * `titleAccent` renders its matching substring in solid brand ink. The
 * signature gradient is deliberately reserved for the hero headline only,
 * so section titles never repeat the gradient-text formula.
 */
export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  align = 'left',
  className,
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  const centered = align === 'center'
  const parts = titleAccent && title.includes(titleAccent) ? title.split(titleAccent) : null

  return (
    <div
      className={cn(
        'max-w-[620px]',
        centered && 'mx-auto text-center',
        className,
      )}
    >
      <Reveal>
        <Eyebrow className={centered ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-[18px] text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
          {parts ? (
            <>
              {parts[0]}
              <span className="text-mk-accent">{titleAccent}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={cn('mt-3.5 max-w-[52ch] text-[clamp(1rem,1.4vw,1.12rem)] text-mk-muted', centered && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}
