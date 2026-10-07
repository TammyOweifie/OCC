// Per-page SEO helmet.
// --------------------
// Sets <title>, meta description, canonical URL and Open Graph tags
// for the current route. Pages render <Seo … /> once; it manages the
// document head via react-helmet-async.
//
// Googlebot executes JS so this works for Google. Social crawlers
// (Facebook, LinkedIn, WhatsApp) do NOT execute JS, so they'll fall
// back to whatever is in index.html's static <head> when sharing
// pages other than "/". For richer per-page social cards we'd need
// pre-rendering or SSR — flagged as a later improvement.
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { siteConfig, absoluteUrl } from '../../lib/siteConfig.js'

function Seo({
  title,
  description,
  image,
  type = 'website',
  noIndex = false,
}) {
  const { pathname } = useLocation()
  const canonical = absoluteUrl(pathname)
  const fullTitle = title
    ? `${title} — ${siteConfig.name}`
    : siteConfig.name
  const metaDescription = description || siteConfig.tagline
  const ogImage = image || absoluteUrl(siteConfig.ogImage)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}

export default Seo
