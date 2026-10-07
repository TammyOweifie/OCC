// Donate page
import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ScrollReveal from '../components/shared/ScrollReveal.jsx'
import Seo from '../components/shared/Seo.jsx'

const BANK_CARD_ID = 'bank-transfer-card'

function CopyButton({ value, variant = 'primary', label = 'Copy Number' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className={`text-xs font-mono underline underline-offset-2 transition-colors ${
          copied
            ? 'text-sand-900 font-bold no-underline'
            : 'text-accent hover:text-sand-900'
        }`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className={`self-start sm:self-center px-4 py-2 border text-xs font-mono font-medium uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-sm ${
        copied
          ? 'bg-sand-100 text-accent border-accent'
          : 'border-sand-300/70 hover:border-earth-600 bg-sand-50 text-earth-700'
      }`}
    >
      <svg
        className={`w-3.5 h-3.5 ${copied ? 'text-accent' : 'text-earth-600'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  )
}

function scrollToBankCard(e) {
  e.preventDefault()
  document
    .getElementById(BANK_CARD_ID)
    ?.scrollIntoView({ behavior: 'smooth' })
}

function ExpandableText({ firstParagraph, additionalParagraphs = [] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <p>{firstParagraph}</p>
      {expanded && additionalParagraphs.map((text, i) => <p key={i}>{text}</p>)}
      <p>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1 text-accent hover:text-accent-dark font-medium underline underline-offset-4 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-accent text-base"
        >
          <span>{expanded ? 'Show less' : 'Read more'}</span>
          <svg
            aria-hidden="true"
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </p>
    </>
  )
}

function Donate() {
  return (
    <>
      <Seo
        title="Donate"
        description="Support the Obudu Conservation Centre's work protecting wildlife, training community patrol teams and sustaining environmental education across the Obudu region."
      />
      {/* Hero & Introduction */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-20 pb-16 text-left">
        <ScrollReveal>
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
              Direct Conservation Support · Tax-Exempt NGO
            </span>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-sand-900 leading-[1.15] mb-8">
            Support research and community development for nature.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="text-earth-700 text-lg sm:text-xl font-normal leading-relaxed space-y-5">
            <ExpandableText
              firstParagraph="We are a group of researchers, conservationists, and volunteers who have committed our lives to nature and wildlife conservation. As a community of conservationists and specialists, we've directed our energy toward changing the behaviour of communities who have lived alongside nature for generations."
              additionalParagraphs={[
                "We also believe that the gaps are not in literature but in people, ecosystems and wildlife people interact with on a daily basis. That's the journey we've set out on: to help communities become more than just instruments of conservation. To support our work on the Obudu Plateau and in Cross River State, Nigeria, please donate to our account below, and help us achieve this.",
              ]}
            />
          </div>
        </ScrollReveal>
      </section>

      {/* Bank Transfer Details Card */}
      <section
        id={BANK_CARD_ID}
        className="max-w-4xl mx-auto px-6 sm:px-8 pb-24 scroll-mt-24"
      >
        <div className="bg-white border border-sand-300/60 shadow-sm">
            {/* Panel Header */}
            <div className="px-8 sm:px-10 pt-10 pb-6 border-b border-sand-200">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-sand-900 tracking-tight">
                Donate via Bank Transfer
              </h2>
              <p className="text-earth-600 text-sm mt-1.5 font-normal">
                Direct deposit and wire transfer specifications for domestic (NGN) and international currencies
              </p>
            </div>

            {/* Domestic (Nigeria) Section */}
            <div className="p-8 sm:p-10 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200/70">
                <span className="text-xs uppercase font-mono tracking-widest text-earth-600 font-medium">
                  Domestic Accounts (Nigeria)
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-earth-700 bg-sand-100">
                  Official Beneficiary
                </span>
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Bank Name</dt>
                  <dd className="text-sand-900 font-medium text-base">United Bank for Africa (UBA)</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Account Name</dt>
                  <dd className="text-sand-900 font-medium text-base">Obudu Conservation Educational Centre</dd>
                </div>

                <div className="space-y-1 md:col-span-2 bg-sand-50 p-4 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">NUBAN Account Number</dt>
                    <dd className="font-mono text-2xl font-bold tracking-wider text-sand-900 mt-0.5">
                      3003029762
                    </dd>
                  </div>
                  <CopyButton value="3003029762" label="Copy Number" />
                </div>

                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Swift / BIC Code</dt>
                  <dd className="flex items-center space-x-3 mt-1">
                    <span className="font-mono text-base font-semibold text-sand-900">UNAFNGLA</span>
                    <CopyButton value="UNAFNGLA" variant="inline" label="Swift Code" />
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Bank Address</dt>
                  <dd className="text-earth-700 font-normal leading-relaxed">
                    United Bank for Africa, 12 Calabar Road, Calabar, Cross River State, Nigeria
                  </dd>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Beneficiary Address</dt>
                  <dd className="text-earth-700 font-normal leading-relaxed">
                    1D Oba Elegushi Road, Ikoyi, Lagos, Nigeria
                  </dd>
                </div>
              </dl>
            </div>

            {/* International / Correspondent Bank Sub-panel */}
            <div className="bg-sand-50/75 border-t border-sand-200 p-8 sm:p-10">
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-widest font-mono text-earth-700 font-semibold">
                  International / Wire Transfers (Correspondent Bank)
                </h3>
                <p className="text-xs text-earth-600 mt-1 font-normal">
                  For foreign currency wire transfers routed through international clearing systems.
                </p>
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Correspondent Bank</dt>
                  <dd className="text-sand-900 font-medium">Citibank New York, United States</dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Correspondent Bank Address</dt>
                  <dd className="text-earth-700 text-xs sm:text-sm font-normal">
                    Citibank NA, 399 Park Avenue, New York, NY 10043, USA
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">SWIFT Code / IRC</dt>
                  <dd className="flex items-center space-x-3 mt-1">
                    <span className="font-mono text-sm font-semibold text-sand-900">021000089</span>
                    <CopyButton value="021000089" variant="inline" label="International Swift" />
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-mono text-xs uppercase tracking-wider text-earth-600">Correspondent Account #</dt>
                  <dd className="flex items-center space-x-3 mt-1">
                    <span className="font-mono text-sm font-semibold text-sand-900">36320321</span>
                    <CopyButton value="36320321" variant="inline" label="International Account Number" />
                  </dd>
                </div>
              </dl>
            </div>

            {/* Donor Notice */}
            <div className="p-6 sm:p-8 bg-sand-100/60 border-t border-sand-200">
              <p className="text-xs sm:text-sm text-earth-700 leading-relaxed">
                <span className="font-semibold text-sand-900">Donor Notice:</span>{' '}
                Please include your name or organization in the payment reference field. For donation receipts, tax documentation, or corporate sponsorship inquiries, kindly notify our team at{' '}
                <a
                  href="mailto:info@obuduconservation.org"
                  className="text-accent underline hover:text-accent-dark font-medium transition-colors"
                >
                  info@obuduconservation.org
                </a>{' '}
                with your transaction details.
              </p>
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
            <Button href={`#${BANK_CARD_ID}`} onClick={scrollToBankCard}>
              View Wire Details
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

export default Donate
