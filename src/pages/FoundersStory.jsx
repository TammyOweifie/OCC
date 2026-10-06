// Founder's Story page
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import { getFounderStory } from '../data/founderStory.js'

function Portrait({ portrait }) {
  if (portrait.src) {
    return (
      <div className="bg-sand-200 border border-sand-300/60 aspect-[4/3] overflow-hidden">
        <img
          src={portrait.src}
          alt={portrait.alt || ''}
          className="w-full h-full object-cover object-center"
        />
      </div>
    )
  }
  return (
    <div
      className="bg-sand-200 border border-sand-300/60 aspect-[4/3] flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-earth-600">
        Portrait placeholder
      </span>
    </div>
  )
}

function StorySection({ section }) {
  return (
    <ScrollReveal>
      <div className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl text-sand-900 tracking-tight font-normal">
          {section.heading}
        </h2>
        {section.paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-earth-700 text-base sm:text-lg leading-relaxed font-light"
          >
            {para}
          </p>
        ))}
        {section.list && (
          <dl className="space-y-5 pt-2">
            {section.list.map(({ term, body }) => (
              <div key={term}>
                <dt className="font-serif text-lg text-sand-900 font-medium">
                  {term}.
                </dt>
                <dd className="text-earth-700 text-base sm:text-lg leading-relaxed font-light mt-1">
                  {body}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </ScrollReveal>
  )
}

function FoundersStory() {
  const story = getFounderStory()
  const { meta, opening, sections, closing } = story

  return (
    <>
      {/* Page Heading */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 sm:pt-20 pb-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-sand-900 mb-4">
              {meta.pageTitle}
            </h1>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-earth-600">
              {meta.name}, {meta.role}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Opening: lead paragraph, then portrait below.
          Both constrained to the same max-width and centered as one
          column so the image matches the paragraph's width. */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p className="text-earth-700 text-lg sm:text-xl leading-relaxed font-light mb-10 sm:mb-14">
              {opening}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Portrait portrait={meta.portrait} />
          </ScrollReveal>
        </div>
      </section>

      {/* Story sections in a comfortable reading column */}
      <section className="max-w-[68ch] mx-auto px-6 pb-16 sm:pb-24">
        <div className="space-y-14 sm:space-y-16">
          {sections.map((section, i) => (
            <StorySection key={i} section={section} />
          ))}
        </div>
      </section>

      {/* Closing pull-quote */}
      <section className="max-w-[70ch] mx-auto px-6 pb-24 sm:pb-32">
        <ScrollReveal>
          <blockquote className="text-accent font-serif text-xl sm:text-2xl leading-relaxed text-center">
            {closing}
          </blockquote>
        </ScrollReveal>
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
    </>
  )
}

export default FoundersStory
