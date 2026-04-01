// Wave types encode severity: sawtooth = high-severity violent, square = mid-severity violent, sine = non-violent
// simple_assault uses square (mid-violent) to distinguish from aggravated assault (sawtooth)

// Tone scale tables
const FBI_TONES = {
  murder:              { wave: 'sawtooth', freq: 1800 },
  rape:                { wave: 'sawtooth', freq: 1600 },
  aggravated_assault:  { wave: 'sawtooth', freq: 1400 },
  robbery:             { wave: 'sawtooth', freq: 1200 },
  arson:               { wave: 'sawtooth', freq: 1100 },
  simple_assault:      { wave: 'square',   freq: 1000 },
  intimidation:        { wave: 'sine',     freq: 440  },
  vandalism:           { wave: 'sine',     freq: 330  },
  burglary:            { wave: 'sine',     freq: 294  },
  larceny:             { wave: 'sine',     freq: 261  },
  motor_vehicle_theft: { wave: 'sine',     freq: 220  },
}

const SAH_TONES = {
  physical_assault:  { wave: 'sawtooth', freq: 1400 },
  verbal_harassment: { wave: 'sine',     freq: 440  },
  online_harassment: { wave: 'sine',     freq: 370  },
  civil_rights:      { wave: 'sine',     freq: 330  },
  avoidance:         { wave: 'sine',     freq: 294  },
  property_damage:   { wave: 'sine',     freq: 261  },
}

const MAX_VOICES = 8

const SoundEngine = {
  _ctx: null,
  _muted: true,
  _voices: [],

  get isMuted() { return this._muted },

  init() {
    if (this._ctx) return
    this._ctx = new AudioContext()
    if (this._ctx.state === 'suspended') this._ctx.resume()
  },

  mute()   { this._muted = true },
  unmute() {
    this._muted = false
    if (!this._ctx) this.init()
    if (this._ctx.state === 'suspended') this._ctx.resume()
  },

  getToneParams(offenseKey, dataset) {
    const table = dataset === 'sah' ? SAH_TONES : FBI_TONES
    return table[offenseKey] ?? { wave: 'sine', freq: 330 }
  },

  playTone(offenseKey, dataset) {
    if (this._muted || !this._ctx) return

    if (this._voices.length >= MAX_VOICES) {
      const old = this._voices.shift()
      try { old.osc.stop(); old.osc.disconnect(); old.gain.disconnect() } catch (_) {}
    }

    const { wave, freq } = this.getToneParams(offenseKey, dataset)
    const isViolent = wave === 'sawtooth' || wave === 'square'
    const now = this._ctx.currentTime

    const osc = this._ctx.createOscillator()
    const gain = this._ctx.createGain()

    osc.type = wave
    osc.frequency.setValueAtTime(freq, now)
    osc.connect(gain)
    gain.connect(this._ctx.destination)

    const attackTime  = isViolent ? 0.002 : 0.005
    const sustainTime = isViolent ? 0.05  : 0.08
    const releaseTime = isViolent ? 0.05  : 0.2
    const peakGain    = isViolent ? 0.18  : 0.12

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(peakGain, now + attackTime)
    gain.gain.setValueAtTime(peakGain, now + attackTime + sustainTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + sustainTime + releaseTime)

    osc.start(now)
    osc.stop(now + attackTime + sustainTime + releaseTime + 0.01)

    const voice = { osc, gain }
    this._voices.push(voice)

    const totalDuration = (attackTime + sustainTime + releaseTime + 0.05) * 1000
    setTimeout(() => {
      this._voices = this._voices.filter(v => v !== voice)
      try { osc.disconnect(); gain.disconnect() } catch (_) {}
    }, totalDuration)
  },

  _reset() {
    this._ctx = null
    this._muted = true
    this._voices = []
  },
}

export default SoundEngine
