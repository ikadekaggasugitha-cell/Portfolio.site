'use client'

import { useEffect, useState, useRef } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import type { Media } from '@/types'

export default function MediaLibrary() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage] = useState(24)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [editAlt, setEditAlt] = useState('')

  useEffect(() => { load() }, [page])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/media', { params: { page, per_page: perPage } })
      // If API returns paginated resource, handle accordingly
      const data = res.data.data ?? res.data
      setItems(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const fd = new FormData()
        fd.append('file', f)
        await api.post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      toast.success('Uploaded')
      fileRef.current && (fileRef.current.value = '')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function startEdit(item: Media) {
    setEditingId(item.id)
    setEditCaption(item.caption || '')
    setEditAlt(item.alt || '')
  }

  async function saveEdit(id: number) {
    try {
      await api.patch(`/media/${id}`, { caption: editCaption, alt: editAlt })
      toast.success('Updated')
      setEditingId(null)
      load()
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    }
  }

  async function del(id: number) {
    if (!confirm('Delete this media?')) return
    try {
      await api.delete(`/media/${id}`)
      toast.success('Deleted')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  if (loading) return <div className="text-center py-8">Loading media...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold stitch-heading">Media Library</h2>
        <div>
          <input ref={fileRef} onChange={handleUpload} type="file" multiple accept="image/*" className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="btn-stitch btn-primary disabled:opacity-50" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Files'}</button>
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
                  <button onClick={() => saveEdit(it.id)} className="btn-stitch btn-primary">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-stitch">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm truncate mb-1 stitch-heading">{it.filename}</p>
                <p className="text-xs text-muted mb-2">{it.size} bytes</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(it)} className="btn-stitch">Edit</button>
                  <button onClick={() => del(it.id)} className="btn-stitch text-danger">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
