'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import type {
  Profile,
  Skill,
  Experience,
  Education,
  Project,
  Certificate,
  Message,
} from '@/types'

interface DashboardData {
  profile: Profile | null
  skills: Skill[]
  experiences: Experience[]
  educations: Education[]
  projects: Project[]
  certificates: Certificate[]
  messages: Message[]
}

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => ({ data: { data: null } })),
      api.get('/skills'),
      api.get('/experiences'),
      api.get('/educations'),
      api.get('/projects'),
      api.get('/certificates'),
      api.get('/messages'),
    ])
      .then(
        ([profile, skills, experiences, educations, projects, certificates, messages]) => {
          setData({
            profile: profile.data.data?.[0] || null,
            skills: skills.data.data,
            experiences: experiences.data.data,
            educations: educations.data.data,
            projects: projects.data.data,
            certificates: certificates.data.data,
            messages: messages.data.data,
          })
        },
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-ink-muted-48">Loading...</div>
  }

  return (
    <div className="space-y-6 animate-float-in">
      <div>
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">
          Welcome, {user?.name}
        </h1>
        <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-muted">
          Here is an overview of your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Skills" count={data?.skills.length ?? 0} />
        <StatCard label="Experiences" count={data?.experiences.length ?? 0} />
        <StatCard label="Educations" count={data?.educations.length ?? 0} />
        <StatCard label="Projects" count={data?.projects.length ?? 0} />
        <StatCard label="Certificates" count={data?.certificates.length ?? 0} />
        <StatCard label="Messages" count={data?.messages.length ?? 0} />
      </div>

      {data?.messages && data.messages.filter((m) => !m.is_read).length > 0 && (
        <div className="bg-canvas-parchment border border-hairline rounded-[11px] p-4">
          <p className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-ink">
            You have {data.messages.filter((m) => !m.is_read).length} unread
            message(s).
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  count,
}: {
  label: string
  count: number
}) {
  return (
    <div className="card-stitch p-5 card-hover">
      <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted">
        {label}
      </p>
      <p className="font-display text-[40px] font-semibold leading-[1.1] text-ink mt-1">
        {count}
      </p>
    </div>
  )
}
