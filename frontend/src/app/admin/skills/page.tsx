'use client'

import { useEffect, useState, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Skill } from '@/types'
import toast from 'react-hot-toast'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ skill_name: '', level: 3 })

  function load() {
    api.get('/skills').then((res) => setSkills(res.data.data ?? []))
  }

  useEffect(() => {
    load()
    setLoading(false)
  }, [])

  function resetForm() {
    setForm({ skill_name: '', level: 3 })
    setEditing(null)
    setShowForm(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/skills/${editing.id}`, form)
        toast.success('Skill updated')
      } else {
        await api.post('/skills', form)
        toast.success('Skill created')
      }
      resetForm()
      load()
    } catch {
      toast.error('Failed to save skill')
    }
  }

  function handleEdit(skill: Skill) {
    setEditing(skill)
    setForm({ skill_name: skill.skill_name, level: skill.level })
    setShowForm(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this skill?')) return
    try {
      await api.delete(`/skills/${id}`)
      toast.success('Skill deleted')
      load()
    } catch {
      toast.error('Failed to delete skill')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-ink-muted-48">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink">
          Skills
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity"
        >
          Add Skill
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-canvas border border-hairline rounded-[18px] p-6 mb-6 max-w-md space-y-4"
        >
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Skill Name
            </label>
            <input
              value={form.skill_name}
              onChange={(e) =>
                setForm({ ...form, skill_name: e.target.value })
              }
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Level (1-5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: Number(e.target.value) })
              }
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-body-on-dark text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:opacity-90 transition-opacity"
            >
              {editing ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-hairline text-ink text-[14px] leading-[1.29] tracking-[-0.224px] px-[14px] py-[8px] rounded-full hover:bg-canvas-parchment transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-canvas border border-hairline rounded-[18px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-canvas-parchment border-b border-hairline">
            <tr>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Name</th>
              <th className="text-left px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Level</th>
              <th className="text-right px-4 py-3 text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink-muted-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td className="px-4 py-3 text-[14px] leading-[1.43] tracking-[-0.224px] text-ink">{skill.skill_name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`w-4 h-2 rounded ${
                          i < skill.level ? 'bg-primary' : 'bg-canvas-parchment'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-ink-muted-48 text-[14px] leading-[1.29] tracking-[-0.224px] hover:text-ink transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
