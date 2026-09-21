// Expandable "read more/less" text toggle
import { useState } from 'react'

const DEFAULT_MAX_LENGTH = 240

function truncateAtWord(text, maxLength) {
  if (text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return cut.replace(/[.,;:!?\-–—]+$/, '')
}

function ReadMore({
  text = '',
  maxLength = DEFAULT_MAX_LENGTH,
  moreLabel = 'Read more',
  lessLabel = 'Show less',
  className = '',
}) {
  const [expanded, setExpanded] = useState(false)

  if (!text) return null

  const needsTruncation = text.length > maxLength

  if (!needsTruncation) {
    return <span className={className}>{text}</span>
  }

  const truncated = truncateAtWord(text, maxLength)
  const displayText = expanded ? text : `${truncated}...`

  return (
    <span className={className}>
      {displayText}{' '}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1 ml-1 text-accent hover:text-accent-dark font-medium underline underline-offset-4 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <span>{expanded ? lessLabel : moreLabel}</span>
        <svg
          aria-hidden="true"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </span>
  )
}

export default ReadMore
