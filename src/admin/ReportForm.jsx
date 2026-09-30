import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, fileToDataUrl } from './api.js'

const EMPTY = {
  title: '',
  date: '',
  description: '',
  image: null,           // { file, dataUrl } for a NEW upload
  existingImageUrl: '',
  existingImageAssetId: '',
  alt: '',
  file: null,            // { file, dataUrl } for a NEW PDF upload
  existingFileUrl: '',
  existingFileAssetId: '',
  existingFileName: '',
  removeExistingFile: false,
}

export default function ReportForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    adminApi.getReport(id)
      .then(({ report }) => {
        if (!alive) return
        setForm({
          title: report.title || '',
          date: report.date ? report.date.slice(0, 10) : '',
          description: report.description || '',
          image: null,
          existingImageUrl: report.imageUrl || '',
          existingImageAssetId: report.imageAssetId || '',
          alt: report.imageAlt || '',
          file: null,
          existingFileUrl: report.fileUrl || '',
          existingFileAssetId: report.fileAssetId || '',
          existingFileName: report.fileName || '',
          removeExistingFile: false,
        })
      })
      .catch(err => alive && setError(err.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id, isEdit])

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setForm(f => ({ ...f, image: { file, dataUrl } }))
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setForm(f => ({ ...f, file: { file, dataUrl }, removeExistingFile: false }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        date: form.date ? new Date(form.date).toISOString() : null,
        description: form.description,
      }
      if (form.image) {
        payload.image = {
          base64: form.image.dataUrl,
          filename: form.image.file.name,
          alt: form.alt,
        }
      } else if (isEdit && form.existingImageAssetId) {
        payload.image = {
          assetId: form.existingImageAssetId,
          alt: form.alt,
        }
      }

      if (form.file) {
        payload.file = {
          base64: form.file.dataUrl,
          filename: form.file.file.name,
        }
      } else if (form.removeExistingFile) {
        payload.file = null
      } else if (isEdit && form.existingFileAssetId) {
        payload.file = { assetId: form.existingFileAssetId }
      }

      if (isEdit) {
        await adminApi.updateReport(id, payload)
      } else {
        await adminApi.createReport(payload)
      }
      navigate('/admin/reports', { replace: true })
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

  const imagePreview = form.image?.dataUrl || form.existingImageUrl
  const hasExistingFile = form.existingFileAssetId && !form.removeExistingFile

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to="/admin/reports"
        className="font-mono text-xs uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors block mb-3"
      >
        ← Reports
      </Link>
      <h1 className="font-serif text-4xl text-sand-900 tracking-tight font-normal mb-10">
        {isEdit ? 'Edit report' : 'New report'}
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

        <Field label="Date">
          <input
            type="date"
            value={form.date}
            onChange={e => updateField('date', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Cover image" help="Upload a cover image. Existing image is kept if you don't pick a new one.">
          {imagePreview && (
            <div className="mb-3 bg-sand-100 aspect-[3/2] w-full max-w-xs overflow-hidden border border-sand-200">
              <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-earth-700 file:mr-4 file:py-2 file:px-4 file:border file:border-sand-300 file:bg-sand-50 file:text-earth-700 file:font-mono file:text-xs file:uppercase file:tracking-wider hover:file:bg-sand-100 file:cursor-pointer"
          />
        </Field>

        <Field label="Alt text" help="Describe the cover image for screen readers.">
          <input
            type="text"
            value={form.alt}
            onChange={e => updateField('alt', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Description" help="Body text shown on the public Reports page.">
          <textarea
            rows={6}
            value={form.description}
            onChange={e => updateField('description', e.target.value)}
            className="input font-sans leading-relaxed"
          />
        </Field>

        <Field label="Downloadable file (optional)" help="PDF or similar. Attach if this report has one.">
          {hasExistingFile && !form.file && (
            <div className="mb-3 flex items-center justify-between border border-sand-200 bg-sand-50 px-4 py-3 text-sm">
              <span className="text-earth-700 font-light">
                <span className="font-mono text-xs text-accent uppercase tracking-wider mr-2">Current</span>
                {form.existingFileName || 'Attached file'}
              </span>
              <button
                type="button"
                onClick={() => updateField('removeExistingFile', true)}
                className="text-xs font-mono uppercase tracking-wider text-red-700 hover:text-red-900 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
          {form.file && (
            <div className="mb-3 flex items-center border border-sand-200 bg-sand-50 px-4 py-3 text-sm">
              <span className="text-earth-700 font-light">
                <span className="font-mono text-xs text-accent uppercase tracking-wider mr-2">New</span>
                {form.file.file.name}
              </span>
            </div>
          )}
          <input
            type="file"
            accept="application/pdf,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-earth-700 file:mr-4 file:py-2 file:px-4 file:border file:border-sand-300 file:bg-sand-50 file:text-earth-700 file:font-mono file:text-xs file:uppercase file:tracking-wider hover:file:bg-sand-100 file:cursor-pointer"
          />
        </Field>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-sand-200">
          <Link
            to="/admin/reports"
            className="text-xs font-mono uppercase tracking-widest text-earth-700 hover:text-forest-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create report'}
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
