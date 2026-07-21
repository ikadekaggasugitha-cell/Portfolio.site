'use client'

import { useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Experience } from '@/types'
import toast from 'react-hot-toast'

export default function ExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
  })

  function load() {
    api.get('/experiences').then((res) => setItems(res.data.data ?? []))
  }

  useEffect(() => {
    load()
    setLoading(false)
  }, [])

  function resetForm() {
    setForm({ company: '', position: '', location: '', start_date: '', end_date: '', description: '' })
    setEditing(null)
    setShowForm(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const payload = { ...form, end_date: form.end_date || null }
      if (editing) {
        await api.put(`/experiences/${editing.id}`, payload)
        toast.success('Experience updated')
      } else {
        await api.post('/experiences', payload)
        toast.success('Experience created')
      }
      resetForm()
      load()
    } catch {
      toast.error('Failed to save experience')
    }
  }

  function handleEdit(item: Experience) {
    setEditing(item)
    setForm({
      company: item.company,
      position: item.position,
      location: item.location || '',
      start_date: item.start_date?.split('T')[0] || '',
      end_date: item.end_date?.split('T')[0] || '',
      description: item.description || '',
    })
    setShowForm(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this experience?')) return
    try {
      await api.delete(`/experiences/${id}`)
      toast.success('Experience deleted')
      load()
    } catch {
      toast.error('Failed to delete experience')
    }
  }

  const fields = [
    { name: 'company', label: 'Company', required: true },
    { name: 'position', label: 'Position', required: true },
    { name: 'location', label: 'Location' },
    { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'end_date', label: 'End Date (leave blank for current)', type: 'date' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
  ]

  if (loading) {
    return <div className="text-center py-12 text-ink-muted-48">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">
          Experiences
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity"
        >
          Add Experience
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-stitch p-6 mb-6 max-w-xl space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
                {f.label}{f.required && <span className="text-ink-muted-48 ml-1">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  name={f.name}
                  value={(form as Record<string, string>)[f.name]}
                  onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                  rows={4}
                  className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  value={(form as Record<string, string>)[f.name]}
                  onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                  className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
                  required={f.required}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button type="submit" className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="btn-stitch text-ink">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card-stitch p-5 flex items-start justify-between">
            <div>
              <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink stitch-heading">{item.position}</h3>
              <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted mt-1">
                {item.company}
                {item.location ? ` · ${item.location}` : ''}
              </p>
              <p className="text-[12px] leading-[1] tracking-[-0.12px] text-muted mt-1">
                {item.start_date?.split('T')[0]} &mdash; {item.end_date?.split('T')[0] || 'Present'}
              </p>
              {item.description && (
                <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted mt-2 line-clamp-2">{item.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(item)} className="btn-stitch">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn-stitch text-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
