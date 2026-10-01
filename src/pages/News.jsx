// News page
import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Modal from '../components/shared/Modal.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import { getNewsFromSanity } from '../data/getNewsFromSanity.js'
import { useSanityData } from '../lib/useSanityData.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function News() {
  const [selected, setSelected] = useState(null)
  const { data: news, loading } = useSanityData(getNewsFromSanity)

  return (
    <>
      {/* Page Heading */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <ScrollReveal>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-sand-900 mb-6">
              News.
            </h1>
            <p className="text-earth-700 font-sans text-lg sm:text-xl leading-relaxed font-light">
              Stories, updates, and field notes from our work on the Obudu Plateau.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Card Grid */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pb-24 sm:pb-32">
        {loading ? (
          <div className="border-t border-sand-200 py-24 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-earth-600">
              Loading…
            </span>
          </div>
        ) : news.length === 0 ? (
          <ScrollReveal>
            <div className="border-t border-sand-200 py-24 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-earth-600 block mb-3">
                Coming Soon
              </span>
              <p className="text-earth-700 font-light max-w-md mx-auto leading-relaxed">
                New stories, field notes, and community updates will appear here as they&apos;re released.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal
            stagger
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
          >
            {news.map(post => (
              <Card
                key={post.id}
                image={post.coverImage}
                imageAlt={post.coverAlt || post.title}
                imageAspect="aspect-[3/2]"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-earth-600 tracking-wider uppercase mb-2"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="font-serif text-xl font-normal text-sand-900 leading-snug mb-3 group-hover:text-forest-700 transition-colors">
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
                    Read more{' '}
                    <span className="ml-1 text-sm leading-none transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </div>
              </Card>
            ))}
          </ScrollReveal>
        )}
      </section>

      {/* News Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        labelledBy="news-modal-title"
      >
        {selected && (
          <article>
            {selected.coverImage && (
              <div className="w-full aspect-[3/2] bg-sand-200 overflow-hidden">
                <img
                  src={selected.coverImage}
                  alt={selected.coverAlt || selected.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}
            <div className="p-8 sm:p-10">
              <time
                dateTime={selected.date}
                className="font-mono text-xs text-earth-600 tracking-wider uppercase block mb-3"
              >
                {formatDate(selected.date)}
              </time>
              <h2
                id="news-modal-title"
                className="font-serif text-2xl sm:text-3xl font-normal text-sand-900 leading-tight mb-6 tracking-tight"
              >
                {selected.title}
              </h2>
              <div className="space-y-4 text-earth-700 text-base leading-relaxed font-light">
                {(selected.body && selected.body.length > 0
                  ? selected.body
                  : [selected.excerpt]
                ).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </article>
        )}
      </Modal>

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
    </>
  )
}

export default News
