import { useEffect, useRef } from 'react'
import * as fbiData from '../data/fbiData.js'
import * as sahData from '../data/sahData.js'
import SoundEngine from '../engine/SoundEngine.js'
import styles from './GenerativeCanvas.module.css'

const MAX_PARTICLES = 600
const SPAWN_RATE = 4
const GLOBAL_TURBULENCE = 0.5
const MAX_DPR = 2
const YEAR_DURATION_MS = 2000
const SAH_SPAWN_MULTIPLIER = 4

class Particle {
  constructor(x, y, dataModule) {
    const count = dataModule.sampleIncidentCount()
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.life = 1.0
    this.decay = 0.005 + Math.random() * 0.01
    const { color, key } = dataModule.sampleOffense()
    this.color = color
    this.offenseKey = key
    this.size = dataModule.incidentToSize(count)
    this.history = []
    this.maxTrailLength = dataModule.incidentToTrailLength(count)
  }

  update(mouseX, mouseY) {
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const angle = Math.atan2(dy, dx)
    this.vx += Math.cos(angle + Math.PI * 0.5) * GLOBAL_TURBULENCE * 0.05
    this.vy += Math.sin(angle + Math.PI * 0.5) * GLOBAL_TURBULENCE * 0.05
    this.vx *= 0.98
    this.vy *= 0.98
    this.x += this.vx
    this.y += this.vy
    this.life -= this.decay
    this.history.push({ x: this.x, y: this.y })
    if (this.history.length > this.maxTrailLength) this.history.shift()
  }

  draw(ctx) {
    if (this.history.length < 2) return
    ctx.beginPath()
    ctx.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 1; i < this.history.length - 1; i++) {
      const mx = (this.history[i].x + this.history[i + 1].x) / 2
      const my = (this.history[i].y + this.history[i + 1].y) / 2
      ctx.quadraticCurveTo(this.history[i].x, this.history[i].y, mx, my)
    }
    ctx.strokeStyle = this.color + Math.round(this.life * 153).toString(16).padStart(2, '0')
    ctx.lineWidth = this.size * this.life
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  isDead() { return this.life <= 0 }
}

class Bot {
  constructor(canvasW, canvasH) {
    this.x = Math.random() * canvasW
    this.y = Math.random() * canvasH
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.targetX = Math.random() * canvasW
    this.targetY = Math.random() * canvasH
    this.changeTimer = 0
  }

  update(canvasW, canvasH) {
    this.changeTimer++
    if (this.changeTimer > 120) {
      this.targetX = Math.random() * canvasW
      this.targetY = Math.random() * canvasH
      this.changeTimer = 0
    }
    this.vx += (this.targetX - this.x) * 0.002
    this.vy += (this.targetY - this.y) * 0.002
    this.vx *= 0.95
    this.vy *= 0.95
    this.x += this.vx
    this.y += this.vy
  }
}

export default function GenerativeCanvas({ act, onYearChange, onParticleSpawn }) {
  const canvasRef = useRef(null)
  const onParticleSpawnRef = useRef(onParticleSpawn)
  const onYearChangeRef = useRef(onYearChange)
  useEffect(() => { onParticleSpawnRef.current = onParticleSpawn }, [onParticleSpawn])
  useEffect(() => { onYearChangeRef.current = onYearChange }, [onYearChange])

  const stateRef = useRef({
    particles: [],
    bots: [],
    mouseX: 0,
    mouseY: 0,
    animId: null,
    yearIndex: 0,
    yearTimer: 0,
    lastTimestamp: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    state.particles = []
    state.yearIndex = 0
    state.yearTimer = 0
    state.lastTimestamp = 0

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    state.bots = [new Bot(w, h), new Bot(w, h), new Bot(w, h)]

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const dataModule = act === 'sah' ? sahData : fbiData
    const years = act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS
    const dataset = act === 'sah' ? 'sah' : 'fbi'
    const spawnMultiplier = act === 'sah' ? SAH_SPAWN_MULTIPLIER : 1

    function spawnAt(x, y, budget) {
      const rate = Math.min(budget, SPAWN_RATE * spawnMultiplier)
      for (let i = 0; i < rate; i++) {
        if (state.particles.length >= MAX_PARTICLES) break
        const p = new Particle(
          x + (Math.random() - 0.5) * 20,
          y + (Math.random() - 0.5) * 20,
          dataModule
        )
        state.particles.push(p)
        SoundEngine.playTone(p.offenseKey, dataset)
        onParticleSpawnRef.current?.()
      }
    }

    function animate(timestamp) {
      const dt = timestamp - (state.lastTimestamp || timestamp)
      state.lastTimestamp = timestamp

      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight

      ctx.fillStyle = '#F8F6F1'
      ctx.fillRect(0, 0, cw, ch)

      state.yearTimer += dt
      if (state.yearTimer >= YEAR_DURATION_MS && state.yearIndex < years.length - 1) {
        state.yearIndex++
        state.yearTimer = 0
        onYearChangeRef.current?.(years[state.yearIndex])
      }

      const currentYear = years[state.yearIndex]
      const yearCount = dataModule.getYearCount(currentYear)
      const spawnBudget = yearCount > 0 ? SPAWN_RATE : 1

      state.bots.forEach(bot => {
        bot.update(cw, ch)
        spawnAt(bot.x, bot.y, spawnBudget)
      })
      spawnAt(state.mouseX, state.mouseY, spawnBudget)

      state.particles = state.particles.filter(p => !p.isDead())
      state.particles.forEach(p => {
        p.update(state.mouseX, state.mouseY)
        p.draw(ctx)
      })

      state.animId = requestAnimationFrame(animate)
    }

    state.animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(state.animId)
      window.removeEventListener('resize', resize)
    }
  }, [act])

  function handleMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    stateRef.current.mouseX = e.clientX - rect.left
    stateRef.current.mouseY = e.clientY - rect.top
  }

  function handleTouchMove(e) {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    stateRef.current.mouseX = e.touches[0].clientX - rect.left
    stateRef.current.mouseY = e.touches[0].clientY - rect.top
  }

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        aria-hidden="true"
      />
      <div className={styles.grain} aria-hidden="true" />
    </div>
  )
}
