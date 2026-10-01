// Gallery page
import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import Lightbox from '../components/shared/Lightbox.jsx'
import { getGalleryFromSanity } from '../data/getGalleryFromSanity.js'
import { useSanityData } from '../lib/useSanityData.js'

function Gallery() {
  const { data: images, loading } = useSanityData(getGalleryFromSanity)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openAt = (i) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setLightboxIndex((i) => (i + 1) % images.length)

  return (
    <>
      {/* Page Heading */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="max-w-3xl">
            <SectionHeading eyebrow="Photographs">Gallery</SectionHeading>
            <p className="text-earth-700 font-sans text-lg sm:text-xl leading-relaxed font-light mt-4">
              A visual record of life and work on the Obudu Plateau — landscapes, wildlife, and the community at the heart of our conservation efforts.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Photo Grid */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32">
        {loading ? (
          <div className="border-t border-sand-200 py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-earth-600">
              Loading…
            </span>
          </div>
        ) : images.length === 0 ? (
          <ScrollReveal>
            <div className="border-t border-sand-200 py-24 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-earth-600 block mb-3">
                Coming Soon
              </span>
              <p className="text-earth-700 font-light max-w-md mx-auto leading-relaxed">
                Photos coming soon.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal
            stagger={0.06}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => openAt(i)}
                aria-label={img.alt || `Open image ${i + 1}`}
                className="group block w-full aspect-[4/3] bg-sand-200 border border-sand-300/60 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {img.src ? (
                  <img
                    src={img.src}
                    alt={img.alt || ''}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="w-full h-full flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-earth-600"
                  >
                    Placeholder
                  </span>
                )}
              </button>
            ))}
          </ScrollReveal>
        )}
      </section>

      {/* Closing CTA */}
      <section className="py-24 lg:py-32 bg-sand-50 text-center border-t border-sand-200/70">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <SectionHeading align="center" eyebrow="Join Our Conservation Effort">
              Stand With the Plateau
            </SectionHeading>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-earth-700 text-base sm:text-lg leading-relaxed font-light mb-10">
              Your support directly protects endangered wildlife, trains community patrol teams, and sustains grassroots environmental education across the Obudu region and Cross River National Park.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Button to="/donate">Donate to OCC</Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}

export default Gallery
