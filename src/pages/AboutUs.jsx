// About Us page
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ReadMore from '../components/ui/ReadMore.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'

const woodlotText =
  "The Women's Woodlot Reserve Initiative is OCC's flagship program which was launched in 2017 with the aim of preserving the Aeroplane Field forest and the natural spring grotto on the plateau which unfortunately, have witnessed degradation and vulnerability attributable to activities such as deforestation, pollution, bush burning and cattle grazing. With the collaborative efforts of the community volunteers and OCC staff, in March 2020, OCC completed phase 1 of the initiative which involved clearing the essential section of the reserve area and conducting fire tracing to prevent bush fires. In August 2020, OCC progressed into phase 2 of the initiative, the reforestation phase. This phase entails creating a man-made forest on the plateau by planting fast-growing indigenous trees. A total of 2,500 seedlings were planted in the reserve in 2020. Today we have planted over 50,000 seedlings with the support of the women in the community."

const pillars = [
  {
    number: '01',
    name: 'Research',
    body: "With the goal of becoming a renowned research hub for biodiversity conservation in Africa, OCC actively seeks partnerships with universities, institutions, and conservation organisations to track, monitor, and research the region's biodiversity supporting preservation and restoration.",
  },
  {
    number: '02',
    name: 'Education',
    body: 'Education is at the forefront of our agenda. To educate this generation on the importance of conservation is to safeguard the next. As an education centre, OCC develops a new generation of environmentalists through advocacy and educational camps.',
  },
  {
    number: '03',
    name: 'Ecotourism',
    body: 'The sale of local produce to tourists is a strong component of the economic well-being of communities on the plateau. OCC promotes ecotourism in the region, creating awareness among visitors and building a market that benefits local communities.',
  },
  {
    number: '04',
    name: 'Community',
    body: 'The residents of the communities on the plateau are the gatekeepers of biodiversity. OCC operates as a community outreach centre, supporting local communities through education and empowerment programmes.',
  },
]

function AboutUs() {
  return (
    <>
      {/* Hero */}
      <section
        aria-label="Scenic Vista of Obudu Plateau"
        className="w-full relative overflow-hidden bg-sand-900"
      >
        <div className="w-full h-[480px] lg:h-[540px] relative">
          <img
            src="/assets/images/home/bg-hero1.jpg"
            alt="Rolling green hills and cloud-draped montane landscape of the Obudu Plateau"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="absolute bottom-4 right-6 text-right text-[11px] uppercase tracking-widest text-sand-50/80 font-mono drop-shadow">
            Obudu Plateau, Nigeria · 6.6417° N, 9.3667° E
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16 pointer-events-none">
            <div className="max-w-4xl">
              <ScrollReveal>
                <span className="text-xs uppercase tracking-eyebrow font-semibold text-sand-50/80 block mb-2 drop-shadow">
                  Obudu Conservation Centre
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-serif text-sand-50 tracking-tight drop-shadow font-normal">
                  About Us
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section aria-label="Mission and Vision" className="w-full py-24 bg-sand-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal>
            <div className="mb-14">
              <span className="text-xs uppercase tracking-eyebrow font-semibold text-accent block">
                Our Purpose &amp; Aspiration
              </span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <ScrollReveal>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-serif text-sand-900 tracking-tight font-normal">
                  Mission
                </h2>
                <p className="text-lg text-earth-700 leading-relaxed font-light">
                  To protect, restore and increase awareness of the wildlife and wildlands on Obudu Plateau and the surrounding Cross River National Park and Cameroon&apos;s Takamanda National Park. We aim to generate healthier economic opportunities for local communities and promote care of our natural world.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="space-y-4 md:border-l md:border-sand-200 md:pl-12 lg:pl-16">
                <h2 className="text-3xl sm:text-4xl font-serif text-sand-900 tracking-tight font-normal">
                  Vision
                </h2>
                <p className="text-lg text-earth-700 leading-relaxed font-light">
                  To create and live in a world that understands human dominance is not to control and destroy but to utilise and grow with a generation who will one day join the fight against animal cruelty, depletion of our natural resources and the destruction of our planet.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section
        aria-label="Foundational Principles"
        className="w-full py-24 border-t border-sand-200 bg-sand-50"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal>
            <SectionHeading eyebrow="Foundational Principles" className="mb-16">
              OCC&apos;s Pillars
            </SectionHeading>
          </ScrollReveal>
          <ScrollReveal
            stagger
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-sand-200 divide-y md:divide-y-0 md:divide-x divide-sand-200"
          >
            {pillars.map((pillar, i) => (
              <article
                key={pillar.number}
                className={`py-10 md:px-6 lg:px-8 flex flex-col justify-start ${
                  i === 0 ? 'md:pl-0' : ''
                } ${i === pillars.length - 1 ? 'md:pr-0' : ''}`}
              >
                <div className="text-xs font-mono font-medium text-accent mb-4">
                  {pillar.number}
                </div>
                <h3 className="text-2xl font-serif text-sand-900 mb-4 font-normal">
                  {pillar.name}
                </h3>
                <p className="text-sm text-earth-700 leading-relaxed">
                  {pillar.body}
                </p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Flagship Program — Women's Woodlot Reserve */}
      <section
        aria-label="Women's Woodlot Reserve Initiative"
        className="w-full py-24 bg-sand-100 border-t border-sand-200"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <span className="text-xs uppercase tracking-eyebrow font-semibold text-accent block">
                  Flagship Initiative · Established 2017
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-sand-900 tracking-tight leading-tight font-normal">
                  OCC&apos;s Women&apos;s Woodlot Reserve
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <blockquote className="font-serif italic text-xl text-sand-900 border-l-2 border-accent pl-4 py-1 leading-snug">
                  &ldquo;The best time to plant a tree was 20 years ago. The second best time is now.&rdquo;
                </blockquote>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <p className="text-earth-700 text-base leading-relaxed font-light">
                  <ReadMore text={woodlotText} maxLength={380} />
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-3 bg-sand-900/5 border border-sand-300/60 px-4 py-3">
                    <div className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0" />
                    <div>
                      <span className="text-sm font-semibold tracking-wide text-sand-900 block font-sans">
                        50,000+ Native Seedlings Planted
                      </span>
                      <span className="text-xs text-earth-700 block">
                        Community-led stewardship protecting critical natural spring catchments
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Feature Image */}
            <ScrollReveal delay={0.2} className="lg:col-span-6">
              <figure className="relative m-0 bg-sand-50 border border-sand-300/60 p-2 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-sand-200">
                  <img
                    src="/assets/images/home/bg-hero.png"
                    alt="Water cascading down moss-covered rocks at the natural spring grotto on the Obudu Plateau"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-earth-600 text-xs tracking-wider uppercase font-sans text-right py-1">
                  Aeroplane Field Forest &amp; Natural Spring Grotto, Obudu Plateau
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
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

export default AboutUs
