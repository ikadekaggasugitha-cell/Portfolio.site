import type { LocalizedText } from '@/types'

/**
 * Safely extracts a displayable string from a LocalizedText or string field
 * for Admin forms and Admin list tables.
 */
export function toAdminString(value: LocalizedText | null | undefined): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value.id || value.en || Object.values(value).find((val) => typeof val === 'string' && Boolean(val)) || ''
}
