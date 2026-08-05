'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import type { ProjectImage, Project } from '@/types'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { pingRevalidate } from '@/lib/revalidate'
import Button from '@/components/admin/ui/Button'
import ProgressBar from '@/components/admin/ui/ProgressBar'
import { SkeletonList } from '@/components/admin/ui/Skeleton'

interface ProjectImageUploadProps {
  project: Project
  onImagesUpdated: () => void
}

/** Mirrors ProjectImageController::MAX_IMAGES. The server rejects anything past this;
 *  this only keeps the UI honest so the user isn't surprised by a 422. */
const MAX_IMAGES = 5

export default function ProjectImageUpload({ project, onImagesUpdated }: ProjectImageUploadProps) {
  const [images, setImages] = useState<ProjectImage[]>([])
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
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

    const remaining = MAX_IMAGES - images.length
    if (files.length > remaining) {
      toast.error(
        remaining === 0
          ? `Maximum ${MAX_IMAGES} images. Remove one first.`
          : `Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added (max ${MAX_IMAGES}).`,
      )
      return
    }

    setUploadProgress(0)
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
          onUploadProgress: (evt) => {
            if (!evt.total) return
            const filePercent = evt.loaded / evt.total
            setUploadProgress(Math.round(((i + filePercent) / files.length) * 100))
          },
        })
        toast.success(`Uploaded: ${file.name}`)
      }

      if (fileInputRef.current) fileInputRef.current.value = ''
      loadImages()
      onImagesUpdated()
      pingRevalidate('projects')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploadProgress(null)
    }
  }

  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const { run: handleDeleteImage } = useAsyncAction(
    async (imageId: number) => {
      setDeletingImageId(imageId)
      try {
        await api.delete(`/projects/images/${imageId}`)
        loadImages()
        onImagesUpdated()
      } finally {
        setDeletingImageId(null)
      }
    },
    { successMessage: 'Image deleted', errorMessage: 'Failed to delete image', revalidateTags: 'projects' },
  )

  function confirmDeleteImage(imageId: number) {
    if (!confirm('Delete this image?')) return
    handleDeleteImage(imageId)
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

  const { run: runAttachSelectedMedia, isPending: isAttaching } = useAsyncAction(
    async () => {
      await api.post(`/projects/${project.id}/images/attach`, { media_ids: selectedMediaIds })
      setSelectedMediaIds([])
      setShowMediaPicker(false)
      loadImages()
      onImagesUpdated()
    },
    { successMessage: 'Media attached', errorMessage: 'Failed to attach media', revalidateTags: 'projects' },
  )

  function attachSelectedMedia() {
    if (selectedMediaIds.length === 0) {
      toast('No media selected')
      return
    }
    const remaining = MAX_IMAGES - images.length
    if (selectedMediaIds.length > remaining) {
      toast.error(
        remaining === 0
          ? `Maximum ${MAX_IMAGES} images. Remove one first.`
          : `Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added (max ${MAX_IMAGES}).`,
      )
      return
    }
    runAttachSelectedMedia()
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

  const { run: saveOrder, isPending: isSavingOrder } = useAsyncAction(
    async () => {
      const order = images.map((i) => i.id)
      await api.post(`/projects/${project.id}/images/reorder`, { order })
      setOrderChanged(false)
      loadImages()
      onImagesUpdated()
    },
    { successMessage: 'Order saved', errorMessage: 'Failed to save order', revalidateTags: 'projects' },
  )

  function cancelOrder() {
    loadImages()
  }

  if (loading) {
    return <SkeletonList count={3} className="grid grid-cols-2 md:grid-cols-3 gap-3" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div>
        <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-2">
          Project Images ({images.length}/{MAX_IMAGES})
        </label>
        <div className="border-2 border-dashed border-hairline rounded-[11px] p-6 text-center hover:bg-canvas-parchment transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploadProgress !== null || images.length >= MAX_IMAGES}
            className="hidden"
          />
          <div className="flex flex-col md:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadProgress !== null || images.length >= MAX_IMAGES}
              className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadProgress !== null
                ? 'Uploading...'
                : images.length >= MAX_IMAGES
                  ? `Maximum ${MAX_IMAGES} images reached`
                  : 'Click to upload or drag and drop'}
            </button>

            <button
              type="button"
              onClick={() => { setShowMediaPicker((s) => !s); if (!showMediaPicker) loadMediaLibrary() }}
              className="text-primary text-[14px] leading-[1.29] tracking-[-0.224px] hover:underline"
            >
              Select from Media Library
            </button>
          </div>

          {uploadProgress !== null && (
            <div className="mt-3 max-w-xs mx-auto">
              <ProgressBar percent={uploadProgress} />
            </div>
          )}

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/40 text-white text-[11px] px-2 py-1 rounded">#{idx + 1}</div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={() => confirmDeleteImage(img.id)}
                    loading={deletingImageId === img.id}
                    loadingText="Deleting..."
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {orderChanged && (
            <div className="flex gap-2 mt-3">
              <Button variant="unstyled" onClick={() => saveOrder()} loading={isSavingOrder} className="bg-primary text-white px-4 py-2 rounded">Save Order</Button>
              <Button variant="unstyled" onClick={cancelOrder} disabled={isSavingOrder} className="border border-hairline px-4 py-2 rounded">Cancel</Button>
            </div>
          )}

          {/* Media Picker Panel */}
          {showMediaPicker && (
            <div className="mt-4 p-3 border border-hairline rounded bg-canvas">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Media Library</h4>
                <div className="flex gap-2">
                  <Button variant="unstyled" onClick={() => { setShowMediaPicker(false); setSelectedMediaIds([]) }} disabled={isAttaching} className="border px-3 py-1 rounded">Close</Button>
                  <Button variant="unstyled" onClick={attachSelectedMedia} loading={isAttaching} className="bg-primary text-white px-3 py-1 rounded">Attach Selected</Button>
                </div>
              </div>
              {loadingMedia ? (
                <SkeletonList count={6} className="grid grid-cols-3 md:grid-cols-6 gap-2" />
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {mediaItems.map((m) => (
                    <div key={m.id} className={`relative border ${selectedMediaIds.includes(m.id) ? 'border-primary' : 'border-hairline'} rounded overflow-hidden cursor-pointer`} onClick={() => toggleSelectMedia(m.id)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
      {images.length === 0 && uploadProgress === null && (
        <div className="text-center py-8 text-ink-muted-48">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px]">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
