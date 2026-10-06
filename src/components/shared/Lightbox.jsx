// Accessible image lightbox
// -------------------------
// Renders into document.body via a portal so it always sits above the page
// chrome. Locks background scroll while open, traps Tab focus inside the
// dialog, and returns focus to the trigger element on close.
//
// Props:
//   images         — array of { id, src, alt }; images without a src are
//                    still valid entries but display a neutral placeholder
//                    (kept consistent with the grid's placeholder frame).
//   index          — the currently visible image index.
//   onClose        — callback to close the lightbox.
//   onPrev, onNext — optional; if provided, prev/next controls render and
//                    Left/Right arrow keys navigate. Omit for single-image
//                    lightboxes.
//   labelledBy     — optional id of an element outside the lightbox to label
//                    the dialog. Falls back to the alt text of the current
//                    image.

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function Lightbox({ images, index, onClose, onPrev, onNext, labelledBy }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)
  const previouslyFocused = useRef(null)

  const current = images[index]
  const hasPrev = typeof onPrev === 'function' && images.length > 1
  const hasNext = typeof onNext === 'function' && images.length > 1

  // Lock body scroll while open; restore on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the close button on open for keyboard users.
    closeBtnRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      // Restore focus to whatever opened the lightbox.
      if (previouslyFocused.current && typeof previouslyFocused.current.focus === 'function') {
        previouslyFocused.current.focus()
      }
    }
  }, [])

  // Keyboard handling: Escape closes; arrows navigate.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  // Simple focus trap: cycle Tab between the visible control buttons.
  const trapTab = useCallback((e) => {
    if (e.key !== 'Tab') return
    const controls = [prevBtnRef.current, closeBtnRef.current, nextBtnRef.current].filter(Boolean)
    if (controls.length === 0) return
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  // Backdrop click closes; clicks that originate inside the image do not bubble here.
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!current) return null

  const label = labelledBy ? { 'aria-labelledby': labelledBy } : { 'aria-label': current.alt || 'Image' }

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      {...label}
      onClick={onBackdropClick}
      onKeyDown={trapTab}
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-6 sm:p-10"
    >
      {/* Close */}
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-sand-50 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50/60 p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          ref={prevBtnRef}
          type="button"
          aria-label="Previous image"
          onClick={onPrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-sand-50 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50/60 p-2"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          ref={nextBtnRef}
          type="button"
          aria-label="Next image"
          onClick={onNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-sand-50 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-50/60 p-2"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image — clicking the image itself must NOT close the lightbox */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh]"
      >
        {current.src ? (
          <img
            src={current.src}
            alt={current.alt || ''}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
        ) : (
          <div className="w-[80vw] max-w-3xl aspect-[4/3] bg-sand-200 border border-sand-300/60 flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-earth-600">
              Placeholder
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Lightbox
