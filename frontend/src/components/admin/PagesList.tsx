'use client'

import { useCallback, useEffect, useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'
import type { Page } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonList } from '@/components/admin/ui/Skeleton'

export default function PagesList() {
  const [items, setItems] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await api.get('/pages')
    const data = res.data.data ?? res.data
    setItems(Array.isArray(data) ? data : data.data ?? [])
  }, [])

  useEffect(() => {
    load().catch(console.error).finally(() => setLoading(false))
  }, [load])

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: del } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/pages/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Deleted', errorMessage: 'Delete failed' },
  )

  function handleDelete(id: number) {
    if (!confirm('Delete page?')) return
    del(id)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold stitch-heading mb-6">Pages</h1>
        <SkeletonList count={3} className="grid gap-3" />
      </div>
    )
  }

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
              <Button
                variant="danger"
                onClick={() => handleDelete(p.id)}
                loading={deletingId === p.id}
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
