// Scrolling row of partner/sponsor logos
const defaultLogoClass =
  'h-12 w-auto max-w-[150px] object-contain filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300'

function PartnerRow({ partners, ariaHidden = false }) {
  return (
    <div
      className="flex items-center gap-14 sm:gap-20 px-6 shrink-0"
      aria-hidden={ariaHidden || undefined}
    >
      {partners.map((partner, i) => {
        const logo = (
          <img
            src={partner.src}
            alt={ariaHidden ? '' : partner.name}
            className={partner.className || defaultLogoClass}
          />
        )

        if (partner.href) {
          return (
            <a
              key={i}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaHidden ? undefined : partner.name}
              tabIndex={ariaHidden ? -1 : undefined}
              className="shrink-0"
            >
              {logo}
            </a>
          )
        }

        return (
          <span key={i} className="shrink-0">
            {logo}
          </span>
        )
      })}
    </div>
  )
}

function PartnerMarquee({ partners = [], pauseOnHover = true }) {
  if (partners.length === 0) return null

  const trackClasses = [
    'animate-marquee',
    'motion-reduce:animate-none',
    'flex',
    'w-max',
    'items-center',
    'gap-14',
    'sm:gap-20',
    pauseOnHover && 'hover:[animation-play-state:paused]',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="relative w-full overflow-hidden">
      <div className={trackClasses}>
        <PartnerRow partners={partners} />
        <PartnerRow partners={partners} ariaHidden />
      </div>
    </div>
  )
}

export default PartnerMarquee
