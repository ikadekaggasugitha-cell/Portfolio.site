import { DEFAULT_LOCALE, type Locale } from './translations'
import type { LocalizedText, LocalizedBlockData } from '@/types'

/**
 * Resolve a translatable field for display.
 *
 * Accepts a plain string (static defaults in `content.ts`, or any value written before the
 * i18n migration) or a per-locale map from the API. Falls back locale → `id` (primary) →
 * any set value → '' so a partially-translated field never renders blank.
 */
export function localize(value: LocalizedText | null | undefined, locale: Locale): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[locale] || value[DEFAULT_LOCALE] || Object.values(value).find(Boolean) || ''
}

/**
 * Resolve a page block's per-locale `data` payload. Mirrors `localize`'s fallback order.
 * Tolerates a legacy, non-locale-keyed payload by returning it as-is.
 */
export function localizeBlockData(
  data: LocalizedBlockData | null | undefined,
  locale: Locale,
): Record<string, unknown> {
  if (!data) return {}
  const picked = data[locale] ?? data[DEFAULT_LOCALE]
  if (picked) return picked
  const anyLocale = Object.values(data).find(
    (v) => v && typeof v === 'object',
  ) as Record<string, unknown> | undefined
  if (anyLocale) return anyLocale
  // Legacy payload stored without locale keys — use it directly.
  return data as unknown as Record<string, unknown>
}
