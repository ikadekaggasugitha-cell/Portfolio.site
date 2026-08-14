import type { LocalizedText } from '@/types'

export interface BilingualValue {
  id: string
  en: string
}

/**
 * Safely extracts a displayable string from a LocalizedText or string field
 * for Admin forms and Admin list tables.
 */
export function toAdminString(value: LocalizedText | null | undefined): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value.id || value.en || Object.values(value).find((val) => typeof val === 'string' && Boolean(val)) || ''
}

/**
 * Extracts both locale values from a LocalizedText field for bilingual admin editing.
 * Returns `{ id, en }` so the admin form can display and edit both languages.
 */
export function toAdminBilingual(value: LocalizedText | null | undefined): BilingualValue {
  if (value == null) return { id: '', en: '' }
  if (typeof value === 'string') return { id: value, en: '' }
  return { id: value.id || '', en: value.en || '' }
}
