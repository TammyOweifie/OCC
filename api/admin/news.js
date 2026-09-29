// GET  /api/admin/news   → list (id, title, date, thumbnailUrl, excerpt)
// POST /api/admin/news   → create

import { withAuth } from '../_lib/session.js'
import { sanityWriteClient } from '../_lib/sanity.js'
import { textToPortableText } from '../_lib/portableText.js'

async function uploadImageIfNew(thumbnail) {
  if (!thumbnail) return undefined
  if (thumbnail.assetId) {
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: thumbnail.assetId },
      alt: thumbnail.alt || '',
    }
  }
  if (!thumbnail.base64) return undefined
  const match = /^data:([^;]+);base64,(.+)$/.exec(thumbnail.base64)
  if (!match) throw new Error('Invalid thumbnail data URL')
  const [, contentType, b64] = match
  const buffer = Buffer.from(b64, 'base64')
  const asset = await sanityWriteClient.assets.upload('image', buffer, {
    contentType,
    filename: thumbnail.filename || 'thumbnail',
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: thumbnail.alt || '',
  }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = await sanityWriteClient.fetch(
      `*[_type == "newsPost"] | order(date desc) {
        _id,
        title,
        date,
        excerpt,
        "slug": slug.current,
        "thumbnailUrl": thumbnail.asset->url,
        "thumbnailAlt": thumbnail.alt
      }`
    )
    res.status(200).json({ posts })
    return
  }

  if (req.method === 'POST') {
    const { title, slug, date, excerpt, body, thumbnail } = req.body || {}

    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    let thumbnailField
    try {
      thumbnailField = await uploadImageIfNew(thumbnail)
    } catch (e) {
      res.status(400).json({ error: e.message })
      return
    }

    const doc = {
      _type: 'newsPost',
      title,
      slug: {
        _type: 'slug',
        current:
          slug ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 96),
      },
      date: date || null,
      excerpt: excerpt || '',
      body: textToPortableText(body || ''),
      ...(thumbnailField && { thumbnail: thumbnailField }),
    }

    const created = await sanityWriteClient.create(doc)
    res.status(201).json({ _id: created._id })
    return
  }

  res.setHeader('Allow', 'GET, POST')
  res.status(405).end()
}

export default withAuth(handler)
