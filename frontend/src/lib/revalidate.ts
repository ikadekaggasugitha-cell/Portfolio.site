/**
 * Best-effort ping to /api/revalidate after an admin save, so the public
 * site's ISR cache for that resource is busted immediately instead of
 * waiting out its revalidate window. Never throws — a failed ping just
 * means the public site shows the change a bit later, not an admin error.
 */
export async function pingRevalidate(tags: string | string[]) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: Array.isArray(tags) ? tags : [tags] }),
    })
  } catch {
    /* best-effort */
  }
}
