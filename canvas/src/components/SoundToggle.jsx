import { useState } from 'react'
import SoundEngine from '../engine/SoundEngine.js'
import styles from './SoundToggle.module.css'

export default function SoundToggle() {
  const [muted, setMuted] = useState(true)

  function handleToggle() {
    if (muted) {
      SoundEngine.init()
      SoundEngine.unmute()
      setMuted(false)
    } else {
      SoundEngine.mute()
      setMuted(true)
    }
  }

  return (
    <button
      className={styles.toggle}
      onClick={handleToggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Enable sound' : 'Disable sound'}
    >
      <span className={`${styles.dot} ${!muted ? styles.active : ''}`} aria-hidden="true" />
      {muted ? 'Sound off' : 'Sound on'}
    </button>
  )
}
