// Generate favicons from the OCC logo.
//
// Produces:
//   public/favicon-16.png
//   public/favicon-32.png
//   public/favicon-48.png
//   public/apple-touch-icon.png (180×180)
//   public/favicon.ico (bundles 16/32/48)
//
// Approach:
//   1. Trim transparent padding from the source logo.
//   2. Extract the leftmost square — the "O" logomark alone, without
//      the text lockup. Readable at tiny sizes where the full lockup
//      would be mush.
//   3. Resize to each target with ~10% padding and composite onto a
//      sand-50 opaque background (matches tailwind.config.js's
//      `sand.50 = #FBF9F5`). Opaque so iOS doesn't fill transparency
//      with a system-chosen colour on the home screen.
//
// Run with:  node scripts/generate-favicons.js

import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(ROOT, 'public/assets/logos/occ-logo.png')
const OUT = resolve(ROOT, 'public')

const SAND_50 = { r: 251, g: 249, b: 245, alpha: 1 } // tailwind.config.js
const PADDING_RATIO = 0.1

async function extractMark() {
  const trimmed = await sharp(SOURCE).trim().toBuffer()
  const meta = await sharp(trimmed).metadata()
  const side = Math.min(meta.width, meta.height)
  return sharp(trimmed).extract({ left: 0, top: 0, width: side, height: side }).toBuffer()
}

async function makeIcon(markBuffer, size) {
  const padding = Math.round(size * PADDING_RATIO)
  const inner = size - padding * 2
  const scaledMark = await sharp(markBuffer)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: SAND_50 },
  })
    .composite([{ input: scaledMark, top: padding, left: padding }])
    .png()
    .toBuffer()
}

async function generate() {
  const markBuffer = await extractMark()

  const specs = [
    [16, 'favicon-16.png'],
    [32, 'favicon-32.png'],
    [48, 'favicon-48.png'],
    [180, 'apple-touch-icon.png'],
  ]

  const buffers = {}
  for (const [size, filename] of specs) {
    const buf = await makeIcon(markBuffer, size)
    buffers[size] = buf
    await writeFile(resolve(OUT, filename), buf)
    console.log(`→ ${filename} (${size}×${size})`)
  }

  const icoBuffer = await pngToIco([buffers[16], buffers[32], buffers[48]])
  await writeFile(resolve(OUT, 'favicon.ico'), icoBuffer)
  console.log('→ favicon.ico (16/32/48 bundled)')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
