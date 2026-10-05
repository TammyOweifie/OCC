// scripts/migrate-static-to-sanity.js
// -----------------------------------
// One-shot migration of the pre-CMS static content (src/data/news.js,
// reports.js, gallery.js plus their images in public/assets/images/)
// into the Sanity dataset. Safe to re-run — each document is created
// only if an equivalent one doesn't already exist.
//
// Usage (from the project root):
//
//   node --env-file=.env.local scripts/migrate-static-to-sanity.js
//
// .env.local must contain:
//   SANITY_PROJECT_ID=aib1nnox
//   SANITY_DATASET=production
//   SANITY_WRITE_TOKEN=sk...   (Editor token; same one Vercel uses)
//
// What it does:
//   - 3 news posts    → _type: newsPost
//   - N reports       → _type: report       (title derived from the
//                       static id — rename in admin if you want)
//   - 12 gallery pics → _type: galleryImage (orderRank 1..12; alt text
//                       empty for most — fill in via admin after)
// Any PDF attached to a report is uploaded as a Sanity file asset.

import { createClient } from '@sanity/client'
import { randomBytes } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { news } from '../src/data/news.js'
import { reports } from '../src/data/reports.js'
import { getGallery } from '../src/data/gallery.js'

const PROJECT_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const PUBLIC_DIR = join(PROJECT_ROOT, 'public')

// --- Config check -----------------------------------------------------
const required = ['SANITY_PROJECT_ID', 'SANITY_DATASET', 'SANITY_WRITE_TOKEN']
const missing = required.filter(k => !process.env[k])
if (missing.length) {
  console.error(`\nMissing env var(s): ${missing.join(', ')}`)
  console.error('Run with:  node --env-file=.env.local scripts/migrate-static-to-sanity.js\n')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- Helpers ----------------------------------------------------------
const key = () => randomBytes(6).toString('hex')

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
}
function contentTypeFor(filename) {
  return CONTENT_TYPES[extname(filename).toLowerCase()] || 'application/octet-stream'
}

async function uploadAsset(kind, publicPath) {
  const absPath = join(PUBLIC_DIR, publicPath.replace(/^\//, ''))
  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`)
  }
  const buffer = readFileSync(absPath)
  return client.assets.upload(kind, buffer, {
    filename: basename(publicPath),
    contentType: contentTypeFor(publicPath),
  })
}

// Convert a plain string[] (or a single string with blank-line separators)
// into Sanity Portable Text blocks.
function toPortableText(input) {
  const paragraphs = Array.isArray(input)
    ? input
    : String(input || '').split(/\n\s*\n/)
  return paragraphs
    .map(p => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean)
    .map(text => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: key(), text, marks: [] }],
    }))
}

// Idempotency guards: don't recreate a document that already exists.
async function slugExists(type, slug) {
  return (
    (await client.fetch(
      `count(*[_type == $type && slug.current == $slug])`,
      { type, slug },
    )) > 0
  )
}
async function titleExists(type, title) {
  return (
    (await client.fetch(
      `count(*[_type == $type && title == $title])`,
      { type, title },
    )) > 0
  )
}

// Humanise a kebab-case id into a readable title.
function titleFromId(id) {
  return id
    .split('-')
    .map(w => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
    // Keep common lowercase words lowercase mid-sentence.
    .replace(/\b(The|Of|In|On|At|And|Or|For)\b/g, m => m.toLowerCase())
}

// --- Migrators --------------------------------------------------------
async function migrateNews() {
  console.log(`\nNews (${news.length} posts):`)
  for (const post of news) {
    if (await slugExists('newsPost', post.id)) {
      console.log(`  SKIP  ${post.title} — slug already in Sanity`)
      continue
    }
    const asset = await uploadAsset('image', post.coverImage)
    await client.create({
      _type: 'newsPost',
      title: post.title,
      slug: { _type: 'slug', current: post.id },
      date: `${post.date}T00:00:00Z`,
      excerpt: post.excerpt,
      body: toPortableText(post.body),
      thumbnail: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: post.coverAlt || '',
      },
    })
    console.log(`  OK    ${post.title}`)
  }
}

async function migrateReports() {
  console.log(`\nReports (${reports.length} entries):`)
  for (const report of reports) {
    const title = titleFromId(report.id)
    if (await titleExists('report', title)) {
      console.log(`  SKIP  ${title} — already in Sanity`)
      continue
    }
    const imageAsset = await uploadAsset('image', report.image)
    const fileAsset = report.downloadUrl ? await uploadAsset('file', report.downloadUrl) : null
    await client.create({
      _type: 'report',
      title,
      description: report.body,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id },
        alt: report.imageAlt || '',
      },
      ...(fileAsset && {
        file: {
          _type: 'file',
          asset: { _type: 'reference', _ref: fileAsset._id },
        },
      }),
    })
    console.log(`  OK    ${title}${fileAsset ? ' (+ PDF)' : ''}`)
  }
}

async function migrateGallery() {
  const images = getGallery()
  console.log(`\nGallery (${images.length} photos):`)
  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    const slug = `${img.id}-static`
    if (await slugExists('galleryImage', slug)) {
      console.log(`  SKIP  ${img.id} — already in Sanity`)
      continue
    }
    const asset = await uploadAsset('image', img.src)
    await client.create({
      _type: 'galleryImage',
      slug: { _type: 'slug', current: slug },
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: img.alt || '',
      },
      orderRank: i + 1,
    })
    console.log(`  OK    ${img.id}`)
  }
}

// --- Run --------------------------------------------------------------
try {
  console.log(`Migrating into project ${process.env.SANITY_PROJECT_ID} / dataset ${process.env.SANITY_DATASET}`)
  await migrateNews()
  await migrateReports()
  await migrateGallery()
  console.log('\nDone.')
} catch (err) {
  console.error('\nMigration failed:', err.message || err)
  if (err.stack) console.error(err.stack)
  process.exit(1)
}
