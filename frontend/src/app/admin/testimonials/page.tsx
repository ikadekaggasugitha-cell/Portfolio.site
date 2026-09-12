'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Testimonial } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonTable } from '@/components/admin/ui/Skeleton'
import { toAdminString, toAdminBilingual, type BilingualValue } from '@/lib/admin-localize'
import TranslatableInput from '@/components/admin/ui/TranslatableInput'

/**
 * Quotes shown in the "What collaborators say" section.
 * Saving purges the public site's `testimonials` cache so the change is visible immediately.
 */

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author_name: '', initials: '', sort_order: 0 })
  const [quote, setQuote] = useState<BilingualValue>({ id: '', en: '' })
  const [authorTitle, setAuthorTitle] = useState<BilingualValue>({ id: '', en: '' })

  const load = useCallback(() => {
    return api.get('/testimonials').then((res) => setItems(res.data.data ?? []))
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  function resetForm() {
    setForm({ author_name: '', initials: '', sort_order: 0 })
    setQuote({ id: '', en: '' })
    setAuthorTitle({ id: '', en: '' })
    setEditing(null)
    setShowForm(false)
  }

  const { run: submit, isPending: isSaving } = useAsyncAction(
    async () => {
      if (editing) {
        await api.put(`/testimonials/${editing.id}`, { ...form, quote, author_title: authorTitle })
      } else {
        await api.post('/testimonials', { ...form, quote, author_title: authorTitle })
      }
      resetForm()
      await load()
    },
    {
      successMessage: editing ? 'Testimonial updated' : 'Testimonial created',
      errorMessage: 'Failed to save',
      revalidateTags: 'testimonials',
    },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleEdit(item: Testimonial) {
    setEditing(item)
    setForm({ author_name: item.author_name, initials: item.initials ?? '', sort_order: item.sort_order })
    setQuote(toAdminBilingual(item.quote))
    setAuthorTitle(toAdminBilingual(item.author_title))
    setShowForm(true)
  }

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: destroy } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/testimonials/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Testimonial deleted', errorMessage: 'Failed to delete', revalidateTags: 'testimonials' },
  )

  function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    destroy(id)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">Testimonials</h1>
        <SkeletonTable columns={3} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink">Testimonials</h1>
          <p className="text-[14px] text-muted mt-1">Quotes shown in the &ldquo;What collaborators say&rdquo; section.</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity shrink-0"
        >
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-canvas border border-hairline rounded-[18px] p-6 mb-6 max-w-lg space-y-4"
        >
          <TranslatableInput label="Quote" id="f-quote" value={quote} onChange={setQuote} multiline rows={4} />
          <div>
            <label htmlFor="f-author_name" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Author name</label>
            <input
              id="f-author_name"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required
            />
          </div>
          <TranslatableInput label="Author role" id="f-author_title" value={authorTitle} onChange={setAuthorTitle} placeholder="e.g. CTO, PropTech Startup" />
          <div>
            <label htmlFor="f-initials" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Initials</label>
            <input
              id="f-initials"
              value={form.initials}
              onChange={(e) => setForm({ ...form, initials: e.target.value })}
              placeholder="Leave blank to derive from the name"
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="f-sort_order" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Order</label>
            <input
              id="f-sort_order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="unstyled"
              loading={isSaving}
              loadingText={editing ? 'Updating...' : 'Creating...'}
              className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
            <button type="button" onClick={resetForm} className="border border-hairline text-ink text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:bg-canvas-parchment transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="bg-canvas border border-hairline rounded-[18px] p-8 text-center">
          <p className="text-ink text-[15px]">Nothing here yet.</p>
          <p className="text-muted text-[14px] mt-1">
            This section is hidden on the public site until you add an entry.
          </p>
        </div>
      ) : (
        <div className="bg-canvas border border-hairline rounded-[18px] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-canvas-parchment border-b border-hairline">
              <tr>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Author</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Role</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Order</th>
                <th className="text-right px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {items.map((item) => (
                <tr key={item.id}>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-ink">{item.author_name}</td>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-muted">{toAdminString(item.author_title) || '—'}</td>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-muted">{item.sort_order}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button
                      variant="unstyled"
                      onClick={() => handleEdit(item)}
                      disabled={deletingId === item.id}
                      className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={() => handleDelete(item.id)}
                      loading={deletingId === item.id}
                      loadingText="Deleting..."
                      className="text-ink-muted-48 text-[14px] leading-[1.29] tracking-[-0.224px] hover:text-ink transition-colors"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
