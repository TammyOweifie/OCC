// Top site navigation with links to all six pages
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const activeStyle = 'text-accent font-semibold border-b-2 border-accent pb-0.5'
const defaultStyle = 'hover:text-forest-700'
const donateDefaultStyle = 'text-forest-800 font-semibold hover:text-forest-900'

const navLinkClass = ({ isActive }) =>
  `transition-colors ${isActive ? activeStyle : defaultStyle}`

const donateLinkClass = ({ isActive }) =>
  `transition-colors ${isActive ? activeStyle : donateDefaultStyle}`

const mobileLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/team', label: 'Team' },
  { to: '/about', label: 'About Us' },
  { to: '/donate', label: 'Donate' },
  { to: '/publications', label: 'Publications' },
  { to: '/reports', label: 'Reports' },
]

function Pipe() {
  return <span aria-hidden="true" className="text-sand-300">|</span>
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-sand-50/90 backdrop-blur-md border-b border-sand-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between py-4">
        <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-widest text-earth-700 font-medium">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <Pipe />
          <NavLink to="/team" className={navLinkClass}>Team</NavLink>
          <Pipe />
          <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
        </nav>

        <NavLink to="/" end className="group block flex-shrink-0">
          <img
            src="/assets/logos/occ-logo.png"
            alt="Obudu Conservation Centre"
            className="h-14 lg:h-[84px] w-auto object-contain"
          />
        </NavLink>

        <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-widest text-earth-700 font-medium">
          <NavLink to="/donate" className={donateLinkClass}>Donate</NavLink>
          <Pipe />
          <NavLink to="/publications" className={navLinkClass}>Publications</NavLink>
          <Pipe />
          <NavLink to="/reports" className={navLinkClass}>Reports</NavLink>
        </nav>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="lg:hidden text-earth-700 hover:text-forest-700 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-sand-200/70 bg-sand-50/95 backdrop-blur-md">
          <ul className="flex flex-col text-sm uppercase tracking-widest text-earth-700 font-medium">
            {mobileLinks.map(({ to, label, end }) => (
              <li key={to} className="border-b border-sand-200/70 last:border-b-0">
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-6 py-4 transition-colors ${isActive ? 'text-accent font-semibold' : 'hover:text-forest-700'}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Navbar
