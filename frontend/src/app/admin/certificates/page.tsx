'use client'

import { useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Certificate } from '@/types'
import toast from 'react-hot-toast'

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'issuer', label: 'Issuer', required: true },
  { name: 'issued_date', label: 'Issued Date', type: 'date' as const, required: true },
  { name: 'expiry_date', label: 'Expiry Date', type: 'date' as const },
  { name: 'credential_url', label: 'Credential URL', type: 'url' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
]

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', issuer: '', issued_date: '', expiry_date: '', credential_url: '', description: '',
  })

  function load() { api.get('/certificates').then((res) => setItems(res.data.data ?? [])) }
  useEffect(() => { load(); setLoading(false) }, [])

  function resetForm() {
    setForm({ title: '', issuer: '', issued_date: '', expiry_date: '', credential_url: '', description: '' })
    setEditing(null); setShowForm(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const payload = { ...form, expiry_date: form.expiry_date || null }
      if (editing) {
        await api.put(`/certificates/${editing.id}`, payload)
        toast.success('Certificate updated')
      } else {
        await api.post('/certificates', payload)
        toast.success('Certificate created')
      }
      resetForm(); load()
    } catch { toast.error('Failed to save certificate') }
  }

  function handleEdit(item: Certificate) {
    setEditing(item)
    setForm({
      title: item.title, issuer: item.issuer,
      issued_date: item.issued_date?.split('T')[0] || '',
      expiry_date: item.expiry_date?.split('T')[0] || '',
      credential_url: item.credential_url || '',
      description: item.description || '',
    })
    setShowForm(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this certificate?')) return
    try { await api.delete(`/certificates/${id}`); toast.success('Certificate deleted'); load() }
    catch { toast.error('Failed to delete certificate') }
  }

  if (loading) return <div className="text-center py-12 text-ink-muted-48">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">Certificates</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">Add Certificate</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-stitch p-6 mb-6 max-w-xl space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">{f.label}{f.required && <span className="text-ink-muted-48 ml-1">*</span>}</label>
              {f.type === 'textarea' ? (
                <textarea name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} rows={3} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" />
              ) : (
                <input type={f.type || 'text'} name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required={f.required} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button type="submit" className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="btn-stitch text-ink">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card-stitch p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink stitch-heading">{item.title}</h3>
                <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted mt-1">{item.issuer}</p>
                <p className="text-[12px] leading-[1] tracking-[-0.12px] text-muted mt-2">Issued: {item.issued_date}</p>
                {item.expiry_date && <p className="text-[12px] leading-[1] tracking-[-0.12px] text-muted">Expires: {item.expiry_date}</p>}
                {item.credential_url && (
                  <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="text-primary text-[12px] leading-[1] tracking-[-0.12px] hover:underline block mt-2">Verify</a>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(item)} className="btn-stitch">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-stitch text-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
