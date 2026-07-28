'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import Spinner from './Spinner'

interface GlobalLoadingContextValue {
  show: (message?: string) => void
  hide: () => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(null)

/**
 * Blocking, page-level loading overlay — reserved for operations that make
 * the whole screen unusable (auth bootstrap, route-level data loads, bulk
 * actions). Per-row/per-form saves should use <Button loading> instead so
 * the rest of the page stays interactive.
 */
export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const show = useCallback((msg?: string) => setMessage(msg ?? 'Loading...'), [])
  const hide = useCallback(() => setMessage(null), [])
  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      {message && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,16,37,0.6)] backdrop-blur-sm"
        >
          <div className="card-stitch flex items-center gap-3 px-6 py-4">
            <Spinner className="h-5 w-5 border-2 text-primary" />
            <span className="text-[14px] font-semibold text-ink">{message}</span>
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext)
  if (!ctx) throw new Error('useGlobalLoading must be used within GlobalLoadingProvider')
  return ctx
}
