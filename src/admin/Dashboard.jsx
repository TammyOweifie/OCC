import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from './api.js'

function SectionCard({ title, count, to, description }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between p-8 bg-white border border-sand-300/60 hover:border-accent/50 transition-colors min-h-[220px]"
    >
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-earth-600 block mb-3">
          {description}
        </span>
        <h2 className="font-serif text-3xl text-sand-900 mb-2 group-hover:text-forest-700 transition-colors">
          {title}
        </h2>
      </div>
      <div className="flex items-end justify-between mt-6">
        <span className="font-serif text-5xl text-sand-900 leading-none">
          {count == null ? '—' : count}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-accent group-hover:text-forest-700 transition-colors">
          Manage →
        </span>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [newsCount, setNewsCount] = useState(null)
  // Reports count is TODO (Reports admin comes in the next round)

  useEffect(() => {
    adminApi.listNews()
      .then(({ posts }) => setNewsCount(posts.length))
      .catch(() => setNewsCount(null))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent font-semibold mb-3">
        Content
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-sand-900 tracking-tight mb-12 font-normal">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="News"
          description="Stories & field notes"
          count={newsCount}
          to="/admin/news"
        />
        <SectionCard
          title="Reports"
          description="Progress reports & PDFs"
          count={null}
          to="/admin/reports"
        />
      </div>

      <p className="mt-10 text-xs font-mono text-earth-600">
        Reports admin is next — pattern will match News.
      </p>
    </div>
  )
}
