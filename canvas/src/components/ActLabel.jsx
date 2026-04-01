import { useState, useEffect } from 'react'
import styles from './ActLabel.module.css'

const ACT_META = {
  fbi: { dataset: 'FBI UCR', title: 'Anti-Asian Hate Crimes', range: '1991 – 2023' },
  transition: { dataset: 'FBI UCR', title: 'Anti-Asian Hate Crimes', range: '1991 – 2023' },
  sah: { dataset: 'STOP AAPI Hate', title: 'Reported Incidents', range: '2020 – 2024' },
}

export default function ActLabel({ act, currentYear }) {
  const [visible, setVisible] = useState(true)
  const [meta, setMeta] = useState(ACT_META.fbi)

  useEffect(() => {
    if (act === 'transition') {
      setVisible(false)
      return
    }
    setVisible(false)
    const t = setTimeout(() => {
      setMeta(ACT_META[act] || ACT_META.fbi)
      setVisible(true)
    }, 300)
    return () => clearTimeout(t)
  }, [act])

  return (
    <div className={styles.label} aria-live="polite" aria-atomic="true">
      <div className={`${styles.dataset} ${!visible ? styles.fading : ''}`}>
        {meta.dataset}
      </div>
      <div className={`${styles.title} ${!visible ? styles.fading : ''}`}>
        {meta.title}
      </div>
      <div className={`${styles.year} ${!visible ? styles.fading : ''}`}>
        {currentYear || meta.range}
      </div>
    </div>
  )
}
