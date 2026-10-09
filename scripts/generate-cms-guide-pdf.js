// Render docs/cms-user-guide/index.html → docs/CMS-USER-GUIDE.pdf.
//
// Uses Puppeteer (bundles Chromium) so the output honours Google Fonts
// and the full CSS used by the HTML source — matches the OCC design
// system that the public site uses.
//
// Re-run after editing the HTML source:
//   npm run generate-cms-guide-pdf

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync, statSync } from 'node:fs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HTML_SOURCE = resolve(ROOT, 'docs/cms-user-guide/index.html')
const LOGO_PATH = resolve(ROOT, 'public/assets/logos/occ-logo.png')
const PDF_OUT = resolve(ROOT, 'docs/CMS-USER-GUIDE.pdf')

async function main() {
  // Inline the logo and every screenshot as data URLs so the HTML has no
  // filesystem-relative references — lets us use setContent() (sidesteps
  // file:// sandbox issues some Chrome builds hit) and keeps everything
  // self-contained for later portability.
  const toDataUrl = (p, mime = 'image/png') =>
    `data:${mime};base64,${readFileSync(p).toString('base64')}`

  let html = readFileSync(HTML_SOURCE, 'utf8').replace(
    '../../public/assets/logos/occ-logo.png',
    toDataUrl(LOGO_PATH)
  )

  // Inline every <img src="screenshots/*.png" ...> reference.
  html = html.replace(/src="screenshots\/([^"]+)"/g, (_m, filename) => {
    const abs = resolve(ROOT, 'docs/cms-user-guide/screenshots', filename)
    return `src="${toDataUrl(abs)}"`
  })

  // Prefer the system Chrome if present (macOS path); fall back to the
  // Chromium Puppeteer downloaded on first `npx puppeteer browsers install`.
  const SYSTEM_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const useSystem = (() => {
    try { return statSync(SYSTEM_CHROME).isFile() } catch { return false }
  })()

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(useSystem ? { executablePath: SYSTEM_CHROME } : {}),
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: PDF_OUT,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true, // honours @page rules in the HTML
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
  } finally {
    await browser.close()
  }
  const bytes = statSync(PDF_OUT).size
  console.log(`→ ${PDF_OUT} (${(bytes / 1024).toFixed(0)} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
