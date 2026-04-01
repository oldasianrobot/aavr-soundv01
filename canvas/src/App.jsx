import { useState, useEffect, useRef, useCallback } from 'react'
import GenerativeCanvas from './components/GenerativeCanvas.jsx'
import ActLabel from './components/ActLabel.jsx'
import IncidentCounter from './components/IncidentCounter.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import StaticSummary from './components/StaticSummary.jsx'
import styles from './App.module.css'

export default function App() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return <StaticSummary />

  const [act, setAct] = useState('fbi')
  const [currentYear, setCurrentYear] = useState(1993)
  const [spawnCount, setSpawnCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const sentinelRef = useRef(null)
  const transitionRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
      if (scrollTop > 20) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && act === 'fbi') {
          setAct('transition')
          setSpawnCount(0)
          transitionRef.current = setTimeout(() => {
            setAct('sah')
            setCurrentYear(2020)
          }, 600)
        }
      },
      { threshold: 0.8 }
    )
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      clearTimeout(transitionRef.current)
    }
  }, [act])

  const handleYearChange = useCallback((year) => {
    setCurrentYear(year)
  }, [])

  const handleParticleSpawn = useCallback(() => {
    setSpawnCount(c => c + 1)
  }, [])

  return (
    <div className={styles.root}>
      <div className={`${styles.canvasLayer} ${act === 'sah' ? styles.sahAct : ''}`}>
        <GenerativeCanvas
          act={act}
          onYearChange={handleYearChange}
          onParticleSpawn={handleParticleSpawn}
        />
        <ActLabel act={act} currentYear={currentYear} />
        <IncidentCounter act={act} spawnCount={spawnCount} />
        <SoundToggle />
        <div
          className={`${styles.scrollCue} ${scrolled ? styles.scrollCueHidden : ''}`}
          aria-hidden="true"
        >
          <span className={styles.scrollCueLine} />
          <span className={styles.scrollCueLabel}>Scroll</span>
        </div>
      </div>

      <div
        ref={sentinelRef}
        style={{ position: 'relative', top: 0, height: '1px' }}
        aria-hidden="true"
      />
      <div style={{ height: '60vh' }} aria-hidden="true" />

      <div className={styles.scrollProgress} aria-hidden="true">
        <div className={styles.scrollProgressBar} style={{ height: `${scrollProgress * 100}%` }} />
      </div>
    </div>
  )
}
