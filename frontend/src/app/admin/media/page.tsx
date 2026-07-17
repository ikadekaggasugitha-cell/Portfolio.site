'use client'

import MediaLibrary from '@/components/admin/MediaLibrary'

export default function AdminMediaPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">Media Library</h1>
      </div>
      <div className="card-stitch p-6">
        <MediaLibrary />
      </div>
    </div>
  )
}
