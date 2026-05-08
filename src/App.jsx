import { useState, useEffect, useRef, useCallback } from 'react'
import GenerativeCanvas from './components/GenerativeCanvas.jsx'
import ActLabel from './components/ActLabel.jsx'
import IncidentCounter from './components/IncidentCounter.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import About from './components/About.jsx'
import StaticSummary from './components/StaticSummary.jsx'
import { FBI_YEARS } from './data/fbiData.js'
import { SAH_YEARS } from './data/sahData.js'
import styles from './App.module.css'

const PROGRESS_COLORS = { fbi: '#B87020', sah: '#3E6A9E' }

// Phase state machine:
// 'start' → (key) → 'fbi' → (complete) → 'paused' → (key) → 'sah' → (complete) → 'done' → (key) → 'fbi'
//
// Transitions:
// gate→canvas : text fades out (2s) · 1s pause · overlay fades out (2s)
// canvas→gate : 1s pause · overlay fades in (2s) · gate text fades in (2s)

export default function App() {
  const [phase, setPhase]             = useState('start')
  const [canvasAct, setCanvasAct]     = useState('fbi')
  const [showCanvas, setShowCanvas]   = useState(false)
  const [currentYear, setCurrentYear] = useState(1993)
  const [bgOpacity, setBgOpacity]     = useState(1)
  const [textOpacity, setTextOpacity] = useState(1)
  const [gateText, setGateText]       = useState('Press any key to start')
  const [acceptInput, setAcceptInput] = useState(true)
  const [runId, setRunId]             = useState(0)  // increments each act start → forces progress bar remount

  const phaseRef     = useRef('start')
  const acceptRef    = useRef(true)

  useEffect(() => { phaseRef.current  = phase },       [phase])
  useEffect(() => { acceptRef.current = acceptInput }, [acceptInput])

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // gate → canvas: text fades out → pause → overlay fades out revealing canvas
  const startAct = useCallback((act) => {
    const year = act === 'sah' ? 2020 : 1993
    setAcceptInput(false)
    setTextOpacity(0)                      // text fade-out begins (2s CSS transition)

    setTimeout(() => {
      setRunId(id => id + 1)               // new runId → forces progress bar remount
      setProgress(0)                       // reset stale progress before remount so bar starts at 0%
      setCanvasAct(act)
      setCurrentYear(year)
      setShowCanvas(true)
      setPhase(act)                        // canvas now mounted behind white overlay

      setTimeout(() => {
        setBgOpacity(0)                    // overlay fade-out begins (2s CSS transition)
      }, 1000)                             // 1s pause
    }, 2000)                               // wait for text to finish fading
  }, [])

  // canvas → gate: pause → overlay fades in → gate text fades in
  const endAct = useCallback((nextPhase, nextText) => {
    setAcceptInput(false)

    setTimeout(() => {
      setBgOpacity(1)                      // overlay fade-in begins (2s CSS transition)

      setTimeout(() => {
        setShowCanvas(false)               // canvas unmounted (now hidden behind overlay)
        setGateText(nextText)
        setTextOpacity(1)                  // gate text fade-in begins (2s CSS transition)

        setTimeout(() => {
          setPhase(nextPhase)
          setAcceptInput(true)             // ready for next key press
        }, 2000)                           // wait for text to finish fading in
      }, 2000)                             // wait for overlay to finish fading in
    }, 1000)                               // 1s pause after act ends
  }, [])

  const handleAdvance = useCallback(() => {
    if (!acceptRef.current) return
    const p = phaseRef.current
    if      (p === 'start')  startAct('fbi')
    else if (p === 'paused') startAct('sah')
    else if (p === 'done')   startAct('fbi')
  }, [startAct])

  const handleComplete = useCallback(() => {
    const p = phaseRef.current
    if      (p === 'fbi') endAct('paused', 'Press any key to continue')
    else if (p === 'sah') endAct('done',   'Press any key to restart')
  }, [endAct])

  const handleYearChange = useCallback((year) => setCurrentYear(year), [])

  // Progress: computed from currentYear each time it advances (every 6s per year).
  // CSS transition on the bar smooths the jump into a continuous fill over the year duration.
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const years = canvasAct === 'sah' ? SAH_YEARS : FBI_YEARS
    const idx = years.indexOf(currentYear)
    setProgress(idx >= 0 ? (idx + 1) / years.length : 0)
  }, [currentYear, canvasAct])

  useEffect(() => {
    window.addEventListener('keydown', handleAdvance)
    return () => window.removeEventListener('keydown', handleAdvance)
  }, [handleAdvance])

  if (prefersReducedMotion) return <StaticSummary />

  // overlay is not interactive during canvas phases (clicks pass through to canvas UI)
  const overlayInteractive = acceptInput && phase !== 'fbi' && phase !== 'sah'

  return (
    <div className={styles.root}>
      {/* Canvas — mounted only during active acts, sits beneath the overlay */}
      {showCanvas && (
        <div className={styles.canvasLayer}>
          <div
            className={`${styles.gradientLayer} ${styles.gradientWarm} ${canvasAct === 'sah' ? styles.fadeOut : ''}`}
            aria-hidden="true"
          />
          <div
            className={`${styles.gradientLayer} ${styles.gradientCool} ${canvasAct === 'sah' ? styles.fadeIn : ''}`}
            aria-hidden="true"
          />
          {/* Progress bar — advances each year; CSS transition smooths the jump */}
          <div className={styles.progressTrack}>
            <div
              key={runId}
              className={styles.progressBar}
              style={{
                width: (progress * 100) + '%',
                background: PROGRESS_COLORS[canvasAct],
              }}
            />
          </div>

          <GenerativeCanvas
            act={canvasAct}
            onYearChange={handleYearChange}
            onComplete={handleComplete}
          />
          <div className={styles.labelStack}>
            <ActLabel act={canvasAct} currentYear={currentYear} />
            <IncidentCounter act={canvasAct} currentYear={currentYear} />
          </div>
          <SoundToggle />
          <About />
        </div>
      )}

      {/* Overlay — white background that fades in/out; contains gate text */}
      <div
        className={styles.overlay}
        style={{
          opacity: bgOpacity,
          pointerEvents: overlayInteractive ? 'all' : 'none',
        }}
        onClick={handleAdvance}
      >
        <span
          className={styles.gateText}
          style={{ opacity: textOpacity }}
        >
          {gateText}
        </span>
      </div>
    </div>
  )
}
