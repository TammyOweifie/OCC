// useSanityData — tiny hook that drives a one-off fetch on mount and
// returns { data, loading, error }. Used by public pages (News,
// Reports, Gallery) to pull their content from Sanity instead of
// static files.
//
// Design choices:
// - On Sanity failure we fall back to data: [] so pages show their
//   empty state instead of an error UI. The actual error is logged to
//   the console for debugging.
// - `fetcher` is treated as mount-only (not re-invoked on identity
//   changes) — simplest cache behaviour for a static site.
import { useEffect, useState } from 'react'

export function useSanityData(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    fetcher()
      .then(data => {
        if (!alive) return
        setState({ data: data ?? [], loading: false, error: null })
      })
      .catch(error => {
        if (!alive) return
        // Public pages treat a Sanity failure as "nothing to show"
        // rather than showing visitors an error. Log for debugging.
        console.error('[useSanityData]', error)
        setState({ data: [], loading: false, error })
      })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
