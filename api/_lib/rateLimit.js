// In-memory rate limiter + lockout for the admin login endpoint.
//
// Storage is a Map scoped to the Node module, which persists across
// invocations within one warm Vercel function instance. Cold starts and
// concurrent instances each reset their own counter; good enough for the
// NGO threat model (slows real attackers substantially, documented
// limitation). Escalation path if ever needed: swap the Map for a
// Vercel KV / Upstash client — same shape, ~20 lines of change.
//
// Terminology:
//   - "attempt" = a failed login
//   - "key"     = per-IP or per-email identifier
//   - "window"  = sliding seconds during which attempts count
//
// A key's record is pruned lazily on the next check.

const WINDOW_MS = 15 * 60 * 1000 // 15 min counting window
const PER_IP_MAX = 20            // 20 failures per IP → 15-min cool-off
const PER_EMAIL_MAX = 10         // 10 failures per email → 30-min lockout
const PER_IP_RETRY_MS = 15 * 60 * 1000
const PER_EMAIL_RETRY_MS = 30 * 60 * 1000

/** @type {Map<string, { attempts: number[], blockedUntil: number }>} */
const store = new Map()

function now() { return Date.now() }

function getRecord(key) {
  let rec = store.get(key)
  if (!rec) {
    rec = { attempts: [], blockedUntil: 0 }
    store.set(key, rec)
  }
  return rec
}

function prune(rec, cutoff) {
  rec.attempts = rec.attempts.filter(t => t >= cutoff)
}

/**
 * Call BEFORE verifying the password. Returns { allowed, retryAfter }.
 * If !allowed, respond 429 with Retry-After and skip the password check.
 */
export function check(key, { max, retryAfterMs }) {
  const rec = getRecord(key)
  const t = now()
  if (rec.blockedUntil > t) {
    return { allowed: false, retryAfter: Math.ceil((rec.blockedUntil - t) / 1000) }
  }
  prune(rec, t - WINDOW_MS)
  if (rec.attempts.length >= max) {
    rec.blockedUntil = t + retryAfterMs
    return { allowed: false, retryAfter: Math.ceil(retryAfterMs / 1000) }
  }
  return { allowed: true, retryAfter: 0 }
}

/** Call AFTER a failed login. Increments the counter. */
export function recordFailure(key) {
  const rec = getRecord(key)
  prune(rec, now() - WINDOW_MS)
  rec.attempts.push(now())
}

/** Call AFTER a successful login. Clears this key's counter (not blockedUntil). */
export function recordSuccess(key) {
  const rec = store.get(key)
  if (rec) rec.attempts = []
}

// Convenience wrappers so callers don't repeat the thresholds.
export const perIp = {
  check: (ip) => check(`ip:${ip}`, { max: PER_IP_MAX, retryAfterMs: PER_IP_RETRY_MS }),
  recordFailure: (ip) => recordFailure(`ip:${ip}`),
}
export const perEmail = {
  check: (email) => check(`email:${email.toLowerCase()}`, { max: PER_EMAIL_MAX, retryAfterMs: PER_EMAIL_RETRY_MS }),
  recordFailure: (email) => recordFailure(`email:${email.toLowerCase()}`),
  recordSuccess: (email) => recordSuccess(`email:${email.toLowerCase()}`),
}

/**
 * Pull the client IP from Vercel's headers. First comma-separated entry
 * of x-forwarded-for is the originating client; the rest are proxy hops.
 */
export function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}
