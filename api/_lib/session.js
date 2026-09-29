// Session helpers — signed JWT stored in an httpOnly cookie.
// The SESSION_SECRET env var must be set (32+ random chars).

import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'occ_admin_session'
const SESSION_MAX_AGE_SEC = 60 * 60 * 8 // 8 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET must be set (32+ random characters)')
  }
  return new TextEncoder().encode(secret)
}

export async function issueSession(email) {
  const jwt = await new SignJWT({ sub: email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(getSecret())

  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  const attrs = [
    `${COOKIE_NAME}=${jwt}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SEC}`,
  ]
  if (isProd) attrs.push('Secure')
  return attrs.join('; ')
}

export function clearSessionCookie() {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  const attrs = [
    `${COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ]
  if (isProd) attrs.push('Secure')
  return attrs.join('; ')
}

function parseCookies(header) {
  if (!header) return {}
  return Object.fromEntries(
    header.split(';').map(part => {
      const [k, ...rest] = part.trim().split('=')
      return [k, rest.join('=')]
    })
  )
}

export async function readSession(req) {
  const cookies = parseCookies(req.headers.cookie || '')
  const token = cookies[COOKIE_NAME]
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { email: payload.sub }
  } catch {
    return null
  }
}

// Handler wrapper — 401s if unauthenticated, otherwise passes session to fn.
export function withAuth(handler) {
  return async (req, res) => {
    const session = await readSession(req)
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }
    return handler(req, res, session)
  }
}
