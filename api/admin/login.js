import bcrypt from 'bcryptjs'
import { issueSession } from '../_lib/session.js'
import { perIp, perEmail, clientIp } from '../_lib/rateLimit.js'

// Both rate-limited responses use the same message so an attacker can't
// distinguish per-IP throttle from per-email lockout.
const RATE_LIMITED_MESSAGE = 'Too many attempts. Please wait and try again.'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const { email = '', password = '' } = req.body || {}
  const ip = clientIp(req)

  // Per-IP guard — catches brute force from a single network location.
  const ipCheck = perIp.check(ip)
  if (!ipCheck.allowed) {
    res.setHeader('Retry-After', String(ipCheck.retryAfter))
    res.status(429).json({ error: RATE_LIMITED_MESSAGE })
    return
  }

  // Per-email guard — catches botnet IP-rotation targeting one account.
  // Only check when the client supplied an email; otherwise it's a
  // malformed request and the IP counter alone handles it.
  if (email) {
    const emailCheck = perEmail.check(email)
    if (!emailCheck.allowed) {
      res.setHeader('Retry-After', String(emailCheck.retryAfter))
      res.status(429).json({ error: RATE_LIMITED_MESSAGE })
      return
    }
  }

  const expectedEmail = process.env.ADMIN_EMAIL
  const expectedHash = process.env.ADMIN_PASSWORD_HASH

  if (!expectedEmail || !expectedHash) {
    res.status(500).json({ error: 'Admin credentials not configured on server' })
    return
  }

  const emailOk = email.toLowerCase() === expectedEmail.toLowerCase()
  const passwordOk = emailOk ? await bcrypt.compare(password, expectedHash) : false

  if (!emailOk || !passwordOk) {
    // Record on BOTH counters so IP-rotating + email-spraying attacks
    // each hit a wall.
    perIp.recordFailure(ip)
    if (email) perEmail.recordFailure(email)
    // Small delay reduces timing signal on failed logins
    await new Promise(r => setTimeout(r, 400))
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  // Success — clear the per-email counter so the admin can log in on a
  // fresh browser straight after a failed attempt. The per-IP counter
  // persists so an attacker can't launder a successful guess to clear it.
  perEmail.recordSuccess(email)

  const cookie = await issueSession(expectedEmail)
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ email: expectedEmail })
}
