// Rotating hero image/slide carousel
import { useState, useEffect, useRef } from 'react'

function HeroCarousel({
  slides = [],
  autoAdvanceMs = 6000,
  className = '',
  children,
}) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (slides.length <= 1 || autoAdvanceMs <= 0) return
    const prefersReduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduce) return

    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, autoAdvanceMs)
    return () => clearTimeout(timerRef.current)
  }, [current, slides.length, autoAdvanceMs])

  if (slides.length === 0) return null

  const wrapperClasses =
    `relative w-full overflow-hidden bg-sand-900 h-screen ${className}`.trim()

  return (
    <section className={wrapperClasses}>
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-crossfade motion-reduce:transition-none ${
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== current}
          >
            <img
              src={slide.src}
              alt={slide.alt || ''}
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 pointer-events-none" />

      <div className="relative z-10 h-full max-w-5xl mx-auto px-6 lg:px-12 py-12 sm:py-16 lg:py-20 flex flex-col justify-center text-center items-center">
        {children}

        {slides.length > 1 && (
          <div className="flex items-center space-x-3 mt-12">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === current || undefined}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  i === current
                    ? 'bg-sand-50'
                    : 'bg-sand-50/40 hover:bg-sand-50/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroCarousel
