import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, fileToDataUrl } from './api.js'
import { resizeImageIfLarge } from './imageResize.js'

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

const EMPTY = {
  title: '',
  slug: '',
  date: '',
  excerpt: '',
  body: '',
  thumbnail: null,          // { file, dataUrl } for a NEW upload
  existingThumbnailUrl: '', // current asset URL (if editing)
  existingThumbnailAssetId: '', // asset _id, so PATCH can keep it if untouched
  alt: '',
}

export default function NewsForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    adminApi.getNewsPost(id)
      .then(({ post }) => {
        if (!alive) return
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          date: post.date ? post.date.slice(0, 10) : '',
          excerpt: post.excerpt || '',
          body: post.body || '',
          thumbnail: null,
          existingThumbnailUrl: post.thumbnailUrl || '',
          existingThumbnailAssetId: post.thumbnailAssetId || '',
          alt: post.thumbnailAlt || '',
        })
        setSlugTouched(true)
      })
      .catch(err => alive && setError(err.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id, isEdit])

  function updateField(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !slugTouched) next.slug = slugify(value)
      return next
    })
  }

  async function handleThumbnailChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await resizeImageIfLarge(file)
    const dataUrl = await fileToDataUrl(resized)
    setForm(f => ({ ...f, thumbnail: { file: resized, dataUrl } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        date: form.date ? new Date(form.date).toISOString() : null,
        excerpt: form.excerpt,
        body: form.body,
      }
      if (form.thumbnail) {
        payload.thumbnail = {
          base64: form.thumbnail.dataUrl,
          filename: form.thumbnail.file.name,
          alt: form.alt,
        }
      } else if (isEdit && form.existingThumbnailAssetId) {
        payload.thumbnail = {
          assetId: form.existingThumbnailAssetId,
          alt: form.alt,
        }
      }

      if (isEdit) {
        await adminApi.updateNewsPost(id, payload)
      } else {
        await adminApi.createNewsPost(payload)
      }
      navigate('/admin/news', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-earth-600">
          Loading…
        </p>
      </div>
    )
  }

  const previewUrl = form.thumbnail?.dataUrl || form.existingThumbnailUrl

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to="/admin/news"
        className="font-mono text-xs uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors block mb-3"
      >
        ← News
      </Link>
      <h1 className="font-serif text-4xl text-sand-900 tracking-tight font-normal mb-10">
        {isEdit ? 'Edit post' : 'New post'}
      </h1>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-sand-300/60 p-8 sm:p-10">
        <Field label="Title" required>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => updateField('title', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Slug" help="Auto-generated from the title. Edit if needed.">
          <input
            type="text"
            value={form.slug}
            onChange={e => { setSlugTouched(true); updateField('slug', slugify(e.target.value)) }}
            className="input font-mono"
          />
        </Field>

        <Field label="Date published">
          <input
            type="date"
            value={form.date}
            onChange={e => updateField('date', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Thumbnail" help="Upload a cover image. Existing image is kept if you don't pick a new one.">
          {previewUrl && (
            <div className="mb-3 bg-sand-100 aspect-[3/2] w-full max-w-xs overflow-hidden border border-sand-200">
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-earth-700 file:mr-4 file:py-2 file:px-4 file:border file:border-sand-300 file:bg-sand-50 file:text-earth-700 file:font-mono file:text-xs file:uppercase file:tracking-wider hover:file:bg-sand-100 file:cursor-pointer"
          />
        </Field>

        <Field label="Alt text" help="Describe the image for screen readers.">
          <input
            type="text"
            value={form.alt}
            onChange={e => updateField('alt', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Excerpt" help="Short summary shown on the card (2–3 sentences).">
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={e => updateField('excerpt', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Body" help="Full content. Separate paragraphs with a blank line.">
          <textarea
            rows={10}
            value={form.body}
            onChange={e => updateField('body', e.target.value)}
            className="input font-sans leading-relaxed"
          />
        </Field>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-sand-200">
          <Link
            to="/admin/news"
            className="text-xs font-mono uppercase tracking-widest text-earth-700 hover:text-forest-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create post'}
          </button>
        </div>
      </form>

      {/* Tailwind: apply shared input styling via a small class */}
      <style>{`.input{width:100%;padding:0.625rem 0.875rem;background:#FBF9F5;border:1px solid rgba(221,212,193,0.7);color:#23201B;font-size:0.875rem;transition:border-color .15s,background .15s}.input:focus{outline:none;border-color:#526829;background:#fff}`}</style>
    </div>
  )
}

function Field({ label, help, required, children }) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wider text-earth-600 mb-2">
        {label} {required && <span className="text-red-700">*</span>}
      </span>
      {children}
      {help && <span className="block mt-1.5 text-xs text-earth-600 font-light">{help}</span>}
    </label>
  )
}
