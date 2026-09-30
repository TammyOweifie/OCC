// Bulk photo uploader for the Gallery admin.
// ------------------------------------------
// Drag files (or click "Choose files") to add them to the queue. Each
// queued file becomes a row with a thumbnail preview, an alt-text input
// and a remove button. Hitting "Upload all" POSTs each to
// /api/admin/gallery sequentially — one request per file — showing
// per-row status (queued / uploading / done / failed).
import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi, fileToDataUrl } from './api.js'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function GalleryUpload() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])   // [{ id, file, dataUrl, alt, status, error }]
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback(async (fileList) => {
    const files = [...fileList].filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return
    const withData = await Promise.all(files.map(async f => ({
      id: uid(),
      file: f,
      dataUrl: await fileToDataUrl(f),
      alt: '',
      status: 'queued',
      error: '',
    })))
    setItems(prev => [...prev, ...withData])
  }, [])

  function onFileInput(e) {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }

  function updateAlt(id, alt) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, alt } : it))
  }

  function remove(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  async function uploadAll() {
    setUploading(true)
    // Only try items that haven't already succeeded
    const pending = items.filter(it => it.status !== 'done')
    for (const item of pending) {
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'uploading', error: '' } : it))
      try {
        await adminApi.createGalleryImage({
          image: {
            base64: item.dataUrl,
            filename: item.file.name,
            alt: item.alt,
          },
        })
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'done' } : it))
      } catch (err) {
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'failed', error: err.message } : it))
      }
    }
    setUploading(false)
  }

  const total = items.length
  const done = items.filter(i => i.status === 'done').length
  const failed = items.filter(i => i.status === 'failed').length
  const pending = total - done - failed
  const allDone = total > 0 && done === total

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        to="/admin/gallery"
        className="font-mono text-xs uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors block mb-3"
      >
        ← Gallery
      </Link>
      <h1 className="font-serif text-4xl text-sand-900 tracking-tight font-normal mb-10">
        Upload photos
      </h1>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed p-12 text-center bg-white transition-colors ${
          dragActive ? 'border-accent bg-sand-100/40' : 'border-sand-300/70'
        }`}
      >
        <p className="font-serif text-xl text-sand-900 mb-2">
          Drag photos here
        </p>
        <p className="text-earth-700 font-light mb-6">
          or
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors"
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileInput}
          className="hidden"
        />
        <p className="text-xs text-earth-600 font-light mt-6">
          You can add more after a batch — nothing is uploaded until you click "Upload all".
        </p>
      </div>

      {/* Queue */}
      {items.length > 0 && (
        <>
          <div className="mt-10 mb-6 flex items-end justify-between border-b border-sand-200 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-earth-600 mb-1">
                {total} photo{total === 1 ? '' : 's'} queued
                {done > 0 && ` · ${done} done`}
                {failed > 0 && ` · ${failed} failed`}
              </p>
              <h2 className="font-serif text-2xl text-sand-900">
                Review before upload
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {allDone ? (
                <button
                  type="button"
                  onClick={() => navigate('/admin/gallery')}
                  className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors"
                >
                  Back to gallery
                </button>
              ) : (
                <button
                  type="button"
                  onClick={uploadAll}
                  disabled={uploading || pending === 0}
                  className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors disabled:opacity-60"
                >
                  {uploading ? `Uploading… (${done + failed}/${total})` : `Upload ${pending} photo${pending === 1 ? '' : 's'}`}
                </button>
              )}
            </div>
          </div>

          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex items-start gap-4 bg-white border border-sand-300/60 p-4">
                <div className="w-28 h-20 bg-sand-200 overflow-hidden flex-shrink-0">
                  <img src={item.dataUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-mono text-xs text-earth-600 truncate">{item.file.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <input
                    type="text"
                    placeholder="Alt text (short description of the photo)"
                    value={item.alt}
                    onChange={e => updateAlt(item.id, e.target.value)}
                    disabled={item.status === 'done' || item.status === 'uploading'}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300/70 text-sm focus:outline-none focus:border-accent focus:bg-white disabled:bg-sand-100 disabled:text-earth-600"
                  />
                  {item.status === 'failed' && item.error && (
                    <p className="text-xs text-red-700 mt-2 font-light">{item.error}</p>
                  )}
                </div>
                {item.status !== 'uploading' && item.status !== 'done' && (
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-xs font-mono uppercase tracking-widest text-earth-600 hover:text-red-700 transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    queued: 'text-earth-600',
    uploading: 'text-accent',
    done: 'text-forest-700',
    failed: 'text-red-700',
  }
  const labels = {
    queued: 'Queued',
    uploading: 'Uploading…',
    done: 'Done',
    failed: 'Failed',
  }
  return (
    <span className={`font-mono text-[10px] uppercase tracking-widest ${styles[status] || ''}`}>
      {labels[status] || status}
    </span>
  )
}
