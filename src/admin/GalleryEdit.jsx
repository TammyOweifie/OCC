import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from './api.js'

export default function GalleryEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    adminApi.getGalleryImage(id)
      .then(({ image }) => {
        if (!alive) return
        setForm({
          imageUrl: image.imageUrl || '',
          alt: image.alt || '',
          caption: image.caption || '',
          orderRank: image.orderRank ?? '',
        })
      })
      .catch(err => alive && setError(err.message))
    return () => { alive = false }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await adminApi.updateGalleryImage(id, {
        alt: form.alt,
        caption: form.caption,
        orderRank: form.orderRank === '' ? null : Number(form.orderRank),
      })
      navigate('/admin/gallery', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (error && !form) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-earth-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to="/admin/gallery"
        className="font-mono text-xs uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors block mb-3"
      >
        ← Gallery
      </Link>
      <h1 className="font-serif text-4xl text-sand-900 tracking-tight font-normal mb-10">
        Edit photo
      </h1>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-sand-300/60 p-8 sm:p-10">
        <div className="bg-sand-100 aspect-[4/3] w-full max-w-md overflow-hidden border border-sand-200">
          {form.imageUrl && <img src={form.imageUrl} alt={form.alt || ''} className="w-full h-full object-cover" />}
        </div>

        <Field label="Alt text" required help="Short description of what the photo shows. Used by screen readers.">
          <input
            type="text"
            value={form.alt}
            onChange={e => setForm(f => ({ ...f, alt: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Caption" help="Optional. Not currently displayed on the public gallery.">
          <input
            type="text"
            value={form.caption}
            onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Order" help="Lower numbers appear first. Leave blank to sort by upload date.">
          <input
            type="number"
            value={form.orderRank}
            onChange={e => setForm(f => ({ ...f, orderRank: e.target.value }))}
            className="input"
          />
        </Field>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-sand-200">
          <Link
            to="/admin/gallery"
            className="text-xs font-mono uppercase tracking-widest text-earth-700 hover:text-forest-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

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
