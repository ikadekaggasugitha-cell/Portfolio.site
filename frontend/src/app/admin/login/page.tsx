'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Login successful')
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-10 text-ink">
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-hairline bg-surface p-1 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="grid gap-8 overflow-hidden rounded-[30px] bg-canvas p-8 md:grid-cols-[1.45fr_1fr] md:p-10">
          <div className="flex flex-col justify-center gap-8">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">Admin Portal</span>
            <div className="max-w-2xl space-y-4">
              <h1 className="font-display text-5xl font-semibold leading-tight text-ink stitch-heading">Admin Login</h1>
              <p className="text-base leading-8 text-muted">Sign in to manage your portfolio content, media, and pages from the admin dashboard.</p>
            </div>
            <div className="rounded-[24px] bg-surface/95 p-6 border border-hairline shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
              <p className="text-sm text-muted uppercase tracking-[0.2em] mb-3">Need help?</p>
              <p className="text-sm leading-6 text-body-on-dark">Use your admin email and password. If you don&apos;t have access, contact your site administrator.</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-[320px] min-w-[280px] rounded-[28px] border border-hairline bg-surface p-8 shadow-[0_15px_40px_rgba(0,0,0,0.18)]">
              <p className="text-sm text-muted mb-4 uppercase tracking-[0.16em]">Secure login</p>
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full stitch-input text-base leading-7 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-semibold text-ink mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full stitch-input text-base leading-7 px-4 py-3 pr-12 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-muted"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                          <path d="M1 1l22 22" />
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.03 0-9.32-3.11-11-7.5a15.93 15.93 0 0 1 4.17-5.48" />
                          <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
                          <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-stitch btn-primary text-base font-semibold leading-[1.2] px-5 py-3 rounded-full disabled:opacity-50 transition-opacity"
                >
                  {submitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
