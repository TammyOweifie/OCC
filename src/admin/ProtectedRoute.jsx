import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

export default function ProtectedRoute({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <span className="text-earth-600 font-mono text-xs tracking-widest uppercase">
          Loading…
        </span>
      </div>
    )
  }

  if (status !== 'signedIn') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
