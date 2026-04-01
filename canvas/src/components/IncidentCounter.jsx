import { useState, useEffect, useRef } from 'react'
import styles from './IncidentCounter.module.css'

export default function IncidentCounter({ act, spawnCount }) {
  const [displayed, setDisplayed] = useState(0)
  const lastAriaUpdate = useRef(0)

  useEffect(() => {
    setDisplayed(0)
  }, [act])

  useEffect(() => {
    if (spawnCount > displayed) {
      const diff = spawnCount - displayed
      const step = Math.max(1, Math.floor(diff / 3))
      const t = setTimeout(() => setDisplayed(d => Math.min(d + step, spawnCount)), 16)
      return () => clearTimeout(t)
    }
  }, [spawnCount, displayed])

  const TOTALS = { fbi: '11,036', sah: '12,803' }
  const total = TOTALS[act] || ''

  return (
    <div className={styles.counter}>
      <div className={styles.label}>Incidents recorded</div>
      <div
        className={styles.count}
        aria-live="polite"
        aria-label={`${displayed} incidents recorded`}
      >
        {displayed.toLocaleString()}
      </div>
      {total && (
        <div className={styles.separator}>
          of {total} total
        </div>
      )}
    </div>
  )
}
