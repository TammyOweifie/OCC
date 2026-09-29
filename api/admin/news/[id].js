// GET    /api/admin/news/[id]  → full doc for edit form
// PATCH  /api/admin/news/[id]  → update
// DELETE /api/admin/news/[id]  → delete

import { withAuth } from '../../_lib/session.js'
import { sanityWriteClient } from '../../_lib/sanity.js'
import { textToPortableText, portableTextToText } from '../../_lib/portableText.js'

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
  const { id } = req.query
  if (!id) {
    res.status(400).json({ error: 'Missing id' })
    return
  }

  if (req.method === 'GET') {
    const doc = await sanityWriteClient.fetch(
      `*[_type == "newsPost" && _id == $id][0]{
        _id,
        title,
        "slug": slug.current,
        date,
        excerpt,
        body,
        "thumbnailUrl": thumbnail.asset->url,
        "thumbnailAssetId": thumbnail.asset._ref,
        "thumbnailAlt": thumbnail.alt
      }`,
      { id }
    )
    if (!doc) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(200).json({
      post: {
        ...doc,
        body: portableTextToText(doc.body),
      },
    })
    return
  }

  if (req.method === 'PATCH') {
    const { title, slug, date, excerpt, body, thumbnail } = req.body || {}
    const patch = sanityWriteClient.patch(id)
    const set = {}

    if (title !== undefined) set.title = title
    if (slug !== undefined) set.slug = { _type: 'slug', current: slug }
    if (date !== undefined) set.date = date || null
    if (excerpt !== undefined) set.excerpt = excerpt
    if (body !== undefined) set.body = textToPortableText(body)

    if (thumbnail && (thumbnail.base64 || thumbnail.alt !== undefined)) {
      try {
        set.thumbnail = await uploadImageIfNew(thumbnail)
      } catch (e) {
        res.status(400).json({ error: e.message })
        return
      }
    }

    const result = await patch.set(set).commit()
    res.status(200).json({ _id: result._id })
    return
  }

  if (req.method === 'DELETE') {
    await sanityWriteClient.delete(id)
    res.status(204).end()
    return
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE')
  res.status(405).end()
}

export default withAuth(handler)
