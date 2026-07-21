'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ProjectMotif } from '@/lib/marketing/content'
import { cn } from '@/lib/utils'
import { ProjectMockup } from './project-mockup'

/** Main image + thumbnail strip. Falls back to the stylized mockup when a
 *  project has no screenshots. */
export function ProjectGallery({
  images,
  title,
  motif,
}: {
  images: string[]
  title: string
  motif: ProjectMotif
}) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-mk border border-mk-hairline shadow-mk-md">
        <ProjectMockup motif={motif} />
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-mk border border-mk-hairline bg-mk-subtle shadow-mk-md">
        <Image
          src={images[active]}
          alt={`${title} — screenshot ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 880px"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative aspect-[16/10] w-24 flex-none overflow-hidden rounded-lg border-2 transition-colors',
                i === active ? 'border-mk-brand' : 'border-mk-hairline hover:border-mk-brand-soft',
              )}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
