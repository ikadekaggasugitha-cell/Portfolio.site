'use client'

import type { ProjectMotif } from '@/lib/marketing/content'
import { ProjectSlider } from './project-slider'

/**
 * Project detail screenshots. A thin wrapper over ProjectSlider so the detail page and the
 * homepage case-study modal share one implementation — this used to be a static main image
 * plus a thumbnail strip, with no way to page through it on touch.
 */
export function ProjectGallery({
  images,
  title,
  motif,
}: {
  images: string[]
  title: string
  motif: ProjectMotif
}) {
  return <ProjectSlider images={images} title={title} motif={motif} priority showThumbnails />
}
