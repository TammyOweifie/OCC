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

export default function NewsList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setError('')
    try {
      const { posts } = await adminApi.listNews()
      setPosts(posts)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(post) {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone.`)
    if (!confirmed) return
    setDeletingId(post._id)
    try {
      await adminApi.deleteNewsPost(post._id)
      setPosts(list => list.filter(p => p._id !== post._id))
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
            News
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/news/new')}
          className="px-6 py-3 bg-forest-800 text-sand-50 text-xs uppercase tracking-eyebrow font-medium hover:bg-accent transition-colors"
        >
          + New post
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {posts === null && !error && (
        <p className="text-earth-600 font-mono text-xs uppercase tracking-widest">
          Loading…
        </p>
      )}

      {posts && posts.length === 0 && (
        <div className="border border-sand-300/60 py-16 text-center bg-white">
          <p className="text-earth-700 font-light">No posts yet.</p>
          <button
            type="button"
            onClick={() => navigate('/admin/news/new')}
            className="mt-4 text-accent hover:text-forest-700 underline underline-offset-4 font-medium text-sm transition-colors"
          >
            Create the first one
          </button>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="border border-sand-300/60 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 text-left">
                <th className="w-24 py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium"></th>
                <th className="py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium">Title</th>
                <th className="py-3 px-4 font-mono text-xs uppercase tracking-wider text-earth-600 font-medium hidden md:table-cell">Date</th>
                <th className="w-40 py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} className="border-b border-sand-200 last:border-b-0 hover:bg-sand-50/60">
                  <td className="py-3 px-4">
                    {post.thumbnailUrl ? (
                      <img
                        src={post.thumbnailUrl}
                        alt={post.thumbnailAlt || post.title}
                        className="w-16 h-12 object-cover bg-sand-200"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-sand-200 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-earth-600 uppercase">no img</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-serif text-sand-900">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-xs text-earth-600 mt-0.5 line-clamp-1 font-light">
                        {post.excerpt}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-earth-600 hidden md:table-cell">
                    {formatDate(post.date)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/news/${post._id}/edit`}
                      className="text-xs font-mono uppercase tracking-wider text-accent hover:text-forest-700 mr-4 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post._id}
                      className="text-xs font-mono uppercase tracking-wider text-red-700 hover:text-red-900 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === post._id ? 'Deleting…' : 'Delete'}
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
