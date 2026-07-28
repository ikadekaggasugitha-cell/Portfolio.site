'use client'

import { useCallback, useEffect, useState, useRef, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Profile, Media } from '@/types'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import Button from '@/components/admin/ui/Button'
import ProgressBar from '@/components/admin/ui/ProgressBar'
import { SkeletonForm } from '@/components/admin/ui/Skeleton'

const MediaPicker = dynamic(() => import('@/components/admin/MediaPicker'), { ssr: false })

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    phone: '',
    email: '',
    location: '',
    github: '',
    linkedin: '',
  })
  const [isAvailable, setIsAvailable] = useState(true)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoMediaId, setPhotoMediaId] = useState<number | null>(null)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(false)
    return api
      .get('/profile')
      .then((res) => {
        const p = res.data.data?.[0]
        if (p) {
          setProfile(p)
          setForm({
            name: p.name || '',
            title: p.title || '',
            description: p.description || '',
            phone: p.phone || '',
            email: p.email || '',
            location: p.location || '',
            github: p.github || '',
            linkedin: p.linkedin || '',
          })
          setIsAvailable(p.is_available ?? true)
          setPhotoUrl(p.photo || null)
          setPhotoMediaId(p.photo_media_id ?? null)
        } else {
          setProfile(null)
        }
      })
      .catch((err) => {
        console.error(err)
        setLoadError(true)
        toast.error('Failed to load profile')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const { run: submit, isPending: isSaving } = useAsyncAction(
    async () => {
      if (!profile) throw new Error('Profile has not loaded yet')
      const payload: Record<string, unknown> = { ...form, is_available: isAvailable }
      // prefer storing media reference when available
      if (photoMediaId) {
        payload['photo_media_id'] = photoMediaId
      } else {
        payload['photo'] = photoUrl
      }
      await api.put(`/profile/${profile.id}`, payload)
    },
    { successMessage: 'Profile updated', errorMessage: 'Failed to update profile' },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files || files.length === 0) return
    try {
      setUploadProgress(0)
      const fd = new FormData()
      fd.append('file', files[0])
      const res = await api.post('/media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100))
        },
      })
      const media = res.data.data ?? res.data
      // If API returns resource object or data wrapper
      const m = Array.isArray(media) ? media[0] : media
      setPhotoUrl(m.url)
      setPhotoMediaId(m.id ?? null)
      toast.success('Uploaded and set as profile photo')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    } finally {
      setUploadProgress(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleSelectMedia(m: Media) {
    setPhotoUrl(m.url)
    setPhotoMediaId(m.id ?? null)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">
          Profile
        </h1>
        <SkeletonForm />
      </div>
    )
  }

  if (loadError || !profile) {
    return (
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">
          Profile
        </h1>
        <div className="card-stitch p-6 max-w-2xl text-center space-y-3">
          <p className="text-ink">
            {loadError ? 'Could not load the profile.' : 'No profile exists yet.'}
          </p>
          <Button variant="primary" onClick={() => load()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink mb-6">
        Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="card-stitch bg-canvas border border-hairline rounded-[18px] p-6 max-w-2xl space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-surface flex items-center justify-center border border-hairline">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile photo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-2xl text-ink-muted-48">👤</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={fileRef} onChange={handleFileUpload} type="file" accept="image/*" className="hidden" disabled={uploadProgress !== null} />
            <div className="flex gap-2">
              <Button type="button" loading={uploadProgress !== null} loadingText="Uploading..." onClick={() => fileRef.current?.click()}>Upload Photo</Button>
              <Button type="button" onClick={() => setShowMediaPicker(true)}>Choose from Media</Button>
              <Button type="button" variant="danger" onClick={() => setPhotoUrl(null)}>Clear</Button>
            </div>
            {uploadProgress !== null && <ProgressBar percent={uploadProgress} />}
            <div className="text-sm text-muted">Photo will be displayed on the public homepage.</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hello@example.com"
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="profile-location" className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              Location
            </label>
            <input
              id="profile-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Bali, Indonesia"
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              GitHub URL
            </label>
            <input
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
              LinkedIn URL
            </label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-canvas border border-hairline text-[17px] leading-[1.47] tracking-[-0.374px] text-ink px-4 py-2.5 rounded-[11px] placeholder:text-ink-muted-48 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative h-6 w-11 shrink-0 rounded-full border border-hairline bg-canvas-parchment transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
          />
          <span>
            <span className="block text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink">Available for work</span>
            <span className="block text-[12px] leading-[1.3] text-muted">Shows the availability status across the public site.</span>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          loading={isSaving}
          loadingText="Saving..."
          className="text-[17px] font-normal leading-[1] tracking-[-0.374px] px-[22px] py-[11px] rounded-full hover:opacity-90 transition-opacity"
        >
          Save Changes
        </Button>
      </form>

      {showMediaPicker && (
        <MediaPicker onClose={() => setShowMediaPicker(false)} onSelect={handleSelectMedia} />
      )}

    </div>
  )
}
