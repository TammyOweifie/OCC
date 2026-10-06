// GET  /api/admin/gallery   → list (id, imageUrl, alt, orderRank, createdAt)
// POST /api/admin/gallery   → create one image (used repeatedly by the client
//                             for bulk uploads — one request per file)

import { withAuth } from '../_lib/session.js'
import { sanityWriteClient } from '../_lib/sanity.js'

async function uploadImage(image) {
  if (!image || !image.base64) {
    throw new Error('Image data is required')
  }
  const match = /^data:([^;]+);base64,(.+)$/.exec(image.base64)
  if (!match) throw new Error('Invalid image data URL')
  const [, contentType, b64] = match
  const buffer = Buffer.from(b64, 'base64')
  const asset = await sanityWriteClient.assets.upload('image', buffer, {
    contentType,
    filename: image.filename || 'gallery-image',
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: image.alt || '',
  }
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const images = await sanityWriteClient.fetch(
      `*[_type == "galleryImage"] | order(coalesce(orderRank, 9999) asc, _createdAt desc) {
        _id,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        "imageAssetId": image.asset._ref,
        "alt": image.alt,
        caption,
        orderRank,
        _createdAt
      }`
    )
    res.status(200).json({ images })
    return
  }

  if (req.method === 'POST') {
    const { image, caption, orderRank } = req.body || {}

    if (!image || !image.base64) {
      res.status(400).json({ error: 'Image file is required' })
      return
    }

    let imageField
    try {
      imageField = await uploadImage(image)
    } catch (e) {
      res.status(400).json({ error: e.message })
      return
    }

    const alt = image.alt || ''
    const slugBase = alt || image.filename || 'photo'

    const doc = {
      _type: 'galleryImage',
      slug: {
        _type: 'slug',
        current: `${slugify(slugBase)}-${Date.now().toString(36)}`,
      },
      image: imageField,
      ...(caption && { caption }),
      ...(typeof orderRank === 'number' && { orderRank }),
    }

    const created = await sanityWriteClient.create(doc)
    res.status(201).json({ _id: created._id })
    return
  }

  res.setHeader('Allow', 'GET, POST')
  res.status(405).end()
}

export default withAuth(handler)
