import { useCallback, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { pingRevalidate } from '@/lib/revalidate'

function extractErrorMessage(err: unknown): string | undefined {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string } | undefined)?.message
  }
  return undefined
}

interface UseAsyncActionOptions {
  successMessage?: string
  /** Static message, or a function to derive one from the caught error. */
  errorMessage?: string | ((err: unknown) => string | undefined)
  /** Public-site cache tag(s) to bust on success (e.g. 'profile', 'skills'). */
  revalidateTags?: string | string[]
}

/**
 * Standardizes the try/await/toast.success/catch/toast.error shape repeated
 * across every admin CRUD page, plus tracks a single `isPending` flag to
 * drive <Button loading> and prevent double-submits.
 */
export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<void>,
  { successMessage, errorMessage, revalidateTags }: UseAsyncActionOptions = {},
) {
  const [isPending, setIsPending] = useState(false)

  const run = useCallback(
    async (...args: Args) => {
      setIsPending(true)
      try {
        await action(...args)
        // Awaited, not fire-and-forget: the purge is what makes the edit visible on
        // the public site, and an un-awaited request can be dropped when the save is
        // followed by a navigation. It only marks caches stale, so it is cheap.
        if (revalidateTags) await pingRevalidate(revalidateTags)
        if (successMessage) toast.success(successMessage)
      } catch (err) {
        console.error(err)
        const custom = typeof errorMessage === 'function' ? errorMessage(err) : errorMessage
        toast.error(custom || extractErrorMessage(err) || 'Something went wrong')
      } finally {
        setIsPending(false)
      }
    },
    [action, successMessage, errorMessage, revalidateTags],
  )

  return { run, isPending }
}
