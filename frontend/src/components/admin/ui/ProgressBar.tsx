/** Determinate upload/task progress bar. `percent` is 0-100. */
export default function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      {label && (
        <div className="flex justify-between text-[12px] leading-[1] tracking-[-0.12px] text-muted mb-1.5">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-canvas-parchment overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
