// Catches any uncaught render error in the public app and shows a
// branded fallback instead of a white screen. Admin surface sits
// inside the same boundary via main.jsx.
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Logged to Vercel's function logs when a request bubbles up here;
    // on the client, visible in the browser console.
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50 px-6 py-20">
        <div className="max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow-wide text-accent font-medium mb-4">
            Something went wrong
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-900 leading-tight mb-5">
            We hit a snag loading this page.
          </h1>
          <p className="text-earth-700 text-base font-light leading-relaxed mb-8">
            Refreshing usually fixes it. If it keeps happening, please let us know.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-block px-10 py-4 text-xs uppercase tracking-eyebrow font-medium bg-forest-800 text-sand-50 hover:bg-accent transition-colors"
          >
            Refresh page
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
