// Sanity-backed news fetcher.
// ---------------------------
// Returns news posts in the SAME shape currently exported from
// src/data/news.js:
//   { id, title, date, excerpt, body, coverImage, coverAlt }
//
// This is a drop-in replacement for that static array. Swapping it in
// later is a ~one-line change wherever the data is imported — the page
// component (src/pages/News.jsx) does not need to change.
//
//   Current (static):
//     import { news } from '../data/news.js'
//   Future (Sanity):
//     import { getNewsFromSanity } from '../data/getNewsFromSanity.js'
//     const news = await getNewsFromSanity()
//
// NOT consumed by any page yet — this file exists purely as CMS-prep
// infrastructure on the cms-prep branch. Live site is untouched.

import { sanityClient } from '../lib/sanityClient.js'

const QUERY = /* groq */ `*[_type == "newsPost"] | order(date desc) {
  "id": slug.current,
  title,
  date,
  excerpt,
  "body": body[]{ children[]{ text } },
  "coverImage": thumbnail.asset->url,
  "coverAlt": thumbnail.alt
}`

// Portable Text (Sanity's block content) is an array of block objects.
// Each block has a `children` array of spans; each span has a `.text`.
// The News page expects `body` as an array of paragraph strings,
// so we flatten each block into a single string.
function flattenPortableText(body) {
  if (!Array.isArray(body)) return []
  return body
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((span) => span?.text || '').join('')
        : ''
    )
    .filter(Boolean)
}

export async function getNewsFromSanity() {
  if (!sanityClient) {
    throw new Error(
      'Sanity client not configured. Set VITE_SANITY_PROJECT_ID in .env.local.'
    )
  }
  const raw = await sanityClient.fetch(QUERY)
  return raw.map((post) => ({
    ...post,
    body: flattenPortableText(post.body),
  }))
}
