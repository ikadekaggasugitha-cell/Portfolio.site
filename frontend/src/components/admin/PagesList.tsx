'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Page } from '@/types'

export default function PagesList() {
  const [items, setItems] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/pages')
      const data = res.data.data ?? res.data
      setItems(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  async function del(id: number) {
    if (!confirm('Delete page?')) return
    try {
      await api.delete(`/pages/${id}`)
      toast.success('Deleted')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  if (loading) return <div className="py-8 text-center">Loading pages...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold stitch-heading">Pages</h1>
        <Link href="/admin/pages/new" className="btn-stitch btn-primary px-4 py-2">New Page</Link>
      </div>

      <div className="grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="card-stitch p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-ink">{p.title}</div>
              <div className="text-muted text-sm">/{p.slug} • {p.is_published ? 'Published' : 'Draft'}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/pages/${p.id}`} className="btn-stitch">Edit</Link>
              <button onClick={() => del(p.id)} className="btn-stitch text-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
