'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Capability } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonTable } from '@/components/admin/ui/Skeleton'
import { CAPABILITY_ICONS } from '@/lib/marketing/mappers'
import { toAdminString, toAdminBilingual, type BilingualValue } from '@/lib/admin-localize'
import TranslatableInput from '@/components/admin/ui/TranslatableInput'

/**
 * The capability cards in the "What I do" section.
 * Saving purges the public site's `capabilities` cache so the change is visible immediately.
 */

const ICON_KEYS = Object.keys(CAPABILITY_ICONS)

export default function WhatIDoAdminPage() {
  const [items, setItems] = useState<Capability[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Capability | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ icon: 'sparkles', sort_order: 0 })
  const [title, setTitle] = useState<BilingualValue>({ id: '', en: '' })
  const [description, setDescription] = useState<BilingualValue>({ id: '', en: '' })

  const load = useCallback(() => {
    return api.get('/capabilities').then((res) => setItems(res.data.data ?? []))
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  function resetForm() {
    setForm({ icon: 'sparkles', sort_order: 0 })
    setTitle({ id: '', en: '' })
    setDescription({ id: '', en: '' })
    setEditing(null)
    setShowForm(false)
  }

  const { run: submit, isPending: isSaving } = useAsyncAction(
    async () => {
      if (editing) {
        await api.put(`/capabilities/${editing.id}`, { ...form, title, description })
      } else {
        await api.post('/capabilities', { ...form, title, description })
      }
      resetForm()
      await load()
    },
    {
      successMessage: editing ? 'Capability updated' : 'Capability created',
      errorMessage: 'Failed to save',
      revalidateTags: 'capabilities',
    },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleEdit(item: Capability) {
    setEditing(item)
    setForm({ icon: item.icon ?? 'sparkles', sort_order: item.sort_order })
    setTitle(toAdminBilingual(item.title))
    setDescription(toAdminBilingual(item.description))
    setShowForm(true)
  }

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: destroy } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/capabilities/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Capability deleted', errorMessage: 'Failed to delete', revalidateTags: 'capabilities' },
  )

  function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    destroy(id)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">What I Do</h1>
        <SkeletonTable columns={3} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink">What I Do</h1>
          <p className="text-[14px] text-muted mt-1">The capability cards in the &ldquo;What I do&rdquo; section.</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity shrink-0"
        >
          Add Capability
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-canvas border border-hairline rounded-[18px] p-6 mb-6 max-w-lg space-y-4"
        >
          <TranslatableInput label="Title" id="f-title" value={title} onChange={setTitle} placeholder="e.g. Backend & APIs" />
          <TranslatableInput label="Description" id="f-description" value={description} onChange={setDescription} multiline rows={4} />
          <div>
            <label htmlFor="f-icon" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Icon</label>
            <select
              id="f-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            >
              {ICON_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
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
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Title</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Icon</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Order</th>
                <th className="text-right px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {items.map((item) => (
                <tr key={item.id}>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-ink">{toAdminString(item.title)}</td>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-muted">{item.icon ?? '—'}</td>
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
