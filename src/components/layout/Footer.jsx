// Site footer with contact/social links and copyright
import { NavLink } from 'react-router-dom'

const columnHeadingClass =
  'text-xs uppercase tracking-widest text-stone-200 font-mono mb-4 font-semibold'

const exploreLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/team', label: 'Team' },
  { to: '/about', label: 'About Us' },
  { to: '/founders-story', label: "Founder's Story" },
  { to: '/gallery', label: 'Gallery' },
  { to: '/donate', label: 'Donate' },
  { to: '/news', label: 'News' },
  { to: '/reports', label: 'Reports' },
]

const socials = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@obuduconservationcentre7103',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/obuduconservationcentre/',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/obuducc',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/obuduconservationcentre/',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
      </svg>
    ),
  },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-stone-400 px-8 sm:px-12 lg:px-20 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800 items-start">
          <div className="md:col-span-4 lg:col-span-5">
            <img
              src="/assets/logos/occ-logo.png"
              alt="Obudu Conservation Centre"
              className="h-16 sm:h-20 w-auto object-contain mb-6 brightness-0 invert"
            />
            <p className="text-xs text-stone-400 font-serif leading-relaxed max-w-sm">
              Dedicated to protecting, educating, and restoring the irreplaceable biodiversity of the Obudu Plateau and Cross River National Park in Nigeria.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className={columnHeadingClass}>Contact</h4>
            <address className="not-italic text-xs text-stone-400 font-serif leading-relaxed space-y-2">
              <p>Obudu Conservation Centre</p>
              <p>Obudu Plateau, Cross River State, Nigeria</p>
              <p className="pt-1">
                <a
                  href="mailto:info@obuduconservation.org"
                  className="text-stone-300 hover:text-accent transition-colors underline underline-offset-4"
                >
                  info@obuduconservation.org
                </a>
              </p>
            </address>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className={columnHeadingClass}>Explore</h4>
            <ul className="space-y-2.5 text-xs font-serif text-stone-400">
              {exploreLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-accent font-medium hover:underline'
                        : 'hover:text-white transition-colors duration-150'
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className={columnHeadingClass}>Follow</h4>
            <div className="flex items-center gap-4 text-stone-400">
              {socials.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="hover:text-white transition-colors duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 font-mono gap-3 sm:gap-0">
          <div>© 2002–{year} Obudu Conservation Centre. All rights reserved.</div>
          <div className="italic">Preserving Nigeria's Montane Forests &amp; Endangered Wildlife</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
