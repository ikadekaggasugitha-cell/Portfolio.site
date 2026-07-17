'use client'

import { useState, type FormEvent } from 'react'
import api from '@/lib/api'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      await api.post('/messages', form)
      setStatus({ type: 'success', text: 'Message sent successfully!' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({
        type: 'error',
        text: 'Failed to send message. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface">
      <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in">
        <div className="max-w-container-max mx-auto">
          <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-primary-fixed mb-md leading-tight">
            Contact
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
            Have a question or want to work together? Send me a message.
          </p>

          {status && (
            <div
              className={`p-md rounded-lg mb-lg font-label-sm ${
                status.type === 'success'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-error/10 text-on-error border border-error/20'
              }`}
            >
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md max-w-[680px]">
            <div>
              <label className="block font-label-sm text-primary mb-xs uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant text-body-md text-on-surface px-md py-sm rounded-lg placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-xs uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant text-body-md text-on-surface px-md py-sm rounded-lg placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-xs uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant text-body-md text-on-surface px-md py-sm rounded-lg placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-xs uppercase tracking-wider">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full bg-surface-container border border-outline-variant text-body-md text-on-surface px-md py-sm rounded-lg placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-container text-on-primary-container font-label-sm px-md py-sm rounded-lg transition-all scale-95 hover:scale-100 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
