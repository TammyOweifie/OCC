// Top site navigation with links to all six pages
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const activeStyle = 'text-accent font-semibold border-b-2 border-accent pb-0.5'
const defaultStyle = 'hover:text-forest-700'
const donateDefaultStyle = 'text-forest-800 font-semibold hover:text-forest-900'

const navLinkClass = ({ isActive }) =>
  `transition-colors ${isActive ? activeStyle : defaultStyle}`

const donateLinkClass = ({ isActive }) =>
  `transition-colors ${isActive ? activeStyle : donateDefaultStyle}`

// Public routes shown in the mobile menu. About Us carries a nested
// sub-menu (see mobile block below) rather than a flat entry.
const mobileLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/team', label: 'Team' },
  { to: '/donate', label: 'Donate' },
  { to: '/news', label: 'News' },
  { to: '/reports', label: 'Reports' },
]

const aboutSubLinks = [
  { to: '/gallery', label: 'Gallery' },
]

function Pipe() {
  return <span aria-hidden="true" className="text-sand-300">|</span>
}

// Desktop About Us item with hover/focus-driven dropdown.
// Trigger and menu live in the SAME wrapper so no gap exists between
// them — moving the pointer from label into menu never crosses empty
// space that would collapse the hover.
function AboutDropdown({ isAboutActive }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpen(false)
          e.currentTarget.querySelector('a')?.focus()
        }
      }}
    >
      <NavLink
        to="/about"
        aria-haspopup="true"
        aria-expanded={open}
        className={`transition-colors ${isAboutActive ? activeStyle : defaultStyle}`}
      >
        About Us
      </NavLink>

      {/*
        Buffer gap-eliminator: the pt-2 lives INSIDE this wrapper, so
        pointer travel from trigger to menu stays inside the hover target.
      */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-opacity duration-150 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="min-w-[9rem] bg-sand-50 border border-sand-200/70 py-2">
          {aboutSubLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-5 py-2 text-xs uppercase tracking-widest transition-colors ${
                    isActive ? 'text-accent font-semibold' : 'text-earth-700 hover:text-forest-700'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Mobile About Us row: text is a NavLink (goes to /about), chevron is a
// separate button that expands the sub-menu inline.
function MobileAboutRow({ onNavigate, isAboutActive }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center border-b border-sand-200/70">
        <NavLink
          to="/about"
          onClick={onNavigate}
          className={`flex-1 block px-6 py-4 transition-colors ${
            isAboutActive ? 'text-accent font-semibold' : 'hover:text-forest-700'
          }`}
        >
          About Us
        </NavLink>
        <button
          type="button"
          aria-label={open ? 'Collapse About Us menu' : 'Expand About Us menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="px-6 py-4 text-earth-700 hover:text-forest-700 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {open && (
        <ul className="bg-sand-100/60 border-b border-sand-200/70">
          {aboutSubLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block pl-10 pr-6 py-3 text-xs uppercase tracking-widest transition-colors ${
                    isActive ? 'text-accent font-semibold' : 'text-earth-700 hover:text-forest-700'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // About Us reads as active when on /about OR anywhere under /gallery.
  const isAboutActive = pathname === '/about' || pathname.startsWith('/gallery')

  return (
    <header className="sticky top-0 z-50 bg-sand-50/90 backdrop-blur-md border-b border-sand-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between py-4">
        <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-widest text-earth-700 font-medium">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <Pipe />
          <NavLink to="/team" className={navLinkClass}>Team</NavLink>
          <Pipe />
          <AboutDropdown isAboutActive={isAboutActive} />
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
          <NavLink to="/news" className={navLinkClass}>News</NavLink>
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
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 border-b border-sand-200/70 transition-colors ${
                    isActive ? 'text-accent font-semibold' : 'hover:text-forest-700'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/team"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 border-b border-sand-200/70 transition-colors ${
                    isActive ? 'text-accent font-semibold' : 'hover:text-forest-700'
                  }`
                }
              >
                Team
              </NavLink>
            </li>
            <li>
              <MobileAboutRow
                onNavigate={() => setMobileOpen(false)}
                isAboutActive={isAboutActive}
              />
            </li>
            {mobileLinks
              .filter(l => !['/', '/team'].includes(l.to))
              .map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-6 py-4 border-b border-sand-200/70 last:border-b-0 transition-colors ${
                        isActive ? 'text-accent font-semibold' : 'hover:text-forest-700'
                      }`
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
