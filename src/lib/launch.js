// Launch time gate.
//
// Reads VITE_LAUNCH_AT (ISO 8601 UTC string) and VITE_LAUNCH_MODE
// ('auto' | 'countdown' | 'live') from import.meta.env.
//
// __LAUNCH_PREVIEW_MODE__ is a build-time boolean replaced by Vite
// (see vite.config.js): true on local dev + Vercel preview builds
// (so ?preview_launch_at / ?preview_force work), false on Vercel
// production builds (overrides are stripped out at build time).

/* global __LAUNCH_PREVIEW_MODE__ */

const DEFAULT_LAUNCH_AT = '2026-10-15T23:00:00Z' // 00:00 WAT, Fri 16 Oct 2026

export function getLaunchDate() {
  const raw = import.meta.env.VITE_LAUNCH_AT || DEFAULT_LAUNCH_AT
  const d = new Date(raw)
  if (isNaN(d.getTime())) return new Date(DEFAULT_LAUNCH_AT)
  return d
}

export function getLaunchMode() {
  const mode = import.meta.env.VITE_LAUNCH_MODE || 'auto'
  return ['auto', 'countdown', 'live'].includes(mode) ? mode : 'auto'
}

// ?preview_launch_at=<ISO> / ?preview_force=live|countdown — preview-only.
// On production builds Vite replaces __LAUNCH_PREVIEW_MODE__ with `false`,
// so this function always returns {} and the overrides are dead code.
export function readPreviewOverrides() {
  if (typeof window === 'undefined') return {}
  if (!__LAUNCH_PREVIEW_MODE__) return {}
  const params = new URLSearchParams(window.location.search)
  const overrides = {}
  const launchAt = params.get('preview_launch_at')
  if (launchAt) {
    const d = new Date(launchAt)
    if (!isNaN(d.getTime())) overrides.launchDate = d
  }
  const force = params.get('preview_force')
  if (force === 'live' || force === 'countdown') overrides.force = force
  return overrides
}

// Fetch /api/time once to correct for device-clock drift. Falls back to
// a 0 offset (device clock) if the endpoint fails — safe degradation
// since the main case we're guarding against is a wildly-off device
// clock on the kind of phone that still reaches the internet.
export async function fetchServerOffset(signal) {
  try {
    const t0 = Date.now()
    const res = await fetch('/api/time', { signal, cache: 'no-store' })
    if (!res.ok) return 0
    const { now } = await res.json()
    const t1 = Date.now()
    const rtt = t1 - t0
    // Half-round-trip correction: assume the server stamped `now` at the midpoint.
    const serverNow = Number(now) + Math.round(rtt / 2)
    return serverNow - t1
  } catch {
    return 0
  }
}

export function correctedNow(offsetMs) {
  return Date.now() + (offsetMs || 0)
}

export function computeLaunchState({ launchDate, offsetMs = 0, mode = 'auto', force }) {
  const effective = force || mode
  if (effective === 'live') return { state: 'live', diffMs: 0 }
  const diff = Math.max(0, launchDate.getTime() - correctedNow(offsetMs))
  if (effective === 'countdown') return { state: 'countdown', diffMs: diff }
  // auto
  return diff > 0 ? { state: 'countdown', diffMs: diff } : { state: 'live', diffMs: 0 }
}

export function diffToParts(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}
