// Reports page
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import { reports } from '../data/reports.js'

function DownloadLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm font-mono text-accent hover:text-sand-900 border-b border-accent hover:border-sand-900 pb-0.5 transition-colors group"
    >
      <span>Download</span>
      <svg
        className="w-4 h-4 ml-1.5 transform group-hover:translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M14 5l7 7m0 0l-7 7m7-7H3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </a>
  )
}

function Reports() {
  return (
    <>
      {/* Page Heading */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <ScrollReveal>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-sand-900 tracking-tight">
            Reports.
          </h1>
        </ScrollReveal>
      </section>

      {/* Report Entries */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pb-28">
        <div className="border-t border-sand-200 divide-y divide-sand-200">
          {reports.map((report, i) => (
            <ScrollReveal key={report.id} delay={i * 0.1}>
              <article className="py-12 sm:py-16">
                <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
                  {report.image && (
                    <div className="w-full md:w-56 lg:w-64 flex-shrink-0">
                      <div className="bg-sand-100 overflow-hidden border border-sand-200">
                        <img
                          src={report.image}
                          alt={report.imageAlt || ''}
                          className="w-full h-auto object-contain block"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4 text-earth-700 text-base sm:text-[17px] leading-relaxed font-sans font-normal">
                      <p>{report.body}</p>
                    </div>
                    {report.downloadUrl && (
                      <div className="pt-6 sm:pt-8 mt-2">
                        <DownloadLink href={report.downloadUrl} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
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
            <Button to="/donate">Support Our Research</Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

export default Reports
