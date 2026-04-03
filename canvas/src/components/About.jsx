import { useState, useRef, useEffect } from 'react'
import styles from './About.module.css'

const FBI_LEGEND = [
  { color: '#B81C1C', label: 'Murder', pct: '<1%' },
  { color: '#D63B00', label: 'Aggravated Assault', pct: '13%' },
  { color: '#E05500', label: 'Robbery', pct: '<1%' },
  { color: '#D97000', label: 'Arson', pct: '<1%' },
  { color: '#B89000', label: 'Simple Assault', pct: '24%' },
  { color: '#59895A', label: 'Intimidation', pct: '36%' },
  { color: '#3E8A9E', label: 'Vandalism / Property Destruction', pct: '27%' },
  { color: '#2E6BAF', label: 'Burglary', pct: '<1%' },
  { color: '#1A4F8A', label: 'Larceny', pct: '<1%' },
  { color: '#4A3584', label: 'Motor Vehicle Theft', pct: '<1%' },
]

const SAH_LEGEND = [
  { color: '#CC1818', label: 'Physical Assault', pct: '16%' },
  { color: '#B06030', label: 'Property Damage', pct: '6%' },
  { color: '#3E8A9E', label: 'Verbal Harassment', pct: '60%' },
  { color: '#59895A', label: 'Civil Rights Violations', pct: '5%' },
  { color: '#2E6BAF', label: 'Online Harassment', pct: '9%' },
  { color: '#7B8FA0', label: 'Avoidance / Shunning', pct: '15%' },
]

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function About() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  // Focus trap + Escape handler
  useEffect(() => {
    if (!open) return

    // Focus the panel on open
    panelRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const focusable = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Return focus to trigger on close
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="About this visualization"
      >
        About
      </button>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            ref={panelRef}
            className={styles.panel}
            tabIndex={-1}
          >
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
              Close ×
            </button>

            <h2 id="about-title" className={styles.title}>This Is Not a Gap</h2>
            <p className={styles.subtitle}>Sound Canvas — Data Visualization</p>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Visualization</h3>
              <p className={styles.body}>
                Each vertical bar represents an incident drawn from the dataset for that year.
                Bar frequency is proportional to the actual annual incident count — gap years
                (years the FBI did not collect anti-Asian hate crime data) produce silence and
                an empty canvas. The piece advances through each year of data at 6 seconds per year.
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Sound</h3>
              <p className={styles.body}>
                Each bar triggers a synthesized tone corresponding to its incident type.
                Violent offenses produce high-frequency, harsh tones (sawtooth wave).
                Non-violent offenses produce lower, warmer tones (sine wave).
                The density and texture of sound directly reflects the density of
                documented incidents in the data.
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Color</h3>
              <p className={styles.body} style={{ marginBottom: 20 }}>
                Color maps to incident type on a spectrum from warm (violent) to cool (non-violent).
              </p>

              <div className={styles.legend}>
                <div className={styles.legendGroup}>
                  <div className={styles.legendGroupLabel}>FBI Uniform Crime Reports</div>
                  {FBI_LEGEND.map(({ color, label, pct }) => (
                    <div className={styles.legendRow} key={label}>
                      <div className={styles.swatch} style={{ background: color }} />
                      <span className={styles.legendLabel}>{label}</span>
                      <span className={styles.legendPct}>{pct}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.legendGroup}>
                  <div className={styles.legendGroupLabel}>STOP AAPI Hate</div>
                  {SAH_LEGEND.map(({ color, label, pct }) => (
                    <div className={styles.legendRow} key={label}>
                      <div className={styles.swatch} style={{ background: color }} />
                      <span className={styles.legendLabel}>{label}</span>
                      <span className={styles.legendPct}>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Data Sources</h3>
              <p className={styles.body}>
                <strong>FBI Uniform Crime Reports</strong>, 1993–2024.
                Anti-Asian hate crime incidents reported to participating law enforcement agencies.
                1994 contains no data (not collected that year).
                <br /><br />
                <strong>STOP AAPI Hate</strong>, 2020–2024.
                Self-reported incidents submitted directly by community members via the
                STOP AAPI Hate reporting center. Includes incidents that never reached law enforcement.
              </p>
            </div>

            <div className={styles.coda}>
              The gap between 7,755 incidents documented by the FBI over 32 years and
              12,803 incidents reported to STOP AAPI Hate in just 5 years is not a discrepancy
              to footnote. It is the subject of this work.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
