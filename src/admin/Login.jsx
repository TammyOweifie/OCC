import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

export default function Login() {
  const { status, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (status === 'signedIn') {
    return <Navigate to={location.state?.from || '/admin'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email, password)
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img
            src="/assets/logos/occ-logo.png"
            alt="OCC"
            className="h-14 w-auto object-contain mx-auto mb-6"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            OCC Admin
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-900 tracking-tight font-normal">
            Sign in
          </h1>
          <p className="text-earth-700 text-sm mt-2 font-light">
            Content management for News and Reports.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-sand-300/60 p-8 sm:p-10 space-y-5 shadow-sm">
          <div>
            <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-earth-600 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-sand-50 border border-sand-300/70 text-sand-900 font-sans text-sm focus:outline-none focus:border-accent focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-mono text-xs uppercase tracking-wider text-earth-600 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-sand-50 border border-sand-300/70 text-sand-900 font-sans text-sm focus:outline-none focus:border-accent focus:bg-white transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full px-10 py-4 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-earth-600 font-light">
          Trouble signing in? Contact your site administrator.
        </p>
      </div>
    </div>
  )
}
