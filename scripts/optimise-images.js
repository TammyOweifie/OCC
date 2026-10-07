// Optimise static images in public/assets/images/.
//
// For each JPEG in the tree:
//   1. If max dimension > MAX_SIZE, resize so longest side = MAX_SIZE
//      (preserves aspect ratio).
//   2. Re-encode as JPEG at QUALITY, overwriting the file.
//   3. Write a .webp sibling at WEBP_QUALITY, same dimensions.
//
// PNGs are left alone (there's only team/kevin.png and it has no
// above-the-fold impact; converting to JPEG would need code changes
// to the referencing <img src> and risks breaking alpha).
//
// Idempotent: re-running on already-processed files just re-encodes
// at the same quality. Safe to run after adding a new image.
//
// Run with:  node scripts/optimise-images.js

import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const IMAGES_DIR = resolve(ROOT, 'public/assets/images')
const MAX_SIZE = 2000
const QUALITY = 82
const WEBP_QUALITY = 80

function listJpegs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      listJpegs(p, out)
      continue
    }
    if (/\.(jpe?g)$/i.test(name)) out.push(p)
  }
  return out
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`.padStart(7, ' ')
}

async function optimise(file) {
  const beforeBytes = statSync(file).size
  const img = sharp(file, { failOn: 'none' })
  const meta = await img.metadata()
  const needsResize = Math.max(meta.width, meta.height) > MAX_SIZE

  let pipeline = sharp(file, { failOn: 'none' }).rotate() // honour EXIF orientation
  if (needsResize) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? MAX_SIZE : undefined,
      height: meta.height > meta.width ? MAX_SIZE : undefined,
      withoutEnlargement: true,
    })
  }

  const jpegBuffer = await pipeline
    .clone()
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer()
  const webpBuffer = await pipeline
    .clone()
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()

  const { writeFile } = await import('node:fs/promises')
  await writeFile(file, jpegBuffer)
  const webpPath = file.replace(/\.(jpe?g)$/i, '.webp')
  await writeFile(webpPath, webpBuffer)

  const afterMeta = await sharp(jpegBuffer).metadata()
  const rel = relative(ROOT, file)
  console.log(
    `${fmt(beforeBytes)} → ${fmt(jpegBuffer.length)} jpg, ${fmt(webpBuffer.length)} webp  ${afterMeta.width}×${afterMeta.height}  ${rel}`
  )
}

async function main() {
  const files = listJpegs(IMAGES_DIR)
  if (files.length === 0) {
    console.log('No JPEGs found under', IMAGES_DIR)
    return
  }
  let totalBefore = 0
  let totalAfter = 0
  for (const f of files) {
    const before = statSync(f).size
    totalBefore += before
    await optimise(f)
    totalAfter += statSync(f).size
  }
  console.log(
    `\nTotal JPEG bytes: ${fmt(totalBefore).trim()} → ${fmt(totalAfter).trim()}  (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
