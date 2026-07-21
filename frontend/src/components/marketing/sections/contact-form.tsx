'use client'

import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import api from '@/lib/api'

type Status = { type: 'success' | 'error'; text: string } | null

const inputClass =
  'w-full rounded-xl border border-mk-hairline bg-mk-subtle px-4 py-3 text-[0.96rem] text-mk-ink ' +
  'placeholder:text-mk-faint transition-[border-color,box-shadow,background-color] ' +
  'focus:border-mk-brand focus:bg-mk-surface focus:outline-none focus:ring-4 focus:ring-mk-brand/15'
const labelClass = 'mb-2 block font-mk-mono text-[0.72rem] uppercase tracking-[0.08em] text-mk-muted'

/**
 * Contact form — posts to the existing `/messages` API with client-side
 * feedback (no reload). Handles validation, loading, success and error states.
 * Reused by the landing Contact section and the /contact page.
 */
export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }
    setSubmitting(true)
    setStatus(null)
    try {
      await api.post('/messages', form)
      setStatus({ type: 'success', text: "Message sent — I'll reply within a day." })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({ type: 'error', text: 'Something went wrong. Please email me directly instead.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={submitting}
      className="rounded-mk border border-mk-hairline bg-mk-surface p-[clamp(24px,3vw,36px)] shadow-mk-md"
    >
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div className="mb-[18px]">
          <label className={labelClass} htmlFor="c-name">Name</label>
          <input id="c-name" name="name" type="text" required placeholder="Your name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div className="mb-[18px]">
          <label className={labelClass} htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" required placeholder="you@email.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div className="mb-[18px]">
        <label className={labelClass} htmlFor="c-subject">Subject</label>
        <input id="c-subject" name="subject" type="text" required placeholder="What's this about?"
          value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} />
      </div>
      <div className="mb-5">
        <label className={labelClass} htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required rows={5} placeholder="Tell me a bit about your project or role…"
          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} min-h-[130px] resize-y`} />
      </div>

      {status && (
        <p
          role="status"
          aria-live="polite"
          className={
            'mb-4 rounded-xl border px-4 py-3 text-[0.9rem] font-medium ' +
            (status.type === 'success'
              ? 'border-mk-brand/30 bg-mk-brand/10 text-mk-accent'
              : 'border-red-500/30 bg-red-500/10 text-red-500')
          }
        >
          {status.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-mk-brand px-6 py-3.5 font-semibold text-mk-on-brand shadow-mk-brand transition-[background-color,opacity] hover:bg-mk-brand-strong disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send message'}
        {!submitting && <Send className="size-[17px]" aria-hidden />}
      </button>
    </form>
  )
}
