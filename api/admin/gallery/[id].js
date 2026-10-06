// GET    /api/admin/gallery/[id]  → full doc for edit
// PATCH  /api/admin/gallery/[id]  → update alt, caption, orderRank
// DELETE /api/admin/gallery/[id]  → delete

import { withAuth } from '../../_lib/session.js'
import { sanityWriteClient } from '../../_lib/sanity.js'

async function handler(req, res) {
  const { id } = req.query
  if (!id) {
    res.status(400).json({ error: 'Missing id' })
    return
  }

  if (req.method === 'GET') {
    const doc = await sanityWriteClient.fetch(
      `*[_type == "galleryImage" && _id == $id][0]{
        _id,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        "imageAssetId": image.asset._ref,
        "alt": image.alt,
        caption,
        orderRank
      }`,
      { id }
    )
    if (!doc) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(200).json({ image: doc })
    return
  }

  if (req.method === 'PATCH') {
    const { alt, caption, orderRank } = req.body || {}
    const patch = sanityWriteClient.patch(id)
    const set = {}

    if (alt !== undefined) set['image.alt'] = alt
    if (caption !== undefined) set.caption = caption
    if (orderRank !== undefined) set.orderRank = orderRank

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
