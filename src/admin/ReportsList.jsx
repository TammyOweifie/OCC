import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from './api.js'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d) ? '—' : d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function ReportsList() {
  const navigate = useNavigate()
  const [reports, setReports] = useState(null)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setError('')
    try {
      const { reports } = await adminApi.listReports()
      setReports(reports)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(report) {
    const confirmed = window.confirm(`Delete "${report.title}"? This cannot be undone.`)
    if (!confirmed) return
    setDeletingId(report._id)
    try {
      await adminApi.deleteReport(report._id)
      setReports(list => list.filter(r => r._id !== report._id))
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
            Reports
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/reports/new')}
          className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors"
        >
          + New report
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {reports === null && !error && (
        <p className="text-earth-600 font-mono text-xs uppercase tracking-widest">
          Loading…
        </p>
      )}

      {reports && reports.length === 0 && (
        <div className="border border-sand-300/60 py-16 text-center bg-white">
          <p className="text-earth-700 font-light">No reports yet.</p>
          <button
            type="button"
            onClick={() => navigate('/admin/reports/new')}
            className="mt-4 text-accent hover:text-forest-700 underline underline-offset-4 font-medium text-sm transition-colors"
          >
            Create the first one
          </button>
        </div>
      )}

      {reports && reports.length > 0 && (
        <div className="border border-sand-300/60 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 text-left">
                <th className="w-24 py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium"></th>
                <th className="py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium">Title</th>
                <th className="py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium hidden md:table-cell">Date</th>
                <th className="py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium hidden lg:table-cell">File</th>
                <th className="w-40 py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id} className="border-b border-sand-200 last:border-b-0 hover:bg-sand-50/60">
                  <td className="py-3 px-4">
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        alt={report.imageAlt || report.title}
                        className="w-16 h-12 object-cover bg-sand-200"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-sand-200 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-earth-600 uppercase">no img</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-serif text-sand-900">{report.title}</div>
                    {report.description && (
                      <div className="text-xs text-earth-600 mt-0.5 line-clamp-1 font-light">
                        {report.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-earth-600 hidden md:table-cell">
                    {formatDate(report.date)}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {report.fileUrl ? (
                      <span className="font-mono text-xs text-accent">PDF</span>
                    ) : (
                      <span className="font-mono text-xs text-earth-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/reports/${report._id}/edit`}
                      className="text-xs font-mono uppercase tracking-wider text-accent hover:text-forest-700 mr-4 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(report)}
                      disabled={deletingId === report._id}
                      className="text-xs font-mono uppercase tracking-wider text-red-700 hover:text-red-900 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === report._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
