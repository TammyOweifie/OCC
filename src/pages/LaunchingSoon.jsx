// Countdown landing page shown while the launch gate is active.
// Mobile-first; reuses existing design tokens (sand, forest, accent,
// Playfair, Cinzel). Static OG tags for non-JS crawlers live in
// index.html for the duration of the countdown phase; the Helmet block
// below is for Googlebot and in-SPA metadata.
import { Helmet } from 'react-helmet-async'
import { diffToParts } from '../lib/launch.js'
import { siteConfig, absoluteUrl } from '../lib/siteConfig.js'

const socials = [
  {
    name: 'Instagram',
    href: siteConfig.social.instagram,
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: siteConfig.social.facebook,
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: siteConfig.social.youtube,
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: siteConfig.social.x,
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-5xl sm:text-6xl md:text-7xl text-sand-50 tabular-nums tracking-wide leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-eyebrow-wide text-sand-200/80 font-medium">
        {label}
      </span>
    </div>
  )
}

function LaunchingSoon({ diffMs }) {
  const { days, hours, minutes, seconds } = diffToParts(diffMs)

  const title = `Launching 16 October 2026 — ${siteConfig.name}`
  const description = `The new Obudu Conservation Centre website launches 16 October 2026. Protecting the wildlife and wild lands of the Obudu Plateau since 2002.`
  const ogImage = absoluteUrl(siteConfig.ogImage)
  const canonical = absoluteUrl('/')

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="relative min-h-screen flex flex-col items-center justify-center bg-ink text-sand-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/assets/images/home/bg-hero.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-ink/50" aria-hidden="true" />

        <main className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-xl w-full">
          <img
            src="/assets/logos/occ-logo.png"
            alt="Obudu Conservation Centre"
            className="h-20 sm:h-24 w-auto object-contain brightness-0 invert mb-10"
          />
          <p className="text-[11px] sm:text-xs uppercase tracking-hero-eyebrow text-sand-200/80 font-medium mb-4">
            Launching Soon
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-sand-50 mb-5 uppercase leading-tight">
            Protect. Educate. Restore.
          </h1>
          <p className="font-sans text-sm sm:text-base text-sand-100/90 font-light leading-relaxed mb-10 max-w-md">
            The new Obudu Conservation Centre website launches 16 October 2026 at 00:00 WAT.
          </p>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-sm mb-12">
            <Cell value={days} label="Days" />
            <Cell value={hours} label="Hours" />
            <Cell value={minutes} label="Min" />
            <Cell value={seconds} label="Sec" />
          </div>

          <div className="flex items-center gap-5 text-sand-200/80">
            {socials.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="hover:text-accent transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          <p className="mt-12 text-[10px] font-mono tracking-widest text-sand-300/60 uppercase">
            © 2002–2026 Obudu Conservation Centre
          </p>
        </main>
      </div>
    </>
  )
}

export default LaunchingSoon
