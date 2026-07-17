'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import type { Project } from '@/types'

export default function ProjectsContent() {
  const searchParams = useSearchParams()
  const skillFilter = searchParams.get('skill')
  
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [technology, setTechnology] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (technology) params.set('technology', technology)

    api.get(`/projects?${params.toString()}`).then((res) => {
      setProjects(res.data.data ?? [])
    })
  }, [search, technology])

  const allTechs = [
    ...new Set(
      projects.flatMap(
        (p) => p.technology?.split(',').map((t) => t.trim()) ?? [],
      ),
    ),
  ]

  // Filter projects berdasarkan skill query parameter
  const filteredProjects = skillFilter
    ? projects.filter((p) =>
        p.technology
          ?.split(',')
          .map((t) => t.trim().toLowerCase())
          .includes(skillFilter.toLowerCase())
      )
    : projects

  return (
    <div className="bg-surface text-on-surface">
      <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in">
        <div className="max-w-container-max mx-auto">
          <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-primary-fixed mb-lg leading-tight">
            Projects {skillFilter && <span className="text-primary-fixed-dim text-body-lg ml-md">• {skillFilter}</span>}
          </h1>

          {skillFilter && (
            <div className="mb-lg flex items-center gap-md">
              <span className="font-body-md text-on-surface-variant">Filtering by skill:</span>
              <span className="px-md py-xs bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-lg">
                {skillFilter}
              </span>
              <Link
                href="/projects"
                className="text-primary hover:text-primary-fixed transition-colors font-label-sm"
              >
                Clear Filter
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-md mb-xl">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-surface-container border border-outline-variant text-body-md text-on-surface px-md py-sm rounded-lg placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="bg-surface-container border border-outline-variant font-label-sm text-on-surface px-md py-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="">All Technologies</option>
              {allTechs.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {filteredProjects.length === 0 ? (
            <p className="font-body-md text-on-surface-variant text-center py-xl">
              {skillFilter ? `No projects found using ${skillFilter}.` : 'No projects found.'}
            </p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="glass-card border border-outline-variant/20 rounded-xl p-md card-hover animate-fade-in-up"
              >
                  <h2 className="font-headline-md text-white mb-xs">
                    {project.title}
                  </h2>
                  <p className="font-body-md text-on-surface-variant line-clamp-3">
                    {project.description}
                  </p>
                  {project.technology && (
                    <div className="mt-md flex flex-wrap gap-xs">
                      {project.technology.split(',').map((t) => (
                        <span
                          key={t}
                          className="font-label-sm bg-surface-variant/50 text-on-surface-variant px-xs py-0.5 rounded"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-md flex gap-md">
                    {project.github_url && (
                      <span className="font-label-sm text-primary">
                        GitHub
                      </span>
                    )}
                    {project.demo_url && (
                      <span className="font-label-sm text-primary">
                        Demo
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
