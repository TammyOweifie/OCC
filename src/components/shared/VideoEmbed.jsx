// Responsive embedded video player
const YOUTUBE_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/

function parseYouTube(input) {
  if (!input) return null
  if (YOUTUBE_ID.test(input)) return { id: input, start: null }

  try {
    const url = new URL(input)
    const host = url.hostname.replace(/^www\./, '')
    let id = null

    if (host === 'youtu.be') {
      id = url.pathname.slice(1).split('/')[0] || null
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        id = url.searchParams.get('v')
      } else {
        const match = url.pathname.match(
          /^\/(?:embed|shorts|v|live)\/([a-zA-Z0-9_-]{11})/
        )
        if (match) id = match[1]
      }
    }

    if (!id || !YOUTUBE_ID.test(id)) return null

    const t = url.searchParams.get('t') || url.searchParams.get('start')
    const start = t && /^\d+$/.test(t) ? Number(t) : null
    return { id, start }
  } catch {
    return null
  }
}

function VideoEmbed({ url, title = 'Video', className = '', ...rest }) {
  const parsed = parseYouTube(url)
  if (!parsed) return null

  const embedUrl = new URL(`https://www.youtube.com/embed/${parsed.id}`)
  if (parsed.start) embedUrl.searchParams.set('start', String(parsed.start))

  return (
    <div
      className={`relative w-full aspect-video bg-black/90 overflow-hidden shadow-sm ${className}`.trim()}
    >
      <iframe
        src={embedUrl.toString()}
        title={title}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow={YOUTUBE_ALLOW}
        allowFullScreen
        {...rest}
      />
    </div>
  )
}

export default VideoEmbed
