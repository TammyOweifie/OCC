// Sanity-backed reports fetcher.
// ------------------------------
// Returns reports in the SAME shape currently exported from
// src/data/reports.js:
//   { id, body, image, imageAlt, downloadUrl? }
//
// This is a drop-in replacement for that static array. Swapping it in
// later is a ~one-line change wherever the data is imported — the page
// component (src/pages/Reports.jsx) does not need to change.
//
//   Current (static):
//     import { reports } from '../data/reports.js'
//   Future (Sanity):
//     import { getReportsFromSanity } from '../data/getReportsFromSanity.js'
//     const reports = await getReportsFromSanity()
//
// The CMS schema (studio/schemas/report.js) also captures `title` and
// `date` for editor context — those aren't part of the current page's
// shape, so they're deliberately not projected here. Add them when the
// Reports page is redesigned to render them.
//
// NOT consumed by any page yet — this file exists purely as CMS-prep
// infrastructure on the cms-prep branch. Live site is untouched.

import { sanityClient } from '../lib/sanityClient.js'

const QUERY = /* groq */ `*[_type == "report"] | order(date desc) {
  "id": _id,
  "body": description,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "downloadUrl": file.asset->url
}`

export async function getReportsFromSanity() {
  if (!sanityClient) {
    throw new Error(
      'Sanity client not configured. Set VITE_SANITY_PROJECT_ID in .env.local.'
    )
  }
  return sanityClient.fetch(QUERY)
}
