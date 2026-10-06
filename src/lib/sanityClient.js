// Sanity client used by public pages to read content.
// ----------------------------------------------------
// Reads its config from Vite env vars (VITE_SANITY_PROJECT_ID /
// VITE_SANITY_DATASET). Until those are set the client is null and
// any attempt to call `.fetch(...)` must guard for that.
//
// useCdn is false on purpose. The CDN caches reads for ~60 seconds,
// which was causing deletes/edits made from the admin to not reflect
// on the public pages for a minute afterwards. The live API is a few
// hundred ms slower per request but always fresh — the right default
// for a low-traffic site whose staff expect immediate feedback.

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
      useCdn: false,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

// Helper: build a URL from a Sanity image reference (hotspot-aware).
// Returns null if the client isn't configured.
export function urlFor(source) {
  return builder ? builder.image(source) : null
}
