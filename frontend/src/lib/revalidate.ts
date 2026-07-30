/**
 * Ping /api/revalidate after an admin save, so the public site's cache for that
 * resource is busted immediately instead of waiting out its revalidate window.
 *
 * Never throws — a failed ping means the public site shows the change a bit later,
 * not an admin error. `keepalive` lets the request finish even if the save is the
 * last thing the admin does before navigating away or closing the tab, which is
 * exactly when a dropped ping would go unnoticed.
 */
export async function pingRevalidate(tags: string | string[]) {
  try {
    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: Array.isArray(tags) ? tags : [tags] }),
      keepalive: true,
    })
    if (!res.ok) {
      console.warn('[revalidate] cache purge rejected', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.warn('[revalidate] cache purge failed', err)
  }
}
