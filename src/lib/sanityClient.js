// Sanity client — CMS prep, NOT wired into any page yet.
// -------------------------------------------------------
// Reads its config from Vite env vars in .env.local (gitignored).
// Until VITE_SANITY_PROJECT_ID is set, `sanityClient` is null and
// any attempt to call `.fetch(...)` from a caller must guard for that.
//
// See src/data/getNewsFromSanity.js and
// src/data/getReportsFromSanity.js for how this is intended to be used
// once the CMS is commissioned.

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-10-01'

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

// Helper: build a URL from a Sanity image reference (hotspot-aware).
// Returns null if the client isn't configured.
export function urlFor(source) {
  return builder ? builder.image(source) : null
}
