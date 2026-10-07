import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/shared/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Team from './pages/Team.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Donate from './pages/Donate.jsx'
import News from './pages/News.jsx'
import Reports from './pages/Reports.jsx'
import Gallery from './pages/Gallery.jsx'
import FoundersStory from './pages/FoundersStory.jsx'
import LaunchingSoon from './pages/LaunchingSoon.jsx'
import NotFound from './pages/NotFound.jsx'
import { useLaunchState } from './lib/useLaunchState.js'

// Lazy-load: public visitors never download the admin bundle.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <span className="text-earth-600 font-mono text-xs tracking-widest uppercase">
        Loading admin…
      </span>
    </div>
  )
}

function App() {
  const { pathname } = useLocation()

  // The admin surface bypasses the launch gate — OCC staff can log in
  // and upload content during the countdown phase. Its own layout, no
  // public Navbar/Footer.
  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<AdminLoading />}>
        <AdminApp />
      </Suspense>
    )
  }

  return <PublicApp />
}

function PublicApp() {
  const { state, diffMs } = useLaunchState()

  if (state === 'countdown') {
    return <LaunchingSoon diffMs={diffMs} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-sand-900 font-sans antialiased">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/news" element={<News />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/founders-story" element={<FoundersStory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
