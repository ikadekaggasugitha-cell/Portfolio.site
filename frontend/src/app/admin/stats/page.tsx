'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Stat } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonTable } from '@/components/admin/ui/Skeleton'

/**
 * Number tiles beside the About section on the homepage.
 * Saving purges the public site's `stats` cache so the change is visible immediately.
 */

export default function StatsAdminPage() {
  const [items, setItems] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', value: 0, suffix: '+', sort_order: 0 })

  const load = useCallback(() => {
    return api.get('/stats').then((res) => setItems(res.data.data ?? []))
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  function resetForm() {
    setForm({ label: '', value: 0, suffix: '+', sort_order: 0 })
    setEditing(null)
    setShowForm(false)
  }

  const { run: submit, isPending: isSaving } = useAsyncAction(
    async () => {
      if (editing) {
        await api.put(`/stats/${editing.id}`, form)
      } else {
        await api.post('/stats', form)
      }
      resetForm()
      await load()
    },
    {
      successMessage: editing ? 'Stat updated' : 'Stat created',
      errorMessage: 'Failed to save',
      revalidateTags: 'stats',
    },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleEdit(item: Stat) {
    setEditing(item)
    setForm({ label: item.label, value: item.value, suffix: item.suffix ?? '', sort_order: item.sort_order })
    setShowForm(true)
  }

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: destroy } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/stats/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Stat deleted', errorMessage: 'Failed to delete', revalidateTags: 'stats' },
  )

  function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    destroy(id)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">Stats</h1>
        <SkeletonTable columns={3} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink">Stats</h1>
          <p className="text-[14px] text-muted mt-1">Number tiles beside the About section on the homepage.</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity shrink-0"
        >
          Add Stat
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-canvas border border-hairline rounded-[18px] p-6 mb-6 max-w-md space-y-4"
        >
          <div>
            <label htmlFor="f-label" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Label</label>
            <input
              id="f-label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Years shipping"
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required
            />
          </div>
          <div>
            <label htmlFor="f-value" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Value</label>
            <input
              id="f-value"
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required
            />
          </div>
          <div>
            <label htmlFor="f-suffix" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">Suffix</label>
            <input
              id="f-suffix"
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              placeholder="e.g. + or %"
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
        <div className="bg-canvas border border-hairline rounded-[18px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-canvas-parchment border-b border-hairline">
              <tr>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Label</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Value</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Order</th>
                <th className="text-right px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {items.map((item) => (
                <tr key={item.id}>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-ink">{item.label}</td>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-muted">{`${item.value}${item.suffix ?? ''}`}</td>
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
