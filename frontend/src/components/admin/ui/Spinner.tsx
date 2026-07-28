export default function Spinner({ className = 'h-4 w-4 border-2' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block shrink-0 animate-spin rounded-full border-current border-b-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
    />
  )
}
