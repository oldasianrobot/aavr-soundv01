import { useState, useEffect } from 'react'
import * as fbiData from '../data/fbiData.js'
import * as sahData from '../data/sahData.js'
import styles from './IncidentCounter.module.css'

function getCumulativeCount(act, upToYear) {
  const dataModule = act === 'sah' ? sahData : fbiData
  const years = act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS
  return years
    .filter(y => y <= upToYear)
    .reduce((sum, y) => sum + dataModule.getYearCount(y), 0)
}

function getGrandTotal(act) {
  const dataModule = act === 'sah' ? sahData : fbiData
  const years = act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS
  return years.reduce((sum, y) => sum + dataModule.getYearCount(y), 0)
}

export default function IncidentCounter({ act, currentYear }) {
  const target = getCumulativeCount(act, currentYear)
  const total = getGrandTotal(act)
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    setDisplayed(0)
  }, [act])

  useEffect(() => {
    if (target > displayed) {
      const diff = target - displayed
      const step = Math.max(1, Math.floor(diff / 5))
      const t = setTimeout(() => setDisplayed(d => Math.min(d + step, target)), 16)
      return () => clearTimeout(t)
    }
  }, [target, displayed])

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
      <div className={styles.separator}>
        of {total.toLocaleString()} documented
      </div>
    </div>
  )
}
