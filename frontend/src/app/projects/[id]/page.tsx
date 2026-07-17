'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { Project } from '@/types'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => setProject(res.data.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-[50vh] flex items-center justify-center">
        <p className="font-body-md text-on-surface-variant">
          Loading...
        </p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-surface text-on-surface min-h-[50vh] flex flex-col items-center justify-center px-gutter">
        <h1 className="font-headline-xl text-headline-xl mb-md">
          Project not found
        </h1>
        <Link
          href="/projects"
          className="font-label-sm text-primary hover:text-primary-container transition-colors"
        >
          &larr; Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface text-on-surface">
      <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in">
        <div className="max-w-container-max mx-auto">
          <Link
            href="/projects"
            className="font-label-sm text-primary hover:text-primary-container transition-colors mb-lg inline-block"
          >
            &larr; Back to projects
          </Link>

          <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-primary-fixed mb-md leading-tight">
            {project.title}
          </h1>

          {project.technology && (
            <div className="flex flex-wrap gap-sm mb-lg">
              {project.technology.split(',').map((t) => (
                <span
                  key={t}
                  className="font-label-sm bg-surface-variant/50 text-on-surface-variant px-md py-xs rounded"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-xl">
              {project.images.map((img) => (
                <div
                  key={img.id}
                  className="bg-surface-container-high rounded-xl h-48 flex items-center justify-center text-on-surface-variant"
                >
                  {img.image}
                </div>
              ))}
            </div>
          )}

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[680px]">
            {project.description || 'No description.'}
          </p>

          <div className="flex gap-md">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-surface-tile-1 text-on-surface font-label-sm px-md py-sm rounded-lg hover:bg-surface-tile-2 transition-all"
              >
                View on GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-container text-on-primary-container font-label-sm px-md py-sm rounded-lg transition-all scale-95 hover:scale-100 active:scale-95"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
