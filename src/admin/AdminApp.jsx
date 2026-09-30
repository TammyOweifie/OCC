import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminHeader from './AdminHeader.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import NewsList from './NewsList.jsx'
import NewsForm from './NewsForm.jsx'
import ReportsList from './ReportsList.jsx'
import ReportForm from './ReportForm.jsx'
import GalleryList from './GalleryList.jsx'
import GalleryUpload from './GalleryUpload.jsx'
import GalleryEdit from './GalleryEdit.jsx'

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
        <Route
          path="/admin/reports"
          element={<ProtectedShell><ReportsList /></ProtectedShell>}
        />
        <Route
          path="/admin/reports/new"
          element={<ProtectedShell><ReportForm /></ProtectedShell>}
        />
        <Route
          path="/admin/reports/:id/edit"
          element={<ProtectedShell><ReportForm /></ProtectedShell>}
        />
        <Route
          path="/admin/gallery"
          element={<ProtectedShell><GalleryList /></ProtectedShell>}
        />
        <Route
          path="/admin/gallery/upload"
          element={<ProtectedShell><GalleryUpload /></ProtectedShell>}
        />
        <Route
          path="/admin/gallery/:id/edit"
          element={<ProtectedShell><GalleryEdit /></ProtectedShell>}
        />
      </Routes>
    </AuthProvider>
  )
}
