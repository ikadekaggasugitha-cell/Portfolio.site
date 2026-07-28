'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import type { Media } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import { SkeletonList } from '@/components/admin/ui/Skeleton'

interface MediaPickerProps {
  onClose: () => void
  onSelect: (media: Media) => void
  allowMultiple?: boolean
}

export default function MediaPicker({ onClose, onSelect, allowMultiple = false }: MediaPickerProps) {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage] = useState(24)

  // UI state for editing caption/alt before confirming selection
  const [selected, setSelected] = useState<Media | null>(null)
  const [draftCaption, setDraftCaption] = useState('')
  const [draftAlt, setDraftAlt] = useState('')

  useEffect(() => { load() }, [page])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/media', { params: { page, per_page: perPage } })
      const data = res.data.data ?? res.data
      setItems(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  function beginSelect(media: Media) {
    setSelected(media)
    setDraftCaption(media.caption || '')
    setDraftAlt(media.alt || '')
  }

  function cancelSelect() {
    setSelected(null)
    setDraftCaption('')
    setDraftAlt('')
  }

  const { run: confirmSelect, isPending: isConfirming } = useAsyncAction(
    async () => {
      if (!selected) return
      // persist caption/alt back to media record on server
      const payload = { caption: draftCaption || null, alt: draftAlt || null }
      const res = await api.patch(`/media/${selected.id}`, payload)
      const updated = res.data.data ?? res.data
      const m: Media = { ...(Array.isArray(updated) ? updated[0] : updated) }
      onSelect(m)
      onClose()
    },
    { errorMessage: 'Failed to save media metadata' },
  )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] md:w-3/4 max-h-[80vh] overflow-auto p-4 rounded shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Media Library</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
          </div>
        </div>

        {loading ? (
          <SkeletonList count={8} className="grid grid-cols-2 md:grid-cols-4 gap-3" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((it) => (
              <div key={it.id} className="border rounded overflow-hidden p-2 flex flex-col media-thumb">
                <img src={it.url} alt={it.alt ?? it.filename} className="w-full h-32 object-cover mb-2" />
                <div className="flex items-center justify-between">
                  <div className="text-sm truncate mr-2 stitch-heading">{it.filename}</div>
                  <Button variant="unstyled" onClick={() => beginSelect(it)} className="px-2 py-1 btn-stitch">Select</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selection editor modal area */}
        {selected && (
          <div className="mt-4 p-3 border rounded bg-canvas">
            <h4 className="stitch-heading mb-2">Confirm selection</h4>
            <div className="flex gap-4">
              <img src={selected.url} alt={selected.alt ?? selected.filename} className="w-36 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="mb-2">
                  <label className="block mb-1 stitch-heading">Caption</label>
                  <input value={draftCaption} onChange={(e) => setDraftCaption(e.target.value)} className="w-full px-2 py-1 stitch-input" />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 stitch-heading">Alt text</label>
                  <input value={draftAlt} onChange={(e) => setDraftAlt(e.target.value)} className="w-full px-2 py-1 stitch-input" />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="unstyled" onClick={() => confirmSelect()} loading={isConfirming} className="px-3 py-1 btn-stitch btn-primary">Confirm</Button>
                  <Button variant="unstyled" onClick={cancelSelect} disabled={isConfirming} className="px-3 py-1 btn-stitch">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
