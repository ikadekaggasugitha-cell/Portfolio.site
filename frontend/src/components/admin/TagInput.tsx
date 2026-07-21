'use client'

import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  id?: string
  label?: string
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  helperText?: string
}

/**
 * Accessible chip/tag input: type and press Enter or "," to add a tag,
 * Backspace on an empty field removes the last one. Suggestions (e.g.
 * technologies already used on other projects) appear as a filterable
 * listbox navigable with Arrow keys.
 */
export default function TagInput({
  id,
  label,
  tags,
  onChange,
  suggestions = [],
  placeholder = 'Type and press Enter…',
  helperText,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = `${id ?? 'tag-input'}-listbox`

  const filteredSuggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    return suggestions
      .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
      .filter((s) => !query || s.toLowerCase().includes(query))
      .slice(0, 8)
  }, [suggestions, tags, inputValue])

  function addTag(raw: string) {
    const value = raw.trim()
    if (!value) return
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setInputValue('')
      return
    }
    onChange([...tags, value])
    setInputValue('')
    setHighlighted(-1)
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index))
    inputRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (highlighted >= 0 && filteredSuggestions[highlighted]) {
        addTag(filteredSuggestions[highlighted])
      } else {
        addTag(inputValue)
      }
      return
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1)
      return
    }
    if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
      e.preventDefault()
      setOpen(true)
      setHighlighted((i) => Math.min(i + 1, filteredSuggestions.length - 1))
      return
    }
    if (e.key === 'ArrowUp' && filteredSuggestions.length > 0) {
      e.preventDefault()
      setHighlighted((i) => Math.max(i - 1, -1))
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setHighlighted(-1)
    }
  }

  const showSuggestions = open && filteredSuggestions.length > 0

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
          {label}
        </label>
      )}
      <div
        className="w-full flex flex-wrap items-center gap-1.5 bg-canvas border border-hairline rounded-[11px] px-3 py-2 focus-within:border-primary transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-canvas-parchment text-ink text-[13px] leading-[1.29] tracking-[-0.224px] pl-2.5 pr-1 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              aria-label={`Remove ${tag}`}
              className="grid place-items-center size-4 rounded-full text-ink-muted-48 hover:text-ink hover:bg-hairline/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setOpen(true)
            setHighlighted(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[140px] bg-transparent text-[15px] leading-[1.47] tracking-[-0.374px] text-ink placeholder:text-ink-muted-48 focus:outline-none py-0.5"
        />
      </div>

      {showSuggestions && (
        <ul
          id={listboxId}
          role="listbox"
          className="mt-1.5 max-h-48 overflow-auto rounded-[11px] border border-hairline bg-canvas shadow-lg"
        >
          {filteredSuggestions.map((s, i) => (
            <li key={s} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(s)}
                className={`w-full text-left px-3 py-2 text-[14px] leading-[1.43] tracking-[-0.224px] transition-colors ${
                  i === highlighted ? 'bg-canvas-parchment text-ink' : 'text-ink hover:bg-canvas-parchment'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {helperText && (
        <p className="text-[12px] leading-[1.3] text-ink-muted-48 mt-1.5">{helperText}</p>
      )}
    </div>
  )
}
