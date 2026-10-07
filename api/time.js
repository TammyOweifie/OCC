// Returns the server timestamp in milliseconds (same shape as Date.now()).
// Used by the client's launch gate (src/lib/launch.js) to correct for
// device-clock drift when deciding whether the launch moment has passed.
// Public, unauthenticated — reveals only what any `Date` header already does.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({ now: Date.now() })
}
