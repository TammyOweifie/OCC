import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminHeader from './AdminHeader.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import NewsList from './NewsList.jsx'
import NewsForm from './NewsForm.jsx'

function ProtectedShell({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-sand-50 flex flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedShell><Dashboard /></ProtectedShell>}
        />
        <Route
          path="/admin/news"
          element={<ProtectedShell><NewsList /></ProtectedShell>}
        />
        <Route
          path="/admin/news/new"
          element={<ProtectedShell><NewsForm /></ProtectedShell>}
        />
        <Route
          path="/admin/news/:id/edit"
          element={<ProtectedShell><NewsForm /></ProtectedShell>}
        />
      </Routes>
    </AuthProvider>
  )
}
