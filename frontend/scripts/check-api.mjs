/**
 * Build preflight: refuse to build the public site against an unreachable API.
 *
 * Why this exists. Every public page renders from the portfolio API. When the API is down
 * at build time the pages still render — from the static placeholder copy in
 * `src/lib/marketing/content.ts` — and Next bakes that into the prerendered HTML. The
 * deploy then goes green while publishing content the owner never wrote, and it survives
 * until something purges the cache. That is exactly how the live site ended up showing
 * `hello@agga.dev` instead of the real profile.
 *
 * Failing here instead keeps the previous, correct deployment serving traffic.
 *
 * Escape hatch: set ALLOW_DEGRADED_BUILD=true to ship anyway (placeholder copy included).
 */

const BASE = (process.env.API_BACKEND_URL ?? 'http://localhost:8000').replace(/\/+$/, '')
const HEALTH_URL = `${BASE}/api/v1/health`

// The API is PHP-on-Vercel against a managed MySQL: ~6s warm, >10s cold.
const TIMEOUT_MS = Number(process.env.API_FETCH_TIMEOUT_MS) || 20000
const ATTEMPTS = 3

const red = (s) => `\x1b[31m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`

if (process.env.ALLOW_DEGRADED_BUILD === 'true') {
  console.warn(yellow('⚠  ALLOW_DEGRADED_BUILD=true — skipping the API preflight.'))
  console.warn(yellow('   Pages may publish placeholder copy instead of real content.'))
  process.exit(0)
}

let lastError = null

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const startedAt = Date.now()
  try {
    const res = await fetch(HEALTH_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    })
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
    if (res.ok) {
      console.log(green(`✓ API reachable — ${HEALTH_URL} responded ${res.status} in ${elapsed}s`))
      process.exit(0)
    }
    lastError = `HTTP ${res.status}`
    console.warn(yellow(`  attempt ${attempt}/${ATTEMPTS}: ${lastError} after ${elapsed}s`))
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err)
    console.warn(yellow(`  attempt ${attempt}/${ATTEMPTS}: ${lastError}`))
  } finally {
    clearTimeout(timer)
  }

  if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 3000 * attempt))
}

console.error('')
console.error(red('✗ Build aborted: the portfolio API is unreachable.'))
console.error('')
console.error(`  Checked : ${HEALTH_URL}`)
console.error(`  Last error: ${lastError}`)
console.error('')
console.error('  Building now would publish placeholder copy in place of your real content,')
console.error('  and it would replace the working deployment that is live right now.')
console.error('')
console.error('  Fix the API first, then redeploy. To ship anyway (not recommended):')
console.error('      ALLOW_DEGRADED_BUILD=true')
console.error('')
process.exit(1)
