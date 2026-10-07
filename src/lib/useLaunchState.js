// Owns the launch-gate state for the public app: one interval,
// one server-time correction, shared between App.jsx (which decides
// whether to show the countdown or the full site) and LaunchingSoon.jsx
// (which displays the remaining diff).
import { useEffect, useMemo, useState } from 'react'
import {
  computeLaunchState,
  fetchServerOffset,
  getLaunchDate,
  getLaunchMode,
  readPreviewOverrides,
} from './launch.js'

export function useLaunchState() {
  // All three are stable per mount: launch time + mode come from
  // build-time env, overrides from the URL at page load. useMemo makes
  // this explicit (useRef with .current access on render tripped the
  // react/refs lint).
  const overrides = useMemo(() => readPreviewOverrides(), [])
  const launchDate = useMemo(() => overrides.launchDate || getLaunchDate(), [overrides])
  const mode = useMemo(() => getLaunchMode(), [])
  const force = overrides.force
  const [offsetMs, setOffsetMs] = useState(0)
  const [snapshot, setSnapshot] = useState(() =>
    computeLaunchState({ launchDate, offsetMs: 0, mode, force })
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchServerOffset(controller.signal).then((offset) => {
      if (!controller.signal.aborted) setOffsetMs(offset)
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const tick = () =>
      setSnapshot(computeLaunchState({ launchDate, offsetMs, mode, force }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [launchDate, offsetMs, mode, force])

  return { state: snapshot.state, diffMs: snapshot.diffMs, launchDate }
}
