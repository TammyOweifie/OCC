// One-off backfill: set publishedAt on existing news posts.
//
// Before scheduled publishing landed, newsPost had only `date` (a display
// date). The public query now also requires `publishedAt`. Without this
// script, every pre-existing post would read as a draft and vanish from
// the public page.
//
// Behaviour: for each newsPost missing publishedAt, set it to `date` if
// present, otherwise `_createdAt`. Posts that already have publishedAt
// are left alone (so running this twice is safe).
//
// Usage:
//   SANITY_PROJECT_ID=... SANITY_WRITE_TOKEN=... node scripts/backfill-news-publishedAt.js
//
// Reads credentials from env — same ones the /api/admin/* functions use.
// Run against the production dataset once, after the scheduled-publishing
// feature is merged. Dry-run first with DRY_RUN=1.

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.SANITY_API_VERSION || '2024-10-01'
const dryRun = process.env.DRY_RUN === '1'

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

async function run() {
  const posts = await client.fetch(
    `*[_type == "newsPost" && !defined(publishedAt)]{ _id, title, date, _createdAt }`
  )
  if (posts.length === 0) {
    console.log('Nothing to backfill — all news posts have publishedAt.')
    return
  }
  console.log(`Found ${posts.length} post(s) missing publishedAt:`)
  for (const p of posts) {
    const target = p.date || p._createdAt
    console.log(`  • ${p.title || p._id} → publishedAt = ${target}`)
  }
  if (dryRun) {
    console.log('\nDRY_RUN=1 — no writes performed.')
    return
  }
  const tx = client.transaction()
  for (const p of posts) {
    tx.patch(p._id, { set: { publishedAt: p.date || p._createdAt } })
  }
  await tx.commit()
  console.log(`\nBackfilled ${posts.length} post(s).`)
}

run().catch(err => {
  console.error('Backfill failed:', err.message)
  process.exit(1)
})
