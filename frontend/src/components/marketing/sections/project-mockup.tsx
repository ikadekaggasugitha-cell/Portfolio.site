import type { ProjectMotif } from '@/lib/marketing/content'

/**
 * A distinct stylized UI mockup per project, so the Work grid reads as four
 * different products rather than one gradient repeated. Neutral ground with a
 * single accent — swap the whole component for real screenshots when available.
 */
export function ProjectMockup({ motif }: { motif: ProjectMotif }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-mk-subtle p-6">
      <svg
        viewBox="0 0 320 200"
        className="h-auto w-full max-w-[300px] drop-shadow-sm"
        role="img"
        aria-hidden
      >
        {motif === 'cms' && <CmsMockup />}
        {motif === 'analytics' && <AnalyticsMockup />}
        {motif === 'commerce' && <CommerceMockup />}
        {motif === 'devops' && <DevopsMockup />}
      </svg>
    </div>
  )
}

const frame = 'fill-mk-surface stroke-mk-hairline'

/** CMS — browser frame with a sidebar + content blocks. */
function CmsMockup() {
  return (
    <g>
      <rect x="8" y="8" width="304" height="184" rx="12" className={frame} strokeWidth="1.5" />
      <line x1="8" y1="34" x2="312" y2="34" className="stroke-mk-hairline" strokeWidth="1.5" />
      <circle cx="22" cy="21" r="3" className="fill-mk-faint" />
      <circle cx="34" cy="21" r="3" className="fill-mk-faint" />
      <circle cx="46" cy="21" r="3" className="fill-mk-faint" />
      <rect x="20" y="46" width="72" height="134" rx="8" className="fill-mk-subtle-2" />
      <rect x="30" y="58" width="52" height="6" rx="3" className="fill-mk-brand" />
      <rect x="30" y="74" width="44" height="5" rx="2.5" className="fill-mk-faint" opacity="0.6" />
      <rect x="30" y="86" width="48" height="5" rx="2.5" className="fill-mk-faint" opacity="0.6" />
      <rect x="30" y="98" width="40" height="5" rx="2.5" className="fill-mk-faint" opacity="0.6" />
      <rect x="104" y="46" width="196" height="52" rx="8" className="fill-mk-subtle-2" />
      <rect x="116" y="60" width="90" height="7" rx="3.5" className="fill-mk-brand" />
      <rect x="116" y="76" width="150" height="5" rx="2.5" className="fill-mk-faint" opacity="0.55" />
      <rect x="104" y="108" width="94" height="72" rx="8" className="fill-mk-subtle-2" />
      <rect x="206" y="108" width="94" height="72" rx="8" className="fill-mk-subtle-2" />
      <rect x="116" y="120" width="60" height="6" rx="3" className="fill-mk-cyan" />
      <rect x="218" y="120" width="60" height="6" rx="3" className="fill-mk-cyan" />
    </g>
  )
}

/** Analytics — KPI row + bar chart. */
function AnalyticsMockup() {
  const bars = [46, 70, 38, 88, 60, 100]
  return (
    <g>
      <rect x="8" y="8" width="304" height="184" rx="12" className={frame} strokeWidth="1.5" />
      <rect x="22" y="24" width="84" height="40" rx="8" className="fill-mk-subtle-2" />
      <rect x="118" y="24" width="84" height="40" rx="8" className="fill-mk-subtle-2" />
      <rect x="214" y="24" width="84" height="40" rx="8" className="fill-mk-subtle-2" />
      <rect x="32" y="34" width="40" height="6" rx="3" className="fill-mk-brand" />
      <rect x="128" y="34" width="34" height="6" rx="3" className="fill-mk-cyan" />
      <rect x="224" y="34" width="44" height="6" rx="3" className="fill-mk-brand" />
      <rect x="32" y="48" width="24" height="8" rx="2" className="fill-mk-ink" />
      <rect x="128" y="48" width="24" height="8" rx="2" className="fill-mk-ink" />
      <rect x="224" y="48" width="24" height="8" rx="2" className="fill-mk-ink" />
      <line x1="22" y1="176" x2="298" y2="176" className="stroke-mk-hairline" strokeWidth="1.5" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={30 + i * 46}
          y={176 - h}
          width="28"
          height={h}
          rx="5"
          className={i % 2 === 0 ? 'fill-mk-brand' : 'fill-mk-cyan'}
          opacity={0.55 + (i / bars.length) * 0.45}
        />
      ))}
    </g>
  )
}

/** Commerce — product grid + cart pill. */
function CommerceMockup() {
  return (
    <g>
      <rect x="8" y="8" width="304" height="184" rx="12" className={frame} strokeWidth="1.5" />
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <g key={`${c}-${r}`}>
            <rect x={24 + c * 94} y={40 + r * 74} width="80" height="60" rx="8" className="fill-mk-subtle-2" />
            <rect x={24 + c * 94} y={40 + r * 74} width="80" height="34" rx="8" className="fill-mk-brand" opacity={0.16} />
            <rect x={32 + c * 94} y={82 + r * 74} width="44" height="5" rx="2.5" className="fill-mk-ink" opacity="0.8" />
            <rect x={32 + c * 94} y={91 + r * 74} width="24" height="5" rx="2.5" className="fill-mk-brand" />
          </g>
        )),
      )}
      <rect x="22" y="16" width="60" height="12" rx="6" className="fill-mk-ink" opacity="0.85" />
      <rect x="236" y="14" width="62" height="16" rx="8" className="fill-mk-cyan" />
    </g>
  )
}

/** DevOps — terminal with a pipeline row. */
function DevopsMockup() {
  return (
    <g>
      <rect x="8" y="8" width="304" height="184" rx="12" className="fill-mk-ink" opacity="0.92" />
      <circle cx="24" cy="24" r="3.5" fill="#FF5F57" />
      <circle cx="37" cy="24" r="3.5" fill="#FEBC2E" />
      <circle cx="50" cy="24" r="3.5" fill="#28C840" />
      <rect x="24" y="46" width="120" height="6" rx="3" className="fill-mk-cyan" />
      <rect x="24" y="62" width="200" height="6" rx="3" fill="#ffffff" opacity="0.55" />
      <rect x="24" y="78" width="164" height="6" rx="3" fill="#ffffff" opacity="0.35" />
      <rect x="24" y="94" width="96" height="6" rx="3" className="fill-mk-brand-soft" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          {i > 0 && (
            <line x1={40 + (i - 1) * 76} y1="150" x2={40 + i * 76 - 20} y2="150" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
          )}
          <circle cx={44 + i * 76} cy="150" r="12" className={i < 3 ? 'fill-mk-brand-soft' : 'fill-none'} stroke="#ffffff" strokeOpacity={i < 3 ? 0 : 0.4} strokeWidth="2" />
        </g>
      ))}
    </g>
  )
}
