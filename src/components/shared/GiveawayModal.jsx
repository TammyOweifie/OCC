// 25th-anniversary giveaway modal.
// -----------------------------------
// Shows on the first visit to any public page, then stays dismissed for
// DISMISSAL_DAYS so repeat visitors aren't nagged. Hidden entirely during
// the launch-gate countdown (mounted after the gate in App.jsx), on the
// admin surface, and after DISMISSAL_DAYS.
import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'

const STORAGE_KEY = 'occ-giveaway-500k-dismissed-at'
const DISMISSAL_DAYS = 7
const OPEN_DELAY_MS = 1500 // let the page settle before interrupting
const FORM_URL =
  'https://docs.google.com/forms/d/1YBSpS1oM8R-shbu4kgkwu1gh1Jbj41khrJFlp3OGhpc/viewform?edit_requested=true'

function wasDismissedRecently() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return false
    const ageDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
    return ageDays < DISMISSAL_DAYS
  } catch {
    return false
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    /* storage unavailable (private window, blocked) — accept and move on */
  }
}

function GiveawayModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (wasDismissedRecently()) return
    const timer = setTimeout(() => setIsOpen(true), OPEN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    setIsOpen(false)
    rememberDismissal()
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
      <picture>
        <source
          srcSet="/assets/giveaway/giveaway-500k-naira.webp"
          type="image/webp"
        />
        <img
          src="/assets/giveaway/giveaway-500k-naira.png"
          alt="OCC giveaway — two lucky winners will receive 500,000 Naira each. Follow, tag two friends, share this post. The winner will be announced shortly after."
          className="w-full h-auto block"
        />
      </picture>
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
