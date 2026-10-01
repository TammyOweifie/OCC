// Client-side image resize before upload + size-cap helpers.
// ----------------------------------------------------------
// Vercel's serverless functions have a ~4.5 MB request body limit.
// A 3 MB JPEG becomes ~4 MB after base64 encoding, which is already
// over the ceiling once headers are counted. Resizing in the browser
// before the request keeps us comfortably under the limit AND makes
// the stored photo web-optimized by default.
//
// Default target: 2000px on the longest side, JPEG quality 0.85.
// Images already smaller than that pass through untouched (we keep the
// original file to avoid pointless re-encoding losses).

// Raw file size cap. Base64 inflates bytes by ~33%, so a 3 MB file
// becomes ~4 MB in the request body — leaves headroom under Vercel's
// 4.5 MB serverless limit.
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// Returns null if the file is fine, or a human-readable error string.
// Used to surface the problem to OCC staff before the request fails
// at the server with a cryptic 413.
export function checkFileSize(file, maxBytes = MAX_UPLOAD_BYTES) {
  if (!file) return null
  if (file.size > maxBytes) {
    return (
      `"${file.name}" is ${formatBytes(file.size)}. ` +
      `Max upload size is ${formatBytes(maxBytes)}. ` +
      `Shrink the file (e.g. export at smaller dimensions or lower quality) and try again.`
    )
  }
  return null
}

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
