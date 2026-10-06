import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

export default function AdminHeader() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200/70">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3 group">
          <img
            src="/assets/logos/occ-logo.png"
            alt="OCC"
            className="h-10 w-auto object-contain"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-earth-700 group-hover:text-forest-700 transition-colors">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-6 text-xs">
          {user?.email && (
            <span className="text-earth-600 font-mono hidden sm:inline">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="font-mono uppercase tracking-widest text-earth-700 hover:text-forest-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
