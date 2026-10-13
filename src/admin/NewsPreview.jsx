// Admin preview of the News page.
// --------------------------------
// Mirrors the public /news layout but shows every post regardless of
// publish state. Scheduled and draft posts get a banner so staff can
// proof them in the real card layout before go-time. Fetched through
// the authenticated /api/admin/news endpoint; this route is already
// behind ProtectedRoute in AdminApp.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from './api.js'
import Modal from '../components/shared/Modal.jsx'
import Card from '../components/ui/Card.jsx'

function formatMonthYear(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatWatFull(iso) {
  if (!iso) return ''
  const d = new Date(new Date(iso).getTime() + 60 * 60 * 1000)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getUTCDate())} ${d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} WAT`
}

function statusOf(post) {
  if (!post.publishedAt) return 'draft'
  return new Date(post.publishedAt).getTime() > Date.now() ? 'scheduled' : 'published'
}

function StatusBanner({ status, publishedAt }) {
  if (status === 'published') return null
  const colour =
    status === 'scheduled'
      ? 'bg-amber-100 text-amber-900 border-amber-200'
      : 'bg-sand-200 text-earth-800 border-sand-300'
  const label =
    status === 'scheduled'
      ? `SCHEDULED — publishes ${formatWatFull(publishedAt)}`
      : 'DRAFT — not visible to the public'
  return (
    <div className={`absolute top-0 left-0 right-0 z-10 border-b px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${colour}`}>
      {label}
    </div>
  )
}

export default function NewsPreview() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    adminApi.listNews()
      .then(({ posts }) => setPosts(posts))
      .catch(err => setError(err.message))
  }, [])

  const sorted = useMemo(() => {
    if (!posts) return []
    // Scheduled first, then drafts, then published (reverse-chronological
    // within each). Mirrors how staff think about what needs attention.
    const bucket = { scheduled: [], draft: [], published: [] }
    for (const p of posts) bucket[statusOf(p)].push(p)
    bucket.scheduled.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
    bucket.draft.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    bucket.published.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    return [...bucket.scheduled, ...bucket.draft, ...bucket.published]
  }, [posts])

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-3 flex items-center justify-between gap-4">
          <div className="font-mono text-xs uppercase tracking-wider text-amber-900">
            Admin preview — scheduled and draft posts are visible here only
          </div>
          <Link
            to="/admin/news"
            className="font-mono text-xs uppercase tracking-wider text-earth-700 hover:text-forest-700 transition-colors"
          >
            ← Back to news
          </Link>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-20 pb-12 sm:pb-16 bg-sand-50">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-sand-900 mb-6">
            News.
          </h1>
          <p className="text-earth-700 font-sans text-lg sm:text-xl leading-relaxed font-light">
            Stories, updates, and field notes from our work on the Obudu Plateau.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32 bg-sand-50">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-6">
            {error}
          </p>
        )}
        {posts === null && !error && (
          <div className="border-t border-sand-200 py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-earth-600">
              Loading…
            </span>
          </div>
        )}
        {posts && posts.length === 0 && (
          <div className="border-t border-sand-200 py-24 text-center">
            <p className="text-earth-700 font-light">No posts yet.</p>
          </div>
        )}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {sorted.map(post => {
              const status = statusOf(post)
              return (
                <div key={post._id} className="relative">
                  <StatusBanner status={status} publishedAt={post.publishedAt} />
                  <div className={status === 'published' ? '' : 'pt-7'}>
                    <Card
                      image={post.thumbnailUrl}
                      imageAlt={post.thumbnailAlt || post.title}
                      imageAspect="aspect-[3/2]"
                    >
                      <time
                        dateTime={post.date}
                        className="font-mono text-xs text-earth-600 tracking-wider uppercase mb-2"
                      >
                        {formatMonthYear(post.date || post.publishedAt)}
                      </time>
                      <h2 className="font-serif text-xl font-normal text-sand-900 leading-snug mb-3">
                        <button
                          type="button"
                          onClick={() => setSelected(post)}
                          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                          {post.title}
                        </button>
                      </h2>
                      <p className="font-sans text-sm text-earth-700 leading-relaxed line-clamp-3 mb-4 font-light flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSelected(post)}
                          className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-accent hover:text-forest-700 transition-colors"
                        >
                          Read more <span className="ml-1 text-sm leading-none">→</span>
                        </button>
                      </div>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        labelledBy="news-preview-modal-title"
      >
        {selected && (
          <PreviewArticle post={selected} />
        )}
      </Modal>
    </>
  )
}

function PreviewArticle({ post }) {
  const status = statusOf(post)
  return (
    <article>
      {status !== 'published' && (
        <StatusBanner status={status} publishedAt={post.publishedAt} />
      )}
      {post.thumbnailUrl && (
        <div className={`w-full aspect-[3/2] bg-sand-200 overflow-hidden ${status === 'published' ? '' : 'pt-7'}`}>
          <img
            src={post.thumbnailUrl}
            alt={post.thumbnailAlt || post.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      <div className="p-8 sm:p-10">
        <time
          dateTime={post.date}
          className="font-mono text-xs text-earth-600 tracking-wider uppercase block mb-3"
        >
          {formatMonthYear(post.date || post.publishedAt)}
        </time>
        <h2
          id="news-preview-modal-title"
          className="font-serif text-2xl sm:text-3xl font-normal text-sand-900 leading-tight mb-6 tracking-tight"
        >
          {post.title}
        </h2>
        <div className="space-y-4 text-earth-700 text-base leading-relaxed font-light">
          {post.excerpt && <p>{post.excerpt}</p>}
        </div>
      </div>
    </article>
  )
}
