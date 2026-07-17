'use client'

import type { ChangeEvent } from 'react'

interface FieldConfig {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'url'
  required?: boolean
  min?: number
  max?: number
  placeholder?: string
}

export function renderField(
  field: FieldConfig,
  values: Record<string, string | number | boolean | null>,
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void,
) {
  const value = values[field.name] ?? ''
  const common = 'w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors'

  if (field.type === 'textarea') {
    return (
      <div key={field.name}>
        <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
          {field.label}
          {field.required && <span className="text-ink-muted-48 ml-1">*</span>}
        </label>
        <textarea
          name={field.name}
          value={value as string}
          onChange={onChange}
          className={common}
          rows={4}
          required={field.required}
        />
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div key={field.name}>
        <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
          {field.label}
          {field.required && <span className="text-ink-muted-48 ml-1">*</span>}
        </label>
        <input
          type="number"
          name={field.name}
          value={value as number}
          onChange={onChange}
          className={common}
          min={field.min}
          max={field.max}
          required={field.required}
        />
      </div>
    )
  }

  return (
    <div key={field.name}>
      <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
        {field.label}
        {field.required && <span className="text-ink-muted-48 ml-1">*</span>}
      </label>
      <input
        type={field.type || 'text'}
        name={field.name}
        value={value as string}
        onChange={onChange}
        className={common}
        placeholder={field.placeholder}
        required={field.required}
      />
    </div>
  )
}
