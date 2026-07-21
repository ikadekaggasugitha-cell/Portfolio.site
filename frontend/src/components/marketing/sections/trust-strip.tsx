import { marqueeItems } from '@/lib/marketing/content'

/** Auto-scrolling technology marquee. Decorative; pauses on hover. */
export function TrustStrip() {
  const items = [...marqueeItems, ...marqueeItems]
  return (
    <div aria-hidden className="mk-marquee-track overflow-hidden border-y border-mk-hairline bg-mk-surface">
      <div className="mk-marquee flex w-max gap-14 py-[22px]">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap font-mk-mono text-[0.82rem] uppercase tracking-[0.12em] text-mk-faint"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
