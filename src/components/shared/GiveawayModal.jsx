// 25th-anniversary giveaway modal.
// -----------------------------------
// Opens on every page load (no per-browser dismissal memory) after a
// short delay so the page can settle first. Image is inlined via Vite's
// ?inline so the modal renders immediately with no network fetch.
import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import giveawayImage from '../../assets/giveaway-500k-naira.webp?inline'

const OPEN_DELAY_MS = 1500 // let the page settle before interrupting
const FORM_URL =
  'https://docs.google.com/forms/d/1YBSpS1oM8R-shbu4kgkwu1gh1Jbj41khrJFlp3OGhpc/viewform?edit_requested=true'

function GiveawayModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), OPEN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    setIsOpen(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      labelledBy="giveaway-modal-title"
      className="max-w-xl bg-sand-50"
    >
      <h2 id="giveaway-modal-title" className="sr-only">
        OCC Giveaway — two winners of ₦500,000 each
      </h2>
      <img
        src={giveawayImage}
        alt="OCC giveaway — two lucky winners will receive 500,000 Naira each. Follow, tag two friends, share this post. The winner will be announced shortly after."
        className="w-full h-auto block"
      />
      <div className="p-6 sm:p-8 text-center bg-sand-50">
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className="inline-block px-10 py-4 text-xs uppercase tracking-eyebrow font-medium bg-forest-800 text-sand-50 hover:bg-accent transition-colors"
        >
          Enter the Giveaway
        </a>
        <button
          type="button"
          onClick={close}
          className="block mx-auto mt-5 text-xs font-mono uppercase tracking-widest text-earth-600 hover:text-forest-700 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </Modal>
  )
}

export default GiveawayModal
