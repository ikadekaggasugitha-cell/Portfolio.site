'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import type { ProjectImage, Project } from '@/types'

interface ProjectImageUploadProps {
  project: Project
  onImagesUpdated: () => void
}

export default function ProjectImageUpload({ project, onImagesUpdated }: ProjectImageUploadProps) {
  const [images, setImages] = useState<ProjectImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${project.id}`)
      const imgs: ProjectImage[] = res.data.data?.images || []
      // sort by sort_order if present
      imgs.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      setImages(imgs)
      setOrderChanged(false)
    } catch {
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }, [project.id])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files) return

    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`)
          continue
        }

        if (file.size > 2 * 1024 * 1024) {
          toast.error(`File too large: ${file.name}`)
          continue
        }

        const formData = new FormData()
        formData.append('image', file)

        await api.post(`/projects/${project.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success(`Uploaded: ${file.name}`)
      }

      if (fileInputRef.current) fileInputRef.current.value = ''
      loadImages()
      onImagesUpdated()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm('Delete this image?')) return

    try {
      await api.delete(`/projects/images/${imageId}`)
      toast.success('Image deleted')
      loadImages()
      onImagesUpdated()
    } catch {
      toast.error('Failed to delete image')
    }
  }

  // Media picker
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [mediaItems, setMediaItems] = useState<import('@/types').Media[]>([])
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)

  async function loadMediaLibrary() {
    setLoadingMedia(true)
    try {
      const res = await api.get('/media', { params: { per_page: 48 } })
      const data = res.data.data ?? res.data
      setMediaItems(Array.isArray(data) ? data : data.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load media library')
    } finally {
      setLoadingMedia(false)
    }
  }

  function toggleSelectMedia(id: number) {
    setSelectedMediaIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function attachSelectedMedia() {
    if (selectedMediaIds.length === 0) {
      toast('No media selected')
      return
    }
    try {
      await api.post(`/projects/${project.id}/images/attach`, { media_ids: selectedMediaIds })
      toast.success('Media attached')
      setSelectedMediaIds([])
      setShowMediaPicker(false)
      loadImages()
      onImagesUpdated()
    } catch (err) {
      console.error('Attach media error', err)
      toast.error('Failed to attach media')
    }
  }

  // Drag-and-drop ordering
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [orderChanged, setOrderChanged] = useState(false)

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const next = [...images]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(index, 0, moved)
    setImages(next)
    setDragIndex(null)
    setOrderChanged(true)
  }

  async function saveOrder() {
    try {
      const order = images.map((i) => i.id)
      await api.post(`/projects/${project.id}/images/reorder`, { order })
      toast.success('Order saved')
      setOrderChanged(false)
      loadImages()
      onImagesUpdated()
    } catch (err) {
      console.error('Save order error', err)
      toast.error('Failed to save order')
    }
  }

  function cancelOrder() {
    loadImages()
  }

  if (loading) {
    return <div className="text-center py-6 text-ink-muted-48">Loading images...</div>
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div>
        <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-2">
          Project Images ({images.length}/10)
        </label>
        <div className="border-2 border-dashed border-hairline rounded-[11px] p-6 text-center hover:bg-canvas-parchment transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading || images.length >= 10}
            className="hidden"
          />
          <div className="flex flex-col md:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= 10}
              className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : images.length >= 10 ? 'Maximum images reached' : 'Click to upload or drag and drop'}
            </button>

            <button
              type="button"
              onClick={() => { setShowMediaPicker((s) => !s); if (!showMediaPicker) loadMediaLibrary() }}
              className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline"
            >
              Select from Media Library
            </button>
          </div>

          <p className="text-[12px] leading-[1] tracking-[-0.12px] text-ink-muted-48 mt-2">
            PNG, JPG, GIF, WebP (Max 2MB each)
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold leading-[1] tracking-[-0.12px] text-ink-muted-48 mb-3">Uploaded Images</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className="relative group border border-hairline rounded-[11px] overflow-hidden bg-canvas-parchment aspect-square cursor-move"
              >
                <img
                  src={img.image}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/40 text-white text-[11px] px-2 py-1 rounded">#{idx + 1}</div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {orderChanged && (
            <div className="flex gap-2 mt-3">
              <button onClick={saveOrder} className="bg-primary text-white px-4 py-2 rounded">Save Order</button>
              <button onClick={cancelOrder} className="border border-hairline px-4 py-2 rounded">Cancel</button>
            </div>
          )}

          {/* Media Picker Panel */}
          {showMediaPicker && (
            <div className="mt-4 p-3 border border-hairline rounded bg-canvas">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Media Library</h4>
                <div className="flex gap-2">
                  <button onClick={() => { setShowMediaPicker(false); setSelectedMediaIds([]) }} className="border px-3 py-1 rounded">Close</button>
                  <button onClick={attachSelectedMedia} className="bg-primary text-white px-3 py-1 rounded">Attach Selected</button>
                </div>
              </div>
              {loadingMedia ? (
                <div className="text-center py-6">Loading media...</div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {mediaItems.map((m) => (
                    <div key={m.id} className={`relative border ${selectedMediaIds.includes(m.id) ? 'border-primary' : 'border-hairline'} rounded overflow-hidden cursor-pointer`} onClick={() => toggleSelectMedia(m.id)}>
                      <img src={m.url} alt={m.alt ?? m.filename} className="w-full h-20 object-cover" />
                      <div className="absolute top-1 left-1 bg-black/40 text-white text-xs px-1 rounded">#{m.id}</div>
                      {selectedMediaIds.includes(m.id) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">Selected</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-ink-muted-48">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px]">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
