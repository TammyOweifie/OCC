// Home page
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import HeroCarousel from '../components/shared/HeroCarousel.jsx'
import PartnerMarquee from '../components/shared/PartnerMarquee.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import VideoEmbed from '../components/shared/VideoEmbed.jsx'
import Seo from '../components/shared/Seo.jsx'
import { partners } from '../data/partners.js'

const heroSlides = [
  { src: '/assets/images/home/bg-hero.jpg', alt: 'The Grotto, Obudu Plateau' },
  { src: '/assets/images/home/bg-hero2.jpg', alt: 'Obudu Mountain Ranges' },
  { src: '/assets/images/home/bg-hero1.jpg', alt: 'Obudu Valley and Forests' },
  { src: '/assets/images/home/bg-hero3.jpg', alt: 'Obudu Plateau landscape' },
  { src: '/assets/images/home/bg-hero4.jpg', alt: 'Obudu Plateau landscape' },
  { src: '/assets/images/home/bg-hero5.jpg', alt: 'Obudu Plateau landscape' },
]

function Home() {
  return (
    <>
      <Seo
        description="Obudu Conservation Centre protects the wildlife and wild lands of the Obudu Plateau and Cross River National Park. Supporting biodiversity research, community conservation and education in Nigeria since 2002."
      />
      {/* Hero */}
      <section id="home">
        <HeroCarousel slides={heroSlides}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-hero-eyebrow text-sand-200/90 mb-4 font-medium">
              Protecting Wildlife &amp; Wild Lands Since 2002
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-sand-50 mb-6 uppercase">
              PROTECT. EDUCATE. RESTORE.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="max-w-2xl text-base sm:text-lg text-sand-100/90 font-light leading-relaxed mb-8">
              Founded in 2002, Obudu Conservation Centre (OCC) is an NGO dedicated to protecting, educating and restoring the wildlife and wild lands in the Obudu region and the surrounding Cross River National Park. The Centre is situated amidst several mountain ranges, hundreds of acres of forests, meadows, streams and spectacular rock formations.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Button to="/donate">Donate to OCC</Button>
          </ScrollReveal>
        </HeroCarousel>
      </section>

      {/* Who We Are */}
      <section id="who-we-are" className="py-28 lg:py-36 border-b border-sand-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <ScrollReveal delay={0.2} className="lg:col-span-6">
              <div className="relative overflow-hidden bg-sand-200">
                <img
                  src="/assets/images/home/who-we-are.jpg"
                  alt="Youth and Community in Obudu"
                  className="w-full h-[520px] object-cover object-center filter grayscale-[15%] contrast-[1.03]"
                />
              </div>
            </ScrollReveal>

            <div className="lg:col-span-6 lg:pl-6">
              <ScrollReveal>
                <SectionHeading eyebrow="Our Mission & Purpose">
                  Who We Are
                </SectionHeading>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="space-y-5 text-earth-700 text-base sm:text-lg leading-relaxed font-light mb-10">
                  <p>
                    We work at the intersection of biodiversity conservation, community engagement, environmental education and sustainable livelihoods, recognising that lasting conservation depends on both healthy ecosystems and thriving communities. We believe local people should be active partners in understanding, protecting and managing the natural resources on which their lives depend.
                  </p>
                  <p>
                    We are committed to safeguarding the unique natural heritage of the Obudu Plateau region and the surrounding landscape for generations to come.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="pt-2 border-t border-sand-200/70">
                  <span className="text-[11px] tracking-footnote text-earth-600 font-semibold block mt-6 mb-4 uppercase">
                    The organisation addresses several Sustainable Development Goal(s) including SDG 3, SDG 5, SDG 6, SDG 8, and SDG 15.
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-sand-100/60 border-b border-sand-200/80 overflow-hidden">
        <ScrollReveal className="max-w-7xl mx-auto px-6 lg:px-12 mb-8 text-center">
          <span className="text-xs uppercase tracking-eyebrow-wide text-earth-600 font-medium">
            Our Partners
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PartnerMarquee partners={partners} />
        </ScrollReveal>
      </section>

      {/* Education & Community */}
      <section id="education" className="py-28 lg:py-36 bg-sand-100/80 border-b border-sand-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <SectionHeading eyebrow="Community-Led Conservation">
              Education and Community
            </SectionHeading>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-earth-700 text-base sm:text-lg leading-relaxed font-light">
              For over 2 decades, Obudu Conservation Centre has worked alongside the communities of the Obudu Plateau, not as an outside presence managing the land, but as a partner in it. Since our founding in 2002, we've held to one belief: lasting conservation is built with the people who have always called this forest home, not done to the landscape around them.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <ScrollReveal delay={0.2}>
              <div className="overflow-hidden bg-sand-200 border border-sand-200 shadow-sm">
                <img
                  src="/assets/images/home/community1.jpg"
                  alt="Fostering Local Support for the Conservation of Preuss's Monkey"
                  className="w-full h-80 sm:h-96 object-cover object-center filter grayscale-[10%]"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="overflow-hidden bg-sand-200 border border-sand-200 shadow-sm">
                <img
                  src="/assets/images/home/community2.jpg"
                  alt="Plateau Youth Environmental Education Walk"
                  className="w-full h-80 sm:h-96 object-cover object-center filter grayscale-[10%]"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ScrollReveal delay={0.2}>
              <h3 className="font-serif text-xl sm:text-2xl text-sand-900 mb-4 pb-2 border-b border-sand-300/80">
                Community
              </h3>
              <VideoEmbed url="https://youtu.be/10YqOaGmWRQ" title="Community" />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <h3 className="font-serif text-xl sm:text-2xl text-sand-900 mb-4 pb-2 border-b border-sand-300/80">
                Education
              </h3>
              <VideoEmbed url="https://youtu.be/G_dfC6hJltE" title="Education" />
            </ScrollReveal>
          </div>

          <div className="mt-12 space-y-5 text-earth-700 text-base sm:text-lg leading-relaxed font-light">
            <ScrollReveal delay={0.2}>
              <p>
                Education and community are the two pillars behind that work. We raise awareness of what's at stake ecologically, while learning from generations of local knowledge in return. And we recognise communities not as beneficiaries of conservation, but as its true custodians, the forests have survived because the people living alongside them have protected them, often long before conservation had a name.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p>
                Over two decades on this remains our foundation: strengthening that relationship, and empowering the people who are already the forest's best guardians.              </p>
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

export default Home
