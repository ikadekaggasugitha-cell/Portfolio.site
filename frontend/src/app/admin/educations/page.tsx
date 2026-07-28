'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Education } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonList } from '@/components/admin/ui/Skeleton'

const fields = [
  { name: 'institution', label: 'Institution', required: true },
  { name: 'degree', label: 'Degree' },
  { name: 'field_of_study', label: 'Field of Study' },
  { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
  { name: 'end_date', label: 'End Date', type: 'date' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
]

export default function EducationsPage() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Education | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: '',
  })

  const load = useCallback(() => {
    return api.get('/educations').then((res) => setItems(res.data.data ?? []))
  }, [])
  useEffect(() => { load().finally(() => setLoading(false)) }, [load])

  function resetForm() {
    setForm({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' })
    setEditing(null); setShowForm(false)
  }

  const { run: submit, isPending: isSaving } = useAsyncAction(
    async () => {
      const payload = { ...form, end_date: form.end_date || null }
      if (editing) {
        await api.put(`/educations/${editing.id}`, payload)
      } else {
        await api.post('/educations', payload)
      }
      resetForm()
      await load()
    },
    { successMessage: editing ? 'Education updated' : 'Education created', errorMessage: 'Failed to save education' },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleEdit(item: Education) {
    setEditing(item)
    setForm({
      institution: item.institution,
      degree: item.degree || '',
      field_of_study: item.field_of_study || '',
      start_date: item.start_date?.split('T')[0] || '',
      end_date: item.end_date?.split('T')[0] || '',
      description: item.description || '',
    })
    setShowForm(true)
  }

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: destroy } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/educations/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Education deleted', errorMessage: 'Failed to delete education' },
  )

  function handleDelete(id: number) {
    if (!confirm('Delete this education?')) return
    destroy(id)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">Educations</h1>
        <SkeletonList count={3} className="space-y-4" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">Educations</h1>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true) }} className="text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">Add Education</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-stitch p-6 mb-6 max-w-xl space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
                {f.label}{f.required && <span className="text-ink-muted-48 ml-1">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} rows={4} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" />
              ) : (
                <input type={f.type || 'text'} name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required={f.required} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              loadingText={editing ? 'Updating...' : 'Creating...'}
              className="text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
            <Button type="button" onClick={resetForm} className="text-ink">Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card-stitch p-5 flex items-start justify-between">
            <div>
              <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink stitch-heading">{item.institution}</h3>
              <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted mt-1">{item.degree}{item.field_of_study ? ` - ${item.field_of_study}` : ''}</p>
              <p className="text-[12px] leading-[1] tracking-[-0.12px] text-muted mt-1">{item.start_date?.split('T')[0]} &mdash; {item.end_date?.split('T')[0] || 'Present'}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button onClick={() => handleEdit(item)} disabled={deletingId === item.id}>Edit</Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(item.id)}
                loading={deletingId === item.id}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
