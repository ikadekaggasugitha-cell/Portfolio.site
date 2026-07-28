import type { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger' | 'unstyled'
  loading?: boolean
  /** Label shown while loading, e.g. "Saving...". Defaults to children. */
  loadingText?: string
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn-stitch btn-primary',
  default: 'btn-stitch',
  danger: 'btn-stitch text-danger',
  // No base classes — for pages with their own button styling. Only the
  // loading/disabled/spinner behavior is added on top of `className`.
  unstyled: '',
}

/**
 * Shared admin action button. Wraps the existing .btn-stitch/.btn-primary
 * classes so every CRUD page gets the same disabled+spinner behavior during
 * async submits instead of re-implementing it per page.
 */
export default function Button({
  variant = 'default',
  loading = false,
  loadingText,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${variantClass[variant]} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <Spinner className="h-3.5 w-3.5 border-2" />}
      {loading ? loadingText ?? children : children}
    </button>
  )
}
