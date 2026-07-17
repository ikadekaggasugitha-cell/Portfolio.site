'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import type { Profile, Skill, Experience, Project } from '@/types'
import Carousel from '@/components/Carousel'
import { LanyardProfile } from '@/components/public/LanyardProfile'

export default function HomePage() {
  const skillsSectionRef = useRef<HTMLElement>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => ({ data: { data: [] } })),
      api.get('/skills'),
      api.get('/experiences'),
      api.get('/projects'),
    ]).then(([p, s, e, pr]) => {
      setProfile(p.data.data?.[0] ?? null)
      setSkills(s.data.data ?? [])
      setExperiences(e.data.data ?? [])
      setProjects(pr.data.data ?? [])
    })
  }, [])

  const currentExperience = experiences.find((e) => !e.end_date)
  const allProjects = projects.slice(0, 4)

  // Enrich projects with images if list endpoint doesn't include them
  useEffect(() => {
    if (!projects || projects.length === 0) return

    const needEnrich = allProjects.some((p) => !p.images || p.images.length === 0)
    if (!needEnrich) return

    let mounted = true
    ;(async () => {
      try {
        const enriched = await Promise.all(allProjects.map(async (p) => {
          try {
            const res = await api.get(`/projects/${p.id}`)
            const detailed = res.data.data
            return { ...p, images: detailed.images || [] }
          } catch {
            return p
          }
        }))
        if (mounted) {
          // replace first N projects with enriched versions
          setProjects((prev) => {
            const next = [...prev]
            for (let i = 0; i < enriched.length; i++) {
              const idx = next.findIndex((x) => x.id === enriched[i].id)
              if (idx !== -1) next[idx] = enriched[i]
            }
            return next
          })
        }
      } catch (error) {
        console.error('Failed to enrich project images', error)
      }
    })()

    return () => { mounted = false }
  }, [projects])

  const scrollToSkills = () => {
    skillsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }


  const getSkillIcon = (skillName: string): React.ReactNode => {
    const iconMap: { [key: string]: string } = {
      'Docker': 'docker',
      'Go': 'go',
      'JavaScript': 'javascript',
      'React': 'react',
      'Vue.js': 'vuedotjs',
      'PHP': 'php',
      'MySQL': 'mysql',
      'Laravel': 'laravel',
      'Next.js': 'nextdotjs',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Node.js': 'nodedotjs',
      'PostgreSQL': 'postgresql',
      'MongoDB': 'mongodb',
      'Redis': 'redis',
      'Kubernetes': 'kubernetes',
      'AWS': 'amazonaws',
      'Git': 'git',
      'Linux': 'linux',
      'Tailwind CSS': 'tailwindcss',
      'HTML5': 'html5',
      'CSS3': 'css3',
    }
    
    const iconName = iconMap[skillName]
    
    if (iconName) {
      return (
        <img 
          src={`https://cdn.simpleicons.org/${iconName}/00daf3`}
          alt={skillName}
          className="w-9 h-9"
          loading="lazy"
        />
      )
    }
    
    return <span className="text-[20px] mb-1">📦</span>
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">
      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-gutter pt-14 lg:pt-16">
        
        {/* Hero Section - Full Width */}
        <section className="relative min-h-[90vh] flex items-start pt-8 lg:pt-12 overflow-x-clip">
          <div className="max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative z-10">
            <div className="space-y-md">
              <div className="flex items-center space-x-sm text-primary-fixed-dim">
                <div className="w-2 h-2 rounded-full bg-primary-fixed-dim status-pulse"></div>
                <span className="font-label-sm tracking-widest uppercase text-body-md md:text-body-lg">System Operational // Availability: High</span>
              </div>
              <h1 className="font-headline-xl text-[3.1rem] md:text-[4.5rem] text-primary-fixed leading-tight">
                {profile?.name || 'I Kadek Agga Sugitha'}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                {profile?.title || 'Fullstack Software Engineer'}
              </p>
              {currentExperience && (
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Currently {currentExperience.position} at {currentExperience.company}
                </p>
              )}
              <div className="flex flex-wrap gap-sm pt-md">
                <span className="px-md py-xs bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-lg">#Cloud_Architect</span>
                <span className="px-md py-xs bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-lg">#DevSecOps</span>
                <span className="px-md py-xs bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-lg">#Fullstack_JS</span>
              </div>
              <div className="pt-lg flex space-x-md">
                <button 
                  onClick={scrollToSkills}
                  className="bg-primary-container text-on-primary-container font-headline-md px-md py-sm rounded-lg transition-all scale-95 hover:scale-100 active:scale-95">
                  View Stack
                </button>
                <Link 
                  href="/about"
                  className="border border-outline-variant text-on-surface font-headline-md px-md py-sm rounded-lg transition-all hover:bg-surface-bright/30 inline-block">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex lg:justify-center relative self-start">
              <LanyardProfile />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section ref={skillsSectionRef} className="py-xl px-gutter max-w-container-max mx-auto">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Skills</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {skills.slice(0, 10).map((skill, index) => (
              <Link
                key={skill.id}
                href={`/projects?skill=${encodeURIComponent(skill.skill_name)}`}
                className="flex flex-col items-center justify-center border border-outline-variant/30 rounded-xl p-4 h-[76px] hover:border-primary hover:bg-surface-container/50 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-[20px] mb-1">{getSkillIcon(skill.skill_name)}</span>
                <span className="font-label-sm text-on-surface-variant">{skill.skill_name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Projects Section */}
        <section className="py-xl px-gutter max-w-container-max mx-auto">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Recent Projects</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {allProjects.map((project, i) => (
              <div
                key={project.id}
                className="glass-card rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Project Image/Preview */}
                <div className="bg-surface-container h-48 relative overflow-hidden group">
                  {project.images && project.images.length > 0 ? (
                    <Carousel images={project.images} autoRotate={true} rotationInterval={5000} />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary-fixed-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Project Info */}
                <div className="p-md">
                  <h3 className="font-headline-md text-white mb-xs">
                    {project.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-md line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-xs mb-md">
                    {project.technology?.split(',').slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-variant/50 text-on-surface-variant px-xs py-0.5 rounded font-label-sm"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="border border-outline-variant text-on-surface font-label-sm px-md py-sm rounded transition-all hover:border-primary hover:text-primary inline-block">
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style jsx global>{`
        .status-pulse {
          animation: statusPulse 2s infinite;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-delay-1 {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}