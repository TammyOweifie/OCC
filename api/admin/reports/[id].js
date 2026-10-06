// GET    /api/admin/reports/[id]  → full doc for edit form
// PATCH  /api/admin/reports/[id]  → update
// DELETE /api/admin/reports/[id]  → delete

import { withAuth } from '../../_lib/session.js'
import { sanityWriteClient } from '../../_lib/sanity.js'

async function uploadImageIfNew(image) {
  if (!image) return undefined
  if (image.assetId) {
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: image.assetId },
      alt: image.alt || '',
    }
  }
  if (!image.base64) return undefined
  const match = /^data:([^;]+);base64,(.+)$/.exec(image.base64)
  if (!match) throw new Error('Invalid image data URL')
  const [, contentType, b64] = match
  const buffer = Buffer.from(b64, 'base64')
  const asset = await sanityWriteClient.assets.upload('image', buffer, {
    contentType,
    filename: image.filename || 'report-cover',
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: image.alt || '',
  }
}

async function uploadFileIfNew(file) {
  if (!file) return undefined
  if (file.assetId) {
    return {
      _type: 'file',
      asset: { _type: 'reference', _ref: file.assetId },
    }
  }
  if (!file.base64) return undefined
  const match = /^data:([^;]+);base64,(.+)$/.exec(file.base64)
  if (!match) throw new Error('Invalid file data URL')
  const [, contentType, b64] = match
  const buffer = Buffer.from(b64, 'base64')
  const asset = await sanityWriteClient.assets.upload('file', buffer, {
    contentType,
    filename: file.filename || 'report.pdf',
  })
  return {
    _type: 'file',
    asset: { _type: 'reference', _ref: asset._id },
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
      `*[_type == "report" && _id == $id][0]{
        _id,
        title,
        date,
        description,
        "imageUrl": image.asset->url,
        "imageAssetId": image.asset._ref,
        "imageAlt": image.alt,
        "fileUrl": file.asset->url,
        "fileAssetId": file.asset._ref,
        "fileName": file.asset->originalFilename
      }`,
      { id }
    )
    if (!doc) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(200).json({ report: doc })
    return
  }

  if (req.method === 'PATCH') {
    const { title, date, description, image, file } = req.body || {}
    const patch = sanityWriteClient.patch(id)
    const set = {}
    const unset = []

    if (title !== undefined) set.title = title
    if (date !== undefined) set.date = date || null
    if (description !== undefined) set.description = description

    if (image && (image.base64 || image.alt !== undefined)) {
      try {
        set.image = await uploadImageIfNew(image)
      } catch (e) {
        res.status(400).json({ error: e.message })
        return
      }
    }

    if (file !== undefined) {
      if (file === null) {
        // Explicit removal
        unset.push('file')
      } else if (file.base64 || file.assetId) {
        try {
          set.file = await uploadFileIfNew(file)
        } catch (e) {
          res.status(400).json({ error: e.message })
          return
        }
      }
    }

    let tx = patch.set(set)
    if (unset.length) tx = tx.unset(unset)
    const result = await tx.commit()
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
