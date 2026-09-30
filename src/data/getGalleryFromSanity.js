// Sanity-backed gallery fetcher.
// ------------------------------
// Returns gallery images in the SAME shape currently exported from
// src/data/gallery.js (on the `gallery` branch):
//   { id, src, alt }
//
// Drop-in replacement for that static array. Swapping it in later is a
// ~one-line change wherever the data is imported — the page component
// (src/pages/Gallery.jsx) does not need to change.
//
//   Current (static):
//     import { getGallery } from '../data/gallery.js'
//   Future (Sanity):
//     import { getGalleryFromSanity } from '../data/getGalleryFromSanity.js'
//     const images = await getGalleryFromSanity()

import { sanityClient } from '../lib/sanityClient.js'

const QUERY = /* groq */ `*[_type == "galleryImage"] | order(coalesce(orderRank, 9999) asc, _createdAt desc) {
  "id": slug.current,
  "src": image.asset->url,
  "alt": image.alt
}`

export async function getGalleryFromSanity() {
  if (!sanityClient) {
    throw new Error(
      'Sanity client not configured. Set VITE_SANITY_PROJECT_ID in .env.local.'
    )
  }
  return sanityClient.fetch(QUERY)
}
