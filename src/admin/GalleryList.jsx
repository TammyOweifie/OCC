import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from './api.js'

export default function GalleryList() {
  const navigate = useNavigate()
  const [images, setImages] = useState(null)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setError('')
    try {
      const { images } = await adminApi.listGallery()
      setImages(images)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(img) {
    const confirmed = window.confirm(`Delete this photo? This cannot be undone.`)
    if (!confirmed) return
    setDeletingId(img._id)
    try {
      await adminApi.deleteGalleryImage(img._id)
      setImages(list => list.filter(i => i._id !== img._id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between border-b border-sand-200 pb-6 mb-10">
        <div>
          <Link
            to="/admin"
            className="font-mono text-xs uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors block mb-3"
          >
            ← Dashboard
          </Link>
          <h1 className="font-serif text-4xl text-sand-900 tracking-tight font-normal">
            Gallery
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/gallery/upload')}
          className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors"
        >
          + Add photos
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {images === null && !error && (
        <p className="text-earth-600 font-mono text-xs uppercase tracking-widest">
          Loading…
        </p>
      )}

      {images && images.length === 0 && (
        <div className="border border-sand-300/60 py-16 text-center bg-white">
          <p className="text-earth-700 font-light">No photos yet.</p>
          <button
            type="button"
            onClick={() => navigate('/admin/gallery/upload')}
            className="mt-4 text-accent hover:text-forest-700 underline underline-offset-4 font-medium text-sm transition-colors"
          >
            Upload the first ones
          </button>
        </div>
      )}

      {images && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img._id} className="group relative bg-sand-200 border border-sand-300/60 aspect-[4/3] overflow-hidden">
              {img.imageUrl ? (
                <img
                  src={img.imageUrl}
                  alt={img.alt || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-earth-600">
                  No image
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <Link
                  to={`/admin/gallery/${img._id}/edit`}
                  className="px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sand-50 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50/60"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img._id}
                  className="px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-red-300 hover:text-red-100 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50/60"
                >
                  {deletingId === img._id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
              {/* Alt-text overlay at bottom, always visible when alt is empty */}
              {!img.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 text-red-50 px-2 py-1 font-mono text-[10px] uppercase tracking-wider">
                  Missing alt text
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
