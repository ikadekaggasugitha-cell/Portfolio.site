'use client'

import { Suspense } from 'react'
import ProjectsContent from './projects-content'

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="text-center py-xl text-on-surface">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  )
}
