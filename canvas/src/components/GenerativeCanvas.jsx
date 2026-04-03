import { useEffect, useRef } from 'react'
import * as fbiData from '../data/fbiData.js'
import * as sahData from '../data/sahData.js'
import SoundEngine from '../engine/SoundEngine.js'
import styles from './GenerativeCanvas.module.css'

const MAX_BARS = 800
const YEAR_DURATION_MS = 6000

// Bars spawned = yearCount * density * (dt / YEAR_DURATION_MS) per frame.
// FBI peak (2021, 746): ~10/sec  |  FBI quiet (2017, 109): ~1.5/sec
// SAH peak (2021, 4533): ~25/sec  |  SAH quiet (2024, 497): ~2.7/sec
const FBI_SPAWN_DENSITY = 0.08
const SAH_SPAWN_DENSITY = 0.034

class Bar {
  constructor(x, dataModule) {
    const { color, key } = dataModule.sampleOffense()
    this.x = x
    this.width = 36 + Math.random() * 84   // 36–120px thick
    this.color = color
    this.offenseKey = key
    this.alpha = 0.55 + Math.random() * 0.30
    this.decay = 0.0015 + Math.random() * 0.0025  // fades over ~3–6 sec
  }

  update() {
    this.alpha -= this.decay
  }

  draw(ctx, canvasH) {
    if (this.alpha <= 0) return
    const alphaHex = Math.round(this.alpha * 255).toString(16).padStart(2, '0')
    ctx.fillStyle = this.color + alphaHex
    ctx.fillRect(this.x, 0, this.width, canvasH)
  }

  isDead() { return this.alpha <= 0 }
}

export default function GenerativeCanvas({ act, onYearChange, onComplete }) {
  const canvasRef = useRef(null)
  const onYearChangeRef = useRef(onYearChange)
  const onCompleteRef  = useRef(onComplete)
  useEffect(() => { onYearChangeRef.current = onYearChange }, [onYearChange])
  useEffect(() => { onCompleteRef.current  = onComplete  }, [onComplete])

  const stateRef = useRef({
    bars: [],
    animId: null,
    yearIndex: 0,
    yearTimer: 0,
    lastTimestamp: 0,
    spawnAccum: 0,
    completed: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    state.bars = []
    state.yearIndex = 0
    state.yearTimer = 0
    state.lastTimestamp = 0
    state.spawnAccum = 0
    state.completed = false

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const dataModule = act === 'sah' ? sahData : fbiData
    const years = act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS
    const dataset = act === 'sah' ? 'sah' : 'fbi'
    const spawnDensity = act === 'sah' ? SAH_SPAWN_DENSITY : FBI_SPAWN_DENSITY

    function spawnBar() {
      if (state.bars.length >= MAX_BARS) return
      const x = Math.random() * canvas.offsetWidth
      const bar = new Bar(x, dataModule)
      state.bars.push(bar)
      SoundEngine.playTone(bar.offenseKey, dataset)
    }

    function animate(timestamp) {
      const dt = Math.min(timestamp - (state.lastTimestamp || timestamp), 50)
      state.lastTimestamp = timestamp

      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight

      ctx.fillStyle = '#F8F6F1'
      ctx.fillRect(0, 0, cw, ch)

      // Advance year
      state.yearTimer += dt
      if (state.yearTimer >= YEAR_DURATION_MS) {
        if (state.yearIndex < years.length - 1) {
          state.yearIndex++
          state.yearTimer = 0
          state.spawnAccum = 0
          onYearChangeRef.current?.(years[state.yearIndex])
        } else if (!state.completed) {
          state.completed = true
          onCompleteRef.current?.()
          return // stop the animation loop
        }
      }

      // Spawn rate tied to actual yearCount via accumulator
      const currentYear = years[state.yearIndex]
      const yearCount = dataModule.getYearCount(currentYear)

      if (yearCount > 0) {
        const spawnsPerMs = yearCount * spawnDensity / YEAR_DURATION_MS
        state.spawnAccum += spawnsPerMs * dt
        const spawnsThisFrame = Math.floor(state.spawnAccum)
        state.spawnAccum -= spawnsThisFrame
        for (let i = 0; i < spawnsThisFrame; i++) {
          spawnBar()
        }
      }

      // Update and draw
      state.bars = state.bars.filter(b => !b.isDead())
      state.bars.forEach(b => {
        b.update()
        b.draw(ctx, ch)
      })

      state.animId = requestAnimationFrame(animate)
    }

    state.animId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(state.animId)
      window.removeEventListener('resize', resize)
    }
  }, [act])

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />
      <div className={styles.grain} aria-hidden="true" />
    </div>
  )
}
