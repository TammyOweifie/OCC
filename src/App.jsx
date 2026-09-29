import { Routes, Route } from 'react-router-dom'
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

function App() {
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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
