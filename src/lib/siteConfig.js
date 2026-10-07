// Site-wide config used by SEO metadata (canonical URLs, Open Graph,
// sitemap). Keep in one place so launch/cutover is a one-line change.
//
// IMPORTANT at DNS cutover: update siteUrl to the custom domain
// (https://obuduconservationc.org) so Google and social crawlers
// treat that as canonical. Until DNS flips, keep the Vercel URL
// here so crawlers that discover the site on vercel.app don't get
// 404s against the custom domain.

export const siteConfig = {
  // The canonical origin of the site, no trailing slash.
  // Switch to 'https://obuduconservationc.org' at cutover.
  siteUrl: 'https://obuduconservationc.org',

  // Organization identity (used in JSON-LD and defaults)
  name: 'Obudu Conservation Centre',
  shortName: 'OCC',
  tagline: 'Protecting wildlife and wild lands on the Obudu Plateau since 2002.',

  // Default social share image — absolute path from siteUrl
  ogImage: '/assets/og/default.jpg',

  // Email + social
  email: 'info@obuduconservation.org',
  social: {
    facebook: 'https://www.facebook.com/obuduconservationcentre/',
    instagram: 'https://www.instagram.com/obuduconservationcentre/',
    youtube: 'https://www.youtube.com/@obuduconservationcentre7103',
    x: 'https://x.com/obuducc',
  },
}

// Build an absolute URL for a given path.
export function absoluteUrl(path = '/') {
  const base = siteConfig.siteUrl.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
