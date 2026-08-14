'use client'

import { useState, type ChangeEvent } from 'react'

export interface BilingualValue {
  id: string
  en: string
}

interface TranslatableInputProps {
  /** Field label displayed above the input. */
  label: string
  /** Current bilingual value. */
  value: BilingualValue
  /** Called when either locale value changes. */
  onChange: (value: BilingualValue) => void
  /** Render a textarea instead of an input. */
  multiline?: boolean
  /** Number of rows for the textarea. Default: 4 */
  rows?: number
  /** Placeholder text (same for both locales). */
  placeholder?: string
  /** Additional hint text shown below the input. */
  hint?: string
  /** HTML id prefix — the active tab key is appended. */
  id?: string
  /** Input type for single-line mode. Default: 'text' */
  type?: string
}

const TAB_BASE =
  'px-3 py-1 text-[12px] font-semibold tracking-wide rounded-md transition-colors cursor-pointer select-none'
const TAB_ACTIVE = `${TAB_BASE} bg-primary text-white`
const TAB_INACTIVE = `${TAB_BASE} text-muted hover:text-ink`

const INPUT_CLASS =
  'w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors'

export default function TranslatableInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
  placeholder,
  hint,
  id,
  type = 'text',
}: TranslatableInputProps) {
  const [tab, setTab] = useState<'id' | 'en'>('id')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange({ ...value, [tab]: e.target.value })
  }

  const inputId = id ? `${id}-${tab}` : undefined

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink"
        >
          {label}
        </label>
        <div className="flex gap-1 bg-surface rounded-lg p-0.5 border border-hairline">
          <button
            type="button"
            className={tab === 'id' ? TAB_ACTIVE : TAB_INACTIVE}
            onClick={() => setTab('id')}
          >
            ID
          </button>
          <button
            type="button"
            className={tab === 'en' ? TAB_ACTIVE : TAB_INACTIVE}
            onClick={() => setTab('en')}
          >
            EN
          </button>
        </div>
      </div>

      {multiline ? (
        <textarea
          id={inputId}
          value={value[tab]}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          className={INPUT_CLASS}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value[tab]}
          onChange={handleChange}
          placeholder={placeholder}
          className={INPUT_CLASS}
        />
      )}

      {hint && <div className="text-sm text-muted mt-1">{hint}</div>}

      {/* Indicator: show whether the other locale has content */}
      {!value[tab === 'id' ? 'en' : 'id']?.trim() && (
        <div className="text-[12px] text-amber-500 mt-1">
          ⚠ {tab === 'id' ? 'EN' : 'ID'} translation is empty — it will be auto-translated on save
        </div>
      )}
    </div>
  )
}
