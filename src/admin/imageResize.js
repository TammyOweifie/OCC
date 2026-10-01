// Client-side image resize before upload.
// ---------------------------------------
// Vercel's serverless functions have a ~4.5 MB request body limit.
// A 3 MB JPEG becomes ~4 MB after base64 encoding, which is already
// over the ceiling once headers are counted. Resizing in the browser
// before the request keeps us comfortably under the limit AND makes
// the stored photo web-optimized by default.
//
// Default target: 2000px on the longest side, JPEG quality 0.85.
// Images already smaller than that pass through untouched (we keep the
// original file to avoid pointless re-encoding losses).

export async function resizeImageIfLarge(
  file,
  { maxDim = 2000, quality = 0.85 } = {},
) {
  // Only resize raster images we can draw to a canvas. Leave GIFs,
  // SVGs, HEICs etc. untouched — the caller handles errors on upload.
  const resizable = /^image\/(jpeg|png|webp)$/.test(file.type)
  if (!resizable) return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // If the browser can't decode it, pass the original through.
    return file
  }

  try {
    const { width, height } = bitmap
    const maxActual = Math.max(width, height)
    if (maxActual <= maxDim) {
      return file
    }

    const scale = maxDim / maxActual
    const newW = Math.round(width * scale)
    const newH = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = newW
    canvas.height = newH
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, newW, newH)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error('Canvas export failed'))),
        'image/jpeg',
        quality,
      )
    })

    // Preserve filename but switch extension to .jpg (we re-encoded).
    const newName = file.name.replace(/\.[^.]+$/, '.jpg')
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() })
  } finally {
    if (bitmap && typeof bitmap.close === 'function') bitmap.close()
  }
}
