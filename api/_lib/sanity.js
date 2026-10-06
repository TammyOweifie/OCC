// Server-side Sanity client for the /api/admin/* functions.
// Uses the write token from env — never bundled into the client.

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.SANITY_API_VERSION || '2024-10-01'

if (!projectId || !token) {
  console.warn(
    '[sanity] SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN not set. Admin API calls will fail.'
  )
}

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})
