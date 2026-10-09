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
import { statSync } from 'node:fs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HTML_SOURCE = resolve(ROOT, 'docs/cms-user-guide/index.html')
const PDF_OUT = resolve(ROOT, 'docs/CMS-USER-GUIDE.pdf')

async function main() {
  // Prefer the system Chrome if present (macOS path); fall back to the
  // Chromium Puppeteer downloaded on first `npx puppeteer browsers install`.
  const SYSTEM_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const useSystem = (() => {
    try { return statSync(SYSTEM_CHROME).isFile() } catch { return false }
  })()
  const browser = await puppeteer.launch({
    headless: true,
    ...(useSystem ? { executablePath: SYSTEM_CHROME } : {}),
  })
  try {
    const page = await browser.newPage()
    await page.goto(`file://${HTML_SOURCE}`, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: PDF_OUT,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true, // honours the @page rules in the HTML
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
