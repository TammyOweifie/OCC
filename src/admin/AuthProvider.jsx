// Admin auth state — checks the session cookie on mount via /api/admin/me.
import { createContext, useContext, useEffect, useState } from 'react'
import { adminApi } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null })

  useEffect(() => {
    let alive = true
    adminApi.me()
      .then(user => alive && setState({ status: 'signedIn', user }))
      .catch(() => alive && setState({ status: 'signedOut', user: null }))
    return () => { alive = false }
  }, [])

  async function signIn(email, password) {
    const user = await adminApi.login(email, password)
    setState({ status: 'signedIn', user })
  }

  async function signOut() {
    try { await adminApi.logout() } catch { /* ignore */ }
    setState({ status: 'signedOut', user: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
