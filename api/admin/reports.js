// GET  /api/admin/reports   → list (id, title, date, imageUrl, description)
// POST /api/admin/reports   → create

import { withAuth } from '../_lib/session.js'
import { sanityWriteClient } from '../_lib/sanity.js'

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
  if (req.method === 'GET') {
    const reports = await sanityWriteClient.fetch(
      `*[_type == "report"] | order(date desc) {
        _id,
        title,
        date,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        "fileUrl": file.asset->url
      }`
    )
    res.status(200).json({ reports })
    return
  }

  if (req.method === 'POST') {
    const { title, date, description, image, file } = req.body || {}

    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    let imageField, fileField
    try {
      imageField = await uploadImageIfNew(image)
      fileField = await uploadFileIfNew(file)
    } catch (e) {
      res.status(400).json({ error: e.message })
      return
    }

    const doc = {
      _type: 'report',
      title,
      date: date || null,
      description: description || '',
      ...(imageField && { image: imageField }),
      ...(fileField && { file: fileField }),
    }

    const created = await sanityWriteClient.create(doc)
    res.status(201).json({ _id: created._id })
    return
  }

  res.setHeader('Allow', 'GET, POST')
  res.status(405).end()
}

export default withAuth(handler)
