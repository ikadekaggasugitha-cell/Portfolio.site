'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Profile, Skill, Experience, Education, Certificate } from '@/types'

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => ({ data: { data: [] } })),
      api.get('/skills'),
      api.get('/experiences'),
      api.get('/educations'),
      api.get('/certificates'),
    ]).then(([p, s, e, ed, c]) => {
      setProfile(p.data.data?.[0] ?? null)
      setSkills(s.data.data ?? [])
      setExperiences(e.data.data ?? [])
      setEducations(ed.data.data ?? [])
      setCertificates(c.data.data ?? [])
    })
  }, [])

  return (
    <div className="bg-surface text-on-surface">
      <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in">
        <div className="max-w-container-max mx-auto">
          <h1 className="font-headline-xl text-headline-xl md:text-headline-xl text-primary-fixed mb-md leading-tight">
            {profile?.name || 'About'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-md max-w-[680px]">
            {profile?.description || 'No description yet.'}
          </p>
          <div className="flex gap-md">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-sm text-primary hover:text-primary-container transition-colors"
              >
                GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-sm text-primary hover:text-primary-container transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-surface-container text-on-surface py-xl px-gutter animate-float-in animate-stagger-2">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
            Skills
          </h2>
          <div className="flex flex-wrap gap-sm">
            {skills.map((s) => (
              <span
                key={s.id}
                className="bg-primary/10 border border-primary/20 text-primary font-label-sm px-md py-xs rounded-lg hover:bg-primary/20 transition-colors cursor-default"
              >
                {s.skill_name} ({s.level}/5)
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in animate-stagger-3">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
            Experience
          </h2>
          <div className="space-y-lg">
            {experiences.map((exp) => (
              <div key={exp.id} className="glass-card p-md border border-outline-variant/30 rounded-lg">
                <h3 className="font-headline-md text-white mb-xs">
                  {exp.position}
                </h3>
                <p className="font-body-md text-on-surface-variant mt-xs">
                  {exp.company}
                </p>
                <p className="font-label-sm text-on-surface-variant mt-xs opacity-70">
                  {exp.start_date} &mdash; {exp.end_date || 'Present'}
                </p>
                {exp.description && (
                  <p className="font-body-md text-on-surface-variant mt-sm">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container text-on-surface py-xl px-gutter animate-float-in animate-stagger-3">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="glass-card p-md border border-outline-variant/30 rounded-lg hover:border-primary/40 transition-all"
              >
                <h3 className="font-headline-md text-white mb-xs">
                  {edu.degree || 'Degree'}
                </h3>
                <p className="font-body-md text-on-surface-variant mt-xs">
                  {edu.institution}
                </p>
                {edu.field_of_study && (
                  <p className="font-body-md text-on-surface-variant">
                    {edu.field_of_study}
                  </p>
                )}
                <p className="font-label-sm text-on-surface-variant mt-sm opacity-70">
                  {edu.start_date} &mdash; {edu.end_date || 'Present'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {certificates.length > 0 && (
        <section className="bg-surface text-on-surface py-xl px-gutter animate-float-in animate-stagger-3">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
              Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="glass-card p-md border border-outline-variant/30 rounded-lg hover:border-primary/40 transition-all"
                >
                  <h3 className="font-headline-md text-white mb-xs">
                    {cert.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mt-xs">
                    {cert.issuer}
                  </p>
                  <p className="font-label-sm text-on-surface-variant mt-sm opacity-70">
                    {cert.issued_date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
