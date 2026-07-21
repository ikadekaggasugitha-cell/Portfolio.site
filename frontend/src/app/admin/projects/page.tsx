'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import api from '@/lib/api'
import type { Project } from '@/types'
import toast from 'react-hot-toast'
import ProjectImageUpload from '@/components/admin/ProjectImageUpload'
import TagInput from '@/components/admin/TagInput'

const fieldsBeforeTech = [
  { name: 'title', label: 'Title', required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'github_url', label: 'GitHub URL', type: 'url' as const },
  { name: 'demo_url', label: 'Demo URL', type: 'url' as const },
]
const fieldsAfterTech = [
  { name: 'sort_order', label: 'Sort order (lower shows first)', type: 'number' as const },
]

/** "React, Node.js, PostgreSQL" -> ["React", "Node.js", "PostgreSQL"] */
function parseTechnology(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', github_url: '', demo_url: '', sort_order: '0',
  })
  const [techTags, setTechTags] = useState<string[]>([])
  const [isFeatured, setIsFeatured] = useState(false)

  // per_page=50 so the admin can manage the full catalogue, not just the first page.
  function load() { api.get('/projects?per_page=50').then((res) => setItems(res.data.data ?? [])) }
  useEffect(() => { load(); setLoading(false) }, [])

  // Suggestions for the technology tag input: every distinct technology
  // already used across other projects, so tags stay consistent site-wide.
  const allTechnologies = useMemo(() => {
    const seen = new Map<string, string>()
    for (const item of items) {
      for (const tech of parseTechnology(item.technology || '')) {
        if (!seen.has(tech.toLowerCase())) seen.set(tech.toLowerCase(), tech)
      }
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b))
  }, [items])

  function resetForm() {
    setForm({ title: '', description: '', github_url: '', demo_url: '', sort_order: '0' })
    setTechTags([])
    setIsFeatured(false)
    setEditing(null); setShowForm(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        technology: techTags.join(', '),
        sort_order: Number(form.sort_order) || 0,
        is_featured: isFeatured,
      }
      if (editing) {
        await api.put(`/projects/${editing.id}`, payload)
        toast.success('Project updated')
      } else {
        await api.post('/projects', payload)
        toast.success('Project created')
      }
      resetForm(); load()
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined
      toast.error(message || 'Failed to save project')
    }
  }

  function handleEdit(item: Project) {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description || '',
      github_url: item.github_url || '',
      demo_url: item.demo_url || '',
      sort_order: String(item.sort_order ?? 0),
    })
    setTechTags(parseTechnology(item.technology || ''))
    setIsFeatured(item.is_featured ?? false)
    setShowForm(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this project?')) return
    try { await api.delete(`/projects/${id}`); toast.success('Project deleted'); load() }
    catch { toast.error('Failed to delete project') }
  }

  if (loading) return <div className="text-center py-12 text-ink-muted-48">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">Projects</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">Add Project</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-stitch p-6 mb-6 max-w-xl space-y-4">
          {fieldsBeforeTech.map((f) => (
            <div key={f.name}>
              <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">{f.label}{f.required && <span className="text-ink-muted-48 ml-1">*</span>}</label>
              {f.type === 'textarea' ? (
                <textarea name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} rows={5} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" />
              ) : (
                <input type={f.type || 'text'} name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" required={f.required} />
              )}
            </div>
          ))}

          <TagInput
            id="project-technology"
            label="Technology"
            tags={techTags}
            onChange={setTechTags}
            suggestions={allTechnologies}
            placeholder="e.g. React — press Enter to add"
            helperText="Press Enter or comma to add. Shown as badges on the project card and as filter chips on /projects."
          />

          {fieldsAfterTech.map((f) => (
            <div key={f.name}>
              <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">{f.label}</label>
              <input type={f.type || 'text'} name={f.name} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors" />
            </div>
          ))}

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-6 w-11 shrink-0 rounded-full border border-hairline bg-canvas-parchment transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
            />
            <span className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink">Featured project</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-stitch btn-primary text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full transition-opacity">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="btn-stitch text-ink">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card-stitch p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink stitch-heading">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  {item.is_featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-canvas-parchment px-2 py-0.5 text-[11px] font-semibold text-ink">
                      <span className="text-primary">★</span> Featured
                    </span>
                  )}
                  <span className="text-[12px] leading-[1] tracking-[-0.12px] text-ink-muted-48">Order: {item.sort_order ?? 0}</span>
                </div>
                <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted line-clamp-2 mt-1">{item.description}</p>
                {item.technology && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.technology.split(',').map((t) => (
                      <span key={t} className="text-[12px] leading-[1] tracking-[-0.12px] bg-canvas-parchment text-muted px-2.5 py-1 rounded-full">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(item)} className="btn-stitch">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-stitch text-danger">Delete</button>
              </div>
            </div>

            {/* Show image count */}
            {item.images && item.images.length > 0 && (
              <div className="text-[12px] leading-[1] tracking-[-0.12px] text-ink-muted-48 pt-3 border-t border-hairline">
                {item.images.length} image{item.images.length !== 1 ? 's' : ''} uploaded
              </div>
            )}

            {/* Image upload section when editing */}
            {editing?.id === item.id && (
              <div className="mt-4 pt-4 border-t border-hairline">
                <ProjectImageUpload project={item} onImagesUpdated={load} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
