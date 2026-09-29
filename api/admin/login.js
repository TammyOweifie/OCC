import bcrypt from 'bcryptjs'
import { issueSession } from '../_lib/session.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const { email = '', password = '' } = req.body || {}

  const expectedEmail = process.env.ADMIN_EMAIL
  const expectedHash = process.env.ADMIN_PASSWORD_HASH

  if (!expectedEmail || !expectedHash) {
    res.status(500).json({ error: 'Admin credentials not configured on server' })
    return
  }

  const emailOk = email.toLowerCase() === expectedEmail.toLowerCase()
  const passwordOk = emailOk ? await bcrypt.compare(password, expectedHash) : false

  if (!emailOk || !passwordOk) {
    // Small delay reduces timing signal on failed logins
    await new Promise(r => setTimeout(r, 400))
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const cookie = await issueSession(expectedEmail)
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ email: expectedEmail })
}
