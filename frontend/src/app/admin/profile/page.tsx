'use client'

import { useEffect, useState, useRef, type FormEvent } from 'react'
import api from '@/lib/api'
import type { Profile, Media } from '@/types'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

const MediaPicker = dynamic(() => import('@/components/admin/MediaPicker'), { ssr: false })

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
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
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    api
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
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
    try {
      const payload: Record<string, unknown> = { ...form, is_available: isAvailable }
      // prefer storing media reference when available
      if (photoMediaId) {
        ;(payload as Record<string, unknown>)['photo_media_id'] = photoMediaId
      } else {
        ;(payload as Record<string, unknown>)['photo'] = photoUrl
      }
      await api.put(`/profile/${profile.id}`, payload)
      toast.success('Profile updated')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update profile')
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files || files.length === 0) return
    try {
      const fd = new FormData()
      fd.append('file', files[0])
      const res = await api.post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const media = res.data.data ?? res.data
      // If API returns resource object or data wrapper
      const m = Array.isArray(media) ? media[0] : media
      setPhotoUrl(m.url)
      setPhotoMediaId(m.id ?? null)
      toast.success('Uploaded and set as profile photo')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    }
  }

  function handleSelectMedia(m: Media) {
    setPhotoUrl(m.url)
    setPhotoMediaId(m.id ?? null)
  }

  if (loading) {
    return <div className="text-center py-12 text-ink-muted-48">Loading...</div>
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
            <input ref={fileRef} onChange={handleFileUpload} type="file" accept="image/*" className="hidden" />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-stitch">Upload Photo</button>
              <button type="button" onClick={() => setShowMediaPicker(true)} className="btn-stitch">Choose from Media</button>
              <button type="button" onClick={() => setPhotoUrl(null)} className="btn-stitch text-danger">Clear</button>
            </div>
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

        <button
          type="submit"
          className="btn-stitch btn-primary text-[17px] font-normal leading-[1] tracking-[-0.374px] px-[22px] py-[11px] rounded-full hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </form>

      {showMediaPicker && (
        <MediaPicker onClose={() => setShowMediaPicker(false)} onSelect={handleSelectMedia} />
      )}

    </div>
  )
}
