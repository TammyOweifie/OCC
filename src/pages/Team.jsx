// Team page
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import Seo from '../components/shared/Seo.jsx'
import { coreTeam, boardMembers } from '../data/team.js'

function Team() {
  return (
    <>
      <Seo
        title="Team"
        description="Meet the conservationists, researchers and community stewards behind the Obudu Conservation Centre's work on the Obudu Plateau."
      />
      {/* Page Heading */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-16 pb-14 text-center">
        <ScrollReveal>
          <p className="text-xs font-semibold text-accent tracking-eyebrow uppercase mb-3">
            Who We Are · Leadership &amp; Stewardship
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-sand-900 tracking-tight mb-5 leading-none font-normal">
            Our Team
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-earth-700 leading-relaxed font-light">
            The people behind OCC&apos;s work on the Obudu Plateau: dedicated conservationists, researchers, community liaisons, and field scientists.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="w-16 h-px bg-accent/35 mx-auto mt-10" />
        </ScrollReveal>
      </section>

      {/* Core Team */}
      <section aria-labelledby="core-team-heading" className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <ScrollReveal>
          <div className="border-b border-sand-300/60 pb-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <h2 id="core-team-heading" className="font-serif text-2xl md:text-3xl text-sand-900 font-normal">
                Core Team
              </h2>
              <p className="text-xs md:text-sm text-earth-600 uppercase tracking-wider mt-1">
                Field Leaders, Management &amp; Research Specialists
              </p>
            </div>
            <span className="text-xs text-earth-600 font-mono">
              {String(coreTeam.length).padStart(2, '0')} Members
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal
          stagger
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-16"
        >
          {coreTeam.map(member => (
            <Card
              key={member.name}
              imageAspect="aspect-[4/3]"
              image={member.photo}
              imageAlt={member.name}
            >
              <span className="text-xs uppercase tracking-eyebrow text-accent font-medium block mb-1">
                {member.role}
              </span>
              <h3 className="font-serif text-2xl text-sand-900 mb-3">
                {member.name}
              </h3>
              <p className="text-sm leading-relaxed text-earth-700 font-normal text-justify md:text-left">
                {member.bio}
              </p>
            </Card>
          ))}
        </ScrollReveal>
      </section>

      {/* Board */}
      <section aria-labelledby="board-heading" className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <ScrollReveal>
          <div className="border-b border-sand-300/60 pb-4 mb-10">
            <p className="text-xs font-semibold text-accent tracking-eyebrow uppercase mb-1">
              Governance &amp; Advisory
            </p>
            <h2 id="board-heading" className="font-serif text-2xl md:text-3xl text-sand-900 font-normal">
              Board
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal
          stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {boardMembers.map((member, i) => (
            <article
              key={member.name}
              className="p-8 border border-sand-300/60 bg-sand-100 flex flex-col justify-between hover:border-accent/40 transition-colors h-full"
            >
              <div>
                <div className="w-8 h-8 rounded-full border border-sand-300/60 bg-sand-50 flex items-center justify-center text-xs font-serif text-accent mb-6">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-xl text-sand-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-xs uppercase tracking-widest text-accent font-medium">
                  {member.title}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sand-300/60">
                <span className="text-[11px] text-earth-600 uppercase tracking-wider">
                  {member.focus}
                </span>
              </div>
            </article>
          ))}
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

export default Team
