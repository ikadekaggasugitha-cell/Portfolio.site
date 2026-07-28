'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import api from '@/lib/api'
import type { Media } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import ProgressBar from '@/components/admin/ui/ProgressBar'
import { SkeletonList } from '@/components/admin/ui/Skeleton'

export default function MediaLibrary() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage] = useState(24)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [editAlt, setEditAlt] = useState('')

  const load = useCallback(async () => {
    const res = await api.get('/media', { params: { page, per_page: perPage } })
    // If API returns paginated resource, handle accordingly
    const data = res.data.data ?? res.data
    setItems(Array.isArray(data) ? data : data.data ?? [])
  }, [page, perPage])

  useEffect(() => {
    setLoading(true)
    load().catch(console.error).finally(() => setLoading(false))
  }, [load])

  const { run: handleUpload } = useAsyncAction(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files
      if (!files || files.length === 0) return
      try {
        for (let i = 0; i < files.length; i++) {
          const f = files[i]
          const fd = new FormData()
          fd.append('file', f)
          await api.post('/media', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (evt) => {
              if (!evt.total) return
              const filePercent = evt.loaded / evt.total
              setUploadProgress(Math.round(((i + filePercent) / files.length) * 100))
            },
          })
        }
        if (fileRef.current) fileRef.current.value = ''
        await load()
      } finally {
        setUploadProgress(null)
      }
    },
    { successMessage: 'Uploaded', errorMessage: 'Upload failed' },
  )

  function startEdit(item: Media) {
    setEditingId(item.id)
    setEditCaption(item.caption || '')
    setEditAlt(item.alt || '')
  }

  const { run: saveEdit, isPending: isSavingEdit } = useAsyncAction(
    async (id: number) => {
      await api.patch(`/media/${id}`, { caption: editCaption, alt: editAlt })
      setEditingId(null)
      await load()
    },
    { successMessage: 'Updated', errorMessage: 'Update failed' },
  )

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { run: destroy } = useAsyncAction(
    async (id: number) => {
      setDeletingId(id)
      try {
        await api.delete(`/media/${id}`)
        await load()
      } finally {
        setDeletingId(null)
      }
    },
    { successMessage: 'Deleted', errorMessage: 'Delete failed' },
  )

  function del(id: number) {
    if (!confirm('Delete this media?')) return
    destroy(id)
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-[18px] font-semibold stitch-heading mb-4">Media Library</h2>
        <SkeletonList count={8} className="grid grid-cols-2 md:grid-cols-4 gap-3" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold stitch-heading">Media Library</h2>
        <div className="text-right">
          <input ref={fileRef} onChange={handleUpload} type="file" multiple accept="image/*" className="hidden" disabled={uploadProgress !== null} />
          <Button variant="primary" onClick={() => fileRef.current?.click()} loading={uploadProgress !== null} loadingText="Uploading...">Upload Files</Button>
          {uploadProgress !== null && <div className="mt-2 w-40 ml-auto"><ProgressBar percent={uploadProgress} /></div>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.id} className="media-thumb p-2">
            <img src={it.url} alt={it.alt ?? it.filename} className="w-full h-36 object-cover mb-2 rounded" />
            {editingId === it.id ? (
              <div>
                <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} placeholder="Caption" className="w-full mb-1 px-2 py-1 stitch-input" />
                <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="Alt text" className="w-full mb-2 px-2 py-1 stitch-input" />
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => saveEdit(it.id)} loading={isSavingEdit}>Save</Button>
                  <Button onClick={() => setEditingId(null)} disabled={isSavingEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm truncate mb-1 stitch-heading">{it.filename}</p>
                <p className="text-xs text-muted mb-2">{it.size} bytes</p>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(it)} disabled={deletingId === it.id}>Edit</Button>
                  <Button variant="danger" onClick={() => del(it.id)} loading={deletingId === it.id} loadingText="Deleting...">Delete</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
