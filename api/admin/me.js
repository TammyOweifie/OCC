import { readSession } from '../_lib/session.js'

export default async function handler(req, res) {
  const session = await readSession(req)
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  res.status(200).json({ email: session.email })
}
