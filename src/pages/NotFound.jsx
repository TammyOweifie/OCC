// 404 page — catch-all route for unknown URLs.
import Button from '../components/ui/Button.jsx'
import Seo from '../components/shared/Seo.jsx'

function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for isn't here."
        noIndex
      />
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow-wide text-accent font-medium mb-4">
            Error 404
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-sand-900 leading-tight mb-6">
            This page isn't here.
          </h1>
          <p className="text-earth-700 text-base sm:text-lg font-light leading-relaxed mb-10">
            The link may be out of date, or the page may have moved. Head back to the main site to find your way.
          </p>
          <Button to="/">Back to home</Button>
        </div>
      </section>
    </>
  )
}

export default NotFound
