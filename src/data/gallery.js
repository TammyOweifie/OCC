// Gallery data
// ------------
// Current entry shape:
//   id   — stable identifier (string)
//   src  — URL to the image (local path today, Sanity CDN URL later)
//   alt  — descriptive alt text (required for accessibility; currently
//          empty, waiting on real descriptions from the OCC team)
//
// This file is intentionally the single source of truth for gallery
// data. The page (src/pages/Gallery.jsx) calls getGallery() — nothing
// more. That keeps the CMS migration surface tiny.
//
// CMS migration plan (see cms-prep branch when commissioned)
// ----------------------------------------------------------
// The equivalent Sanity schema would be `galleryImage` with fields:
//   slug        → id       (via slug.current)
//   image       → src      (via image.asset->url)
//   image.alt   → alt
// Plus fields the schema is free to add later without disturbing this
// contract: caption, credit, orderRank, category, publishedAt, etc.
// The page can either ignore new fields or start rendering them —
// current code simply doesn't touch anything outside {id, src, alt}.
//
// When the CMS is wired in, replace the body of getGallery() with a
// Sanity fetch (see src/data/getNewsFromSanity.js on cms-prep for the
// established pattern) and swap the caller's import. The static array
// below stays as a fallback for local dev without a Sanity project.

const galleryImages = [
  { id: 'earth-day', src: '/assets/images/gallery/earth-day.jpg', alt: '' },
  { id: 'community', src: '/assets/images/gallery/community.jpg', alt: '' },
  { id: 'nela-1', src: '/assets/images/gallery/nela-occ-dscf0207.jpg', alt: '' },
  { id: 'nela-2', src: '/assets/images/gallery/nela-occ-photo-0586.jpg', alt: '' },
  { id: 'dsc-0259', src: '/assets/images/gallery/dsc-0259.jpg', alt: '' },
  { id: 'dsc-08820', src: '/assets/images/gallery/dsc08820.jpg', alt: '' },
  { id: 'dsc-08888', src: '/assets/images/gallery/dsc08888.jpg', alt: '' },
  { id: 'img-4114', src: '/assets/images/gallery/img-4114.jpg', alt: '' },
  { id: 'img-5738', src: '/assets/images/gallery/img-5738.jpg', alt: '' },
  { id: 'img-e4087', src: '/assets/images/gallery/img-e4087.jpg', alt: '' },
  { id: 'bxei-2384', src: '/assets/images/gallery/bxei2384.jpg', alt: '' },
  { id: 'whatsapp-oct-2025', src: '/assets/images/gallery/whatsapp-oct-31-2025.jpg', alt: '' },
]

export function getGallery() {
  return galleryImages
}
