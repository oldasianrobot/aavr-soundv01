# This Is Not a Gap — Sound Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `thisisnotagap_sound` — a two-act scroll-driven canvas + sound piece that makes anti-Asian hate crime data audible. FBI data (sparse, quiet) transitions via scroll into STOP AAPI Hate data (dense, overwhelming).

**Architecture:** React 19 + Vite SPA with a full-bleed Canvas for particle rendering (extended from `thisisnotagap_fluidv02`) and a Web Audio API `SoundEngine` singleton that triggers tones on each particle spawn. Scroll position drives act state (`fbi → transition → sah`), switching data source, spawn density, color palette, and sound scale. FBI act animates through years 1991–2023 automatically; SAH act animates through 2020–2024. All UI chrome (act label, incident counter, sound toggle) layered over canvas via absolute positioning.

**Tech Stack:** React 19, Vite, HTML5 Canvas API, Web Audio API, CSS Modules, Vitest

**Spec:** `thisisnotagap_sound/docs/superpowers/specs/2026-03-31-tinag-sound-design.md`

**Source to adapt:** `/Volumes/MONSTER/monster_claude_projects/thisisnotagap_fluidv02/canvas/`

---

## File Map

```
thisisnotagap_sound/
├── canvas/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenerativeCanvas.jsx       MODIFY (extended from fluidv02)
│   │   │   ├── GenerativeCanvas.module.css
│   │   │   ├── ActLabel.jsx               CREATE
│   │   │   ├── ActLabel.module.css        CREATE
│   │   │   ├── IncidentCounter.jsx        CREATE
│   │   │   ├── IncidentCounter.module.css CREATE
│   │   │   ├── SoundToggle.jsx            CREATE
│   │   │   └── SoundToggle.module.css     CREATE
│   │   ├── data/
│   │   │   ├── fbiData.js                 MODIFY (add sampleOffense())
│   │   │   └── sahData.js                 CREATE
│   │   ├── engine/
│   │   │   └── SoundEngine.js             CREATE
│   │   ├── App.jsx                        CREATE (new layout)
│   │   ├── App.module.css                 CREATE
│   │   ├── main.jsx                       CREATE
│   │   └── index.css                      CREATE (light theme)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── fbi/         (copied from fluidv02)
│   └── stop_aapi_hate/ (copied from fluidv02)
└── docs/
    ├── superpowers/specs/2026-03-31-tinag-sound-design.md (already exists)
    └── superpowers/plans/2026-03-31-tinag-sound.md       (copy of this plan)
```

---

## Task 1: Scaffold project

**Files:**
- Create: `thisisnotagap_sound/canvas/` (via Vite)
- Create: `thisisnotagap_sound/canvas/src/index.css`
- Create: `thisisnotagap_sound/canvas/index.html`

- [ ] **Step 1: Bootstrap with Vite**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
npm create vite@latest canvas -- --template react
cd canvas
npm install
```

- [ ] **Step 2: Install Vitest for testing**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Add test config to vite.config.js**

```javascript
// canvas/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 4: Create test setup file**

```javascript
// canvas/src/test-setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 6: Copy data files from fluidv02**

```bash
cp -r /Volumes/MONSTER/monster_claude_projects/thisisnotagap_fluidv02/data /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/data
```

- [ ] **Step 7: Write index.css (light theme)**

```css
/* canvas/src/index.css */
:root {
  --color-bg: #F8F6F1;
  --color-ink: #1A1A2E;
  --color-ink-muted: rgba(26, 26, 46, 0.45);
  --color-ink-hairline: rgba(26, 26, 46, 0.18);
  --font-sans: 'Space Grotesk', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  width: 100%;
  height: 100%;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 11px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

- [ ] **Step 8: Write index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>This Is Not a Gap — Sound Canvas</title>
    <meta name="description" content="A sonic and visual record of anti-Asian violence and racism in America." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Write main.jsx**

```jsx
// canvas/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 10: Verify dev server starts**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/canvas
npm run dev
```
Expected: Vite dev server at `http://localhost:5173`, no errors.

- [ ] **Step 11: Commit**

```bash
git init /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add .
git commit -m "feat: scaffold thisisnotagap_sound with Vite + Vitest"
```

---

## Task 2: FBI data layer

**Files:**
- Create: `canvas/src/data/fbiData.js`
- Create: `canvas/src/data/fbiData.test.js`

The existing `fbiData.js` returns a color hex from `sampleOffenseColor()`. The new version needs to also return the offense key so `SoundEngine` can look up the right tone. Add `sampleOffense()` that returns `{ color, key }`.

- [ ] **Step 1: Write the failing test**

```javascript
// canvas/src/data/fbiData.test.js
import { describe, it, expect } from 'vitest'
import {
  sampleOffense,
  sampleIncidentCount,
  incidentToSize,
  incidentToTrailLength,
  FBI_YEARS,
  getYearCount,
} from './fbiData.js'

describe('sampleOffense', () => {
  it('returns an object with color and key', () => {
    const result = sampleOffense()
    expect(result).toHaveProperty('color')
    expect(result).toHaveProperty('key')
    expect(typeof result.color).toBe('string')
    expect(result.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(typeof result.key).toBe('string')
  })

  it('returns known offense keys', () => {
    const VALID_KEYS = [
      'murder', 'aggravated_assault', 'simple_assault',
      'intimidation', 'vandalism', 'robbery', 'arson',
      'burglary', 'larceny', 'motor_vehicle_theft',
    ]
    for (let i = 0; i < 100; i++) {
      const { key } = sampleOffense()
      expect(VALID_KEYS).toContain(key)
    }
  })
})

describe('incidentToSize', () => {
  it('maps min incident count to min size', () => {
    expect(incidentToSize(109)).toBeCloseTo(1.2, 1)
  })
  it('maps max incident count to max size', () => {
    expect(incidentToSize(746)).toBeCloseTo(5.5, 1)
  })
})

describe('incidentToTrailLength', () => {
  it('maps min to 6', () => expect(incidentToTrailLength(109)).toBeCloseTo(6, 0))
  it('maps max to 22', () => expect(incidentToTrailLength(746)).toBeCloseTo(22, 0))
})

describe('getYearCount', () => {
  it('returns incident count for a known year', () => {
    expect(getYearCount(2021)).toBe(746)
    expect(getYearCount(2023)).toBe(407)
  })
  it('returns 0 for a gap year', () => {
    expect(getYearCount(1991)).toBe(0)
    expect(getYearCount(1997)).toBe(0)
  })
})

describe('FBI_YEARS', () => {
  it('spans 1991 to 2023', () => {
    expect(FBI_YEARS[0]).toBe(1991)
    expect(FBI_YEARS[FBI_YEARS.length - 1]).toBe(2023)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/canvas
npm test
```
Expected: FAIL — `fbiData.js` does not exist yet.

- [ ] **Step 3: Write fbiData.js**

```javascript
// canvas/src/data/fbiData.js

// Annual incident counts indexed by year. 0 = no data (gap year).
const YEAR_DATA = {
  1991: 0, 1992: 0, 1993: 258, 1994: 0, 1995: 355,
  1996: 0, 1997: 0, 1998: 0, 1999: 0, 2000: 281,
  2001: 280, 2002: 217, 2003: 231, 2004: 217, 2005: 146,
  2006: 181, 2007: 148, 2008: 149, 2009: 189, 2010: 150,
  2011: 135, 2012: 130, 2013: 135, 2014: 111, 2015: 111,
  2016: 113, 2017: 109, 2018: 148, 2019: 158, 2020: 274,
  2021: 746, 2022: 380, 2023: 407,
}

export const FBI_YEARS = Object.keys(YEAR_DATA).map(Number)
const MIN_COUNT = 109
const MAX_COUNT = 746

// Weighted offense palette: [key, color, weight]
const OFFENSE_PALETTE = [
  { key: 'murder',             color: '#CC0000', weight: 0.005 },
  { key: 'aggravated_assault', color: '#FF5500', weight: 0.13  },
  { key: 'simple_assault',     color: '#FFB300', weight: 0.24  },
  { key: 'intimidation',       color: '#FFE033', weight: 0.355 },
  { key: 'vandalism',          color: '#2D6A4F', weight: 0.27  },
  { key: 'robbery',            color: '#FF8000', weight: 0.005 },
  { key: 'arson',              color: '#7D4E00', weight: 0.005 },
  { key: 'burglary',           color: '#1A5276', weight: 0.005 },
  { key: 'larceny',            color: '#4A235A', weight: 0.005 },
  { key: 'motor_vehicle_theft',color: '#7D3C98', weight: 0.005 },
]

// Precompute cumulative weights
const CUMULATIVE = OFFENSE_PALETTE.reduce((acc, item, i) => {
  acc.push((acc[i - 1] || 0) + item.weight)
  return acc
}, [])

// Returns { color, key } sampled by weighted distribution
export function sampleOffense() {
  const r = Math.random()
  for (let i = 0; i < CUMULATIVE.length; i++) {
    if (r <= CUMULATIVE[i]) return { color: OFFENSE_PALETTE[i].color, key: OFFENSE_PALETTE[i].key }
  }
  const last = OFFENSE_PALETTE[OFFENSE_PALETTE.length - 1]
  return { color: last.color, key: last.key }
}

// Returns a random historical incident count
export function sampleIncidentCount() {
  const counts = Object.values(YEAR_DATA).filter(c => c > 0)
  return counts[Math.floor(Math.random() * counts.length)]
}

// Returns the incident count for a specific year (0 if gap)
export function getYearCount(year) {
  return YEAR_DATA[year] ?? 0
}

// Normalize count → particle size [1.2, 5.5]
export function incidentToSize(count) {
  return 1.2 + ((count - MIN_COUNT) / (MAX_COUNT - MIN_COUNT)) * (5.5 - 1.2)
}

// Normalize count → trail length [6, 22]
export function incidentToTrailLength(count) {
  return Math.round(6 + ((count - MIN_COUNT) / (MAX_COUNT - MIN_COUNT)) * (22 - 6))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All `fbiData.test.js` tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/data/fbiData.js canvas/src/data/fbiData.test.js
git commit -m "feat: add FBI data layer with sampleOffense() for sound lookup"
```

---

## Task 3: STOP AAPI Hate data layer

**Files:**
- Create: `canvas/src/data/sahData.js`
- Create: `canvas/src/data/sahData.test.js`

SAH covers 2020–2024. Annual totals: 2020: 3,795 / 2021: 4,533 / 2022: 2,227 / 2023: 1,751 / 2024: est. 497 (survey-only). Incident types use a different category set than FBI offenses.

- [ ] **Step 1: Write the failing test**

```javascript
// canvas/src/data/sahData.test.js
import { describe, it, expect } from 'vitest'
import {
  sampleOffense,
  sampleIncidentCount,
  incidentToSize,
  incidentToTrailLength,
  SAH_YEARS,
  getYearCount,
} from './sahData.js'

describe('sampleOffense', () => {
  it('returns object with color and key', () => {
    const result = sampleOffense()
    expect(result).toHaveProperty('color')
    expect(result).toHaveProperty('key')
    expect(result.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('returns known SAH incident keys', () => {
    const VALID_KEYS = [
      'verbal_harassment', 'physical_assault', 'online_harassment',
      'civil_rights', 'avoidance', 'property_damage',
    ]
    for (let i = 0; i < 100; i++) {
      expect(VALID_KEYS).toContain(sampleOffense().key)
    }
  })
})

describe('getYearCount', () => {
  it('returns known counts', () => {
    expect(getYearCount(2020)).toBe(3795)
    expect(getYearCount(2021)).toBe(4533)
    expect(getYearCount(2023)).toBe(1751)
  })
})

describe('SAH_YEARS', () => {
  it('spans 2020 to 2024', () => {
    expect(SAH_YEARS[0]).toBe(2020)
    expect(SAH_YEARS[SAH_YEARS.length - 1]).toBe(2024)
  })
})

describe('incidentToSize', () => {
  it('maps min to ~1.2', () => expect(incidentToSize(497)).toBeCloseTo(1.2, 1))
  it('maps max to ~5.5', () => expect(incidentToSize(4533)).toBeCloseTo(5.5, 1))
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `sahData.js` does not exist.

- [ ] **Step 3: Write sahData.js**

```javascript
// canvas/src/data/sahData.js

// Annual incident totals. 2024 is survey-estimated (not yet officially published).
const YEAR_DATA = {
  2020: 3795,
  2021: 4533,
  2022: 2227,
  2023: 1751,
  2024: 497, // survey estimate only
}

export const SAH_YEARS = Object.keys(YEAR_DATA).map(Number)
const MIN_COUNT = 497
const MAX_COUNT = 4533

// Weighted palette: dusty rose / slate blue / terracotta tones.
// Weights based on STOP AAPI Hate 2020-2021 report proportions.
const OFFENSE_PALETTE = [
  { key: 'verbal_harassment', color: '#E8C5B8', weight: 0.63  }, // 63% — dusty rose
  { key: 'physical_assault',  color: '#C4704A', weight: 0.16  }, // 16% — terracotta
  { key: 'avoidance',         color: '#7B9BB5', weight: 0.16  }, // 16% — slate blue
  { key: 'civil_rights',      color: '#9EB5C4', weight: 0.115 }, // 11.5% — soft blue
  { key: 'online_harassment', color: '#D4A8A0', weight: 0.086 }, // 8.6% — muted rose
  { key: 'property_damage',   color: '#B8A898', weight: 0.06  }, // 6% — warm gray
]

const CUMULATIVE = OFFENSE_PALETTE.reduce((acc, item, i) => {
  acc.push((acc[i - 1] || 0) + item.weight)
  return acc
}, [])

export function sampleOffense() {
  const r = Math.random()
  for (let i = 0; i < CUMULATIVE.length; i++) {
    if (r <= CUMULATIVE[i]) return { color: OFFENSE_PALETTE[i].color, key: OFFENSE_PALETTE[i].key }
  }
  const last = OFFENSE_PALETTE[OFFENSE_PALETTE.length - 1]
  return { color: last.color, key: last.key }
}

export function sampleIncidentCount() {
  const counts = Object.values(YEAR_DATA)
  return counts[Math.floor(Math.random() * counts.length)]
}

export function getYearCount(year) {
  return YEAR_DATA[year] ?? 0
}

export function incidentToSize(count) {
  return 1.2 + ((count - MIN_COUNT) / (MAX_COUNT - MIN_COUNT)) * (5.5 - 1.2)
}

export function incidentToTrailLength(count) {
  return Math.round(6 + ((count - MIN_COUNT) / (MAX_COUNT - MIN_COUNT)) * (22 - 6))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests in both `fbiData.test.js` and `sahData.test.js` PASS.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/data/sahData.js canvas/src/data/sahData.test.js
git commit -m "feat: add STOP AAPI Hate data layer"
```

---

## Task 4: SoundEngine

**Files:**
- Create: `canvas/src/engine/SoundEngine.js`
- Create: `canvas/src/engine/SoundEngine.test.js`

Web Audio API singleton. Sound off by default. `playTone(offenseKey, dataset)` synthesizes a tone based on the sound scale tables. Max 8 simultaneous oscillators; oldest released on overflow.

- [ ] **Step 1: Write the failing test**

```javascript
// canvas/src/engine/SoundEngine.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SoundEngine from './SoundEngine.js'

// Mock Web Audio API
const mockOscillator = {
  type: '',
  frequency: { setValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
}
const mockGain = {
  gain: {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  disconnect: vi.fn(),
}
const mockContext = {
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({ ...mockGain })),
  destination: {},
  currentTime: 0,
  state: 'running',
  resume: vi.fn(),
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', vi.fn(() => mockContext))
  SoundEngine._reset() // test-only reset hook
})

describe('SoundEngine', () => {
  it('starts muted by default', () => {
    expect(SoundEngine.isMuted).toBe(true)
  })

  it('unmute / mute toggles isMuted', () => {
    SoundEngine.unmute()
    expect(SoundEngine.isMuted).toBe(false)
    SoundEngine.mute()
    expect(SoundEngine.isMuted).toBe(true)
  })

  it('playTone does not call AudioContext when muted', () => {
    SoundEngine.init()
    SoundEngine.playTone('intimidation', 'fbi')
    expect(mockContext.createOscillator).not.toHaveBeenCalled()
  })

  it('playTone creates oscillator when unmuted', () => {
    SoundEngine.init()
    SoundEngine.unmute()
    SoundEngine.playTone('intimidation', 'fbi')
    expect(mockContext.createOscillator).toHaveBeenCalled()
  })

  it('uses sine wave for non-violent FBI offenses', () => {
    SoundEngine.init()
    SoundEngine.unmute()
    const osc = mockContext.createOscillator()
    SoundEngine.playTone('intimidation', 'fbi')
    // intimidation = sine, 440Hz
    expect(mockContext.createOscillator).toHaveBeenCalled()
  })

  it('getToneParams returns correct params for known keys', () => {
    expect(SoundEngine.getToneParams('murder', 'fbi')).toEqual({ wave: 'sawtooth', freq: 1800 })
    expect(SoundEngine.getToneParams('intimidation', 'fbi')).toEqual({ wave: 'sine', freq: 440 })
    expect(SoundEngine.getToneParams('verbal_harassment', 'sah')).toEqual({ wave: 'sine', freq: 440 })
    expect(SoundEngine.getToneParams('physical_assault', 'sah')).toEqual({ wave: 'sawtooth', freq: 1400 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `SoundEngine.js` does not exist.

- [ ] **Step 3: Write SoundEngine.js**

```javascript
// canvas/src/engine/SoundEngine.js

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
  _voices: [], // active { osc, gain } pairs

  get isMuted() { return this._muted },

  // Call once on first user gesture (required by browser autoplay policy)
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

    // Release oldest voice if at cap
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

    const attackTime = isViolent ? 0.002 : 0.005
    const sustainTime = isViolent ? 0.05  : 0.08
    const releaseTime = isViolent ? 0.05  : 0.2
    const peakGain   = isViolent ? 0.18  : 0.12

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(peakGain, now + attackTime)
    gain.gain.setValueAtTime(peakGain, now + attackTime + sustainTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + sustainTime + releaseTime)

    osc.start(now)
    osc.stop(now + attackTime + sustainTime + releaseTime + 0.01)

    const voice = { osc, gain }
    this._voices.push(voice)

    // Auto-remove from voice list after tone ends
    const totalDuration = (attackTime + sustainTime + releaseTime + 0.05) * 1000
    setTimeout(() => {
      this._voices = this._voices.filter(v => v !== voice)
      try { osc.disconnect(); gain.disconnect() } catch (_) {}
    }, totalDuration)
  },

  // Test-only: reset singleton state between tests
  _reset() {
    this._ctx = null
    this._muted = true
    this._voices = []
  },
}

export default SoundEngine
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS including SoundEngine tests.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/engine/SoundEngine.js canvas/src/engine/SoundEngine.test.js
git commit -m "feat: add SoundEngine with Web Audio API tone synthesis"
```

---

## Task 5: GenerativeCanvas (Act 1 — FBI particles + sound)

**Files:**
- Create: `canvas/src/components/GenerativeCanvas.jsx`
- Create: `canvas/src/components/GenerativeCanvas.module.css`

Based directly on `thisisnotagap_fluidv02/canvas/src/components/GenerativeCanvas.jsx`. Key changes:
1. Light background (`#F8F6F1`) instead of white
2. Accept `act` prop (`'fbi' | 'transition' | 'sah'`)
3. Call `SoundEngine.playTone(key, dataset)` on each particle spawn
4. FBI particles use `sampleOffense()` (returning `{ color, key }`)
5. Auto-advance through FBI years (1991–2023) — one year every 2 seconds, spawning proportional to that year's count
6. Autonomous ambient spawning (3 bots) continues when mouse is idle — identical to fluidv02 behavior

- [ ] **Step 1: Write GenerativeCanvas.module.css**

```css
/* canvas/src/components/GenerativeCanvas.module.css */
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
}

.canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

/* Grain texture overlay */
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

@media (prefers-reduced-transparency: reduce) {
  .grain { display: none; }
}
```

- [ ] **Step 2: Write GenerativeCanvas.jsx**

```jsx
// canvas/src/components/GenerativeCanvas.jsx
import { useEffect, useRef, useCallback } from 'react'
import * as fbiData from '../data/fbiData.js'
import * as sahData from '../data/sahData.js'
import SoundEngine from '../engine/SoundEngine.js'
import styles from './GenerativeCanvas.module.css'

const MAX_PARTICLES = 600
const SPAWN_RATE = 4
const GLOBAL_TURBULENCE = 0.5
const MAX_DPR = 2
const YEAR_DURATION_MS = 2000 // ms per year in auto-advance
const SAH_SPAWN_MULTIPLIER = 4 // SAH spawns 4x as many particles per frame

class Particle {
  constructor(x, y, data) {
    const count = data.sampleIncidentCount()
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.life = 1.0
    this.decay = 0.005 + Math.random() * 0.01
    const { color, key } = data.sampleOffense()
    this.color = color
    this.offenseKey = key
    this.size = data.incidentToSize(count)
    this.history = []
    this.maxTrailLength = data.incidentToTrailLength(count)
  }

  update(mouseX, mouseY, canvasW, canvasH) {
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const angle = Math.atan2(dy, dx)
    const turbulence = GLOBAL_TURBULENCE
    this.vx += Math.cos(angle + Math.PI * 0.5) * turbulence * 0.05
    this.vy += Math.sin(angle + Math.PI * 0.5) * turbulence * 0.05
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

// Autonomous bot that wanders around the canvas
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
  // Stable ref for callbacks — avoids reinstating the canvas effect on every parent render
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
    // Year animation
    yearIndex: 0,
    yearTimer: 0,
    lastTimestamp: 0,
    // Act transition
    fadeAlpha: 1, // 1 = fully visible, used for transition fade
  })

  const getDataModule = useCallback(() => act === 'sah' ? sahData : fbiData, [act])
  const getYears = useCallback(() => act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS, [act])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    // Reset on act change
    state.particles = []
    state.yearIndex = 0
    state.yearTimer = 0

    const bots = [
      new Bot(canvas.offsetWidth, canvas.offsetHeight),
      new Bot(canvas.offsetWidth, canvas.offsetHeight),
      new Bot(canvas.offsetWidth, canvas.offsetHeight),
    ]
    state.bots = bots

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    function spawnAt(x, y, count) {
      if (state.particles.length >= MAX_PARTICLES) return
      const dataModule = act === 'sah' ? sahData : fbiData
      const rate = act === 'sah' ? SPAWN_RATE * SAH_SPAWN_MULTIPLIER : SPAWN_RATE
      for (let i = 0; i < Math.min(count, rate); i++) {
        if (state.particles.length >= MAX_PARTICLES) break
        const p = new Particle(
          x + (Math.random() - 0.5) * 20,
          y + (Math.random() - 0.5) * 20,
          dataModule
        )
        state.particles.push(p)
        SoundEngine.playTone(p.offenseKey, act === 'sah' ? 'sah' : 'fbi')
        onParticleSpawnRef.current?.()
      }
    }

    function animate(timestamp) {
      const dt = timestamp - (state.lastTimestamp || timestamp)
      state.lastTimestamp = timestamp

      // Clear with light background
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.fillStyle = '#F8F6F1'
      ctx.fillRect(0, 0, w, h)

      // Advance year timer
      state.yearTimer += dt
      const years = act === 'sah' ? sahData.SAH_YEARS : fbiData.FBI_YEARS
      if (state.yearTimer >= YEAR_DURATION_MS && state.yearIndex < years.length - 1) {
        state.yearIndex++
        state.yearTimer = 0
        const yr = years[state.yearIndex]
        onYearChangeRef.current?.(yr)
      }

      // Spawn from bots (proportional to current year count)
      const currentYear = years[state.yearIndex]
      const getYearCount = act === 'sah' ? sahData.getYearCount : fbiData.getYearCount
      const yearCount = getYearCount(currentYear)
      const spawnBudget = yearCount > 0 ? SPAWN_RATE : 1 // still spawn minimally in gap years

      state.bots.forEach(bot => {
        bot.update(w, h)
        spawnAt(bot.x, bot.y, spawnBudget)
      })

      // Spawn from mouse
      spawnAt(state.mouseX, state.mouseY, spawnBudget)

      // Update + draw particles
      state.particles = state.particles.filter(p => !p.isDead())
      state.particles.forEach(p => {
        p.update(state.mouseX, state.mouseY, w, h)
        p.draw(ctx)
      })

      state.animId = requestAnimationFrame(animate)
    }

    state.animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(state.animId)
      window.removeEventListener('resize', resize)
    }
  }, [act]) // Re-runs when act changes

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
```

- [ ] **Step 3: Create placeholder App.jsx to verify canvas renders**

```jsx
// canvas/src/App.jsx (temporary — will be replaced in Task 9)
import GenerativeCanvas from './components/GenerativeCanvas.jsx'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GenerativeCanvas act="fbi" />
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```
Expected: Canvas renders on light background, particle trails appear from mouse movement and bots, no console errors.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/
git commit -m "feat: add GenerativeCanvas with FBI particles and sound integration"
```

---

## Task 6: ScrollOrchestrator — act state from scroll

**Files:**
- Create: `canvas/src/components/ScrollOrchestrator.jsx`

Uses IntersectionObserver on a sentinel element placed below the FBI section. When sentinel enters the viewport, act transitions `fbi → transition → sah`. Provides `act` via render prop.

- [ ] **Step 1: Write ScrollOrchestrator.jsx**

```jsx
// canvas/src/components/ScrollOrchestrator.jsx
import { useState, useRef, useEffect, useCallback } from 'react'

// act: 'fbi' → 'transition' → 'sah'
export default function ScrollOrchestrator({ children }) {
  const [act, setAct] = useState('fbi')
  const sentinelRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && act === 'fbi') {
          setAct('transition')
          // Brief silence window (600ms), then SAH begins
          transitionTimeoutRef.current = setTimeout(() => {
            setAct('sah')
          }, 600)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      clearTimeout(transitionTimeoutRef.current)
    }
  }, [act])

  return (
    <>
      {/* FBI section — full viewport height */}
      <div style={{ height: '100vh', position: 'relative' }}>
        {children(act)}
      </div>

      {/* Scroll sentinel — triggers at 100vh */}
      <div
        ref={sentinelRef}
        style={{ height: '1px', position: 'relative', top: 0 }}
        aria-hidden="true"
      />

      {/* SAH section spacer — keeps scrollability */}
      <div style={{ height: '50vh' }} aria-hidden="true" />
    </>
  )
}
```

- [ ] **Step 2: Update App.jsx to use ScrollOrchestrator**

```jsx
// canvas/src/App.jsx (temporary — will be replaced in Task 9)
import ScrollOrchestrator from './components/ScrollOrchestrator.jsx'
import GenerativeCanvas from './components/GenerativeCanvas.jsx'

export default function App() {
  return (
    <ScrollOrchestrator>
      {(act) => (
        <div style={{ width: '100%', height: '100%' }}>
          <GenerativeCanvas act={act} />
          <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'monospace' }}>
            ACT: {act}
          </div>
        </div>
      )}
    </ScrollOrchestrator>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Expected: Scroll down — FBI canvas transitions to SAH canvas. "ACT: sah" label appears after scroll. Particle density noticeably increases in SAH act.

- [ ] **Step 4: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/ScrollOrchestrator.jsx canvas/src/App.jsx
git commit -m "feat: scroll-driven act transition fbi → sah"
```

---

## Task 7: ActLabel component

**Files:**
- Create: `canvas/src/components/ActLabel.jsx`
- Create: `canvas/src/components/ActLabel.module.css`

Top-left overlay. Shows dataset name and year range. Crossfades on act change.

- [ ] **Step 1: Write ActLabel.module.css**

```css
/* canvas/src/components/ActLabel.module.css */
.label {
  position: absolute;
  top: 24px;
  left: 28px;
  pointer-events: none;
  z-index: 10;
}

.dataset {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 4px;
  transition: opacity 0.4s ease;
}

.title {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-ink);
  transition: opacity 0.4s ease;
}

.year {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-ink);
  margin-top: 6px;
  letter-spacing: -0.02em;
  transition: opacity 0.2s ease;
}

.fading {
  opacity: 0;
}
```

- [ ] **Step 2: Write ActLabel.jsx**

```jsx
// canvas/src/components/ActLabel.jsx
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
    // Fade out, swap content, fade in
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
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/ActLabel.jsx canvas/src/components/ActLabel.module.css
git commit -m "feat: add ActLabel with crossfade on act transition"
```

---

## Task 8: IncidentCounter component

**Files:**
- Create: `canvas/src/components/IncidentCounter.jsx`
- Create: `canvas/src/components/IncidentCounter.module.css`

Bottom-left overlay. Counts up as particles spawn. Resets at act transition. ARIA live region.

- [ ] **Step 1: Write IncidentCounter.module.css**

```css
/* canvas/src/components/IncidentCounter.module.css */
.counter {
  position: absolute;
  bottom: 28px;
  left: 28px;
  pointer-events: none;
  z-index: 10;
}

.label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 4px;
}

.count {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 400;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1;
}

.separator {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-ink-hairline);
  margin-top: 6px;
  letter-spacing: 0.1em;
}
```

- [ ] **Step 2: Write IncidentCounter.jsx**

```jsx
// canvas/src/components/IncidentCounter.jsx
import { useState, useEffect, useRef } from 'react'
import styles from './IncidentCounter.module.css'

export default function IncidentCounter({ act, spawnCount }) {
  const [displayed, setDisplayed] = useState(0)
  const ariaRef = useRef(0)
  const lastAriaUpdate = useRef(0)

  // Reset on act change
  useEffect(() => {
    setDisplayed(0)
  }, [act])

  // Tick up displayed count
  useEffect(() => {
    if (spawnCount > displayed) {
      const diff = spawnCount - displayed
      const step = Math.max(1, Math.floor(diff / 3))
      const t = setTimeout(() => setDisplayed(d => Math.min(d + step, spawnCount)), 16)
      return () => clearTimeout(t)
    }
  }, [spawnCount, displayed])

  // Throttle ARIA announcements to ~1/sec
  const now = Date.now()
  if (now - lastAriaUpdate.current > 1000) {
    ariaRef.current = displayed
    lastAriaUpdate.current = now
  }

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
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/IncidentCounter.jsx canvas/src/components/IncidentCounter.module.css
git commit -m "feat: add IncidentCounter with ARIA live region"
```

---

## Task 9: SoundToggle component

**Files:**
- Create: `canvas/src/components/SoundToggle.jsx`
- Create: `canvas/src/components/SoundToggle.module.css`

Top-right. Muted by default. On click: initializes AudioContext + unmutes. Keyboard accessible.

- [ ] **Step 1: Write SoundToggle.module.css**

```css
/* canvas/src/components/SoundToggle.module.css */
.toggle {
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--color-ink-hairline);
  color: var(--color-ink);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.toggle:hover {
  border-color: var(--color-ink-muted);
  background: rgba(26, 26, 46, 0.04);
}

.toggle:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-ink-muted);
  flex-shrink: 0;
}

.dot.active {
  background: var(--color-ink);
  box-shadow: 0 0 0 2px rgba(26, 26, 46, 0.15);
}
```

- [ ] **Step 2: Write SoundToggle.jsx**

```jsx
// canvas/src/components/SoundToggle.jsx
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
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/SoundToggle.jsx canvas/src/components/SoundToggle.module.css
git commit -m "feat: add SoundToggle — muted by default, keyboard accessible"
```

---

## Task 10: App.jsx + premium layout

**Files:**
- Create: `canvas/src/App.jsx` (final)
- Create: `canvas/src/App.module.css`

Wires all components. Canvas is full-bleed. All overlays are absolute-positioned children. Scroll progress indicator (hairline right edge). Background gradient shifts on SAH act.

- [ ] **Step 1: Write App.module.css**

```css
/* canvas/src/App.module.css */
.root {
  position: relative;
  width: 100%;
  min-height: 200vh; /* enables scroll for act transition */
}

.canvasLayer {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Radial background wash — shifts warm → cool between acts */
.canvasLayer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 60%, rgba(232, 197, 184, 0.18) 0%, transparent 70%);
  transition: opacity 1.2s ease;
  pointer-events: none;
  z-index: 1;
}

.canvasLayer.sahAct::before {
  background: radial-gradient(ellipse at 70% 40%, rgba(123, 155, 181, 0.18) 0%, transparent 70%);
}

/* Hairline scroll progress — right edge */
.scrollProgress {
  position: fixed;
  top: 0;
  right: 0;
  width: 1px;
  height: 100vh;
  background: rgba(26, 26, 46, 0.10);
  z-index: 20;
  pointer-events: none;
}

.scrollProgress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(26, 26, 46, 0.45);
  transition: height 0.1s linear;
}

/* Scroll cue chevron */
.scrollCue {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  animation: cueFloat 2s ease-in-out infinite;
  transition: opacity 0.5s ease;
}

.scrollCue.hidden {
  opacity: 0;
}

.scrollCue span {
  display: block;
  width: 1px;
  height: 24px;
  background: var(--color-ink-muted);
}

.scrollCue::after {
  content: 'SCROLL';
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.16em;
  color: var(--color-ink-muted);
  margin-top: 4px;
}

@keyframes cueFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}
```

- [ ] **Step 2: Write App.jsx (final)**

```jsx
// canvas/src/App.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import GenerativeCanvas from './components/GenerativeCanvas.jsx'
import ActLabel from './components/ActLabel.jsx'
import IncidentCounter from './components/IncidentCounter.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import styles from './App.module.css'

export default function App() {
  const [act, setAct] = useState('fbi')
  const [currentYear, setCurrentYear] = useState(1993)
  const [spawnCount, setSpawnCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const sentinelRef = useRef(null)
  const transitionRef = useRef(null)

  // Scroll progress indicator
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

  // IntersectionObserver for act transition
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
      {/* Sticky canvas layer */}
      <div className={`${styles.canvasLayer} ${act === 'sah' ? styles.sahAct : ''}`}>
        <GenerativeCanvas
          act={act}
          onYearChange={handleYearChange}
          onParticleSpawn={handleParticleSpawn}
        />

        {/* UI chrome — all absolutely positioned over canvas */}
        <ActLabel act={act} currentYear={currentYear} />
        <IncidentCounter act={act} spawnCount={spawnCount} />
        <SoundToggle />

        {/* Scroll cue */}
        <div className={`${styles.scrollCue} ${scrolled ? styles.hidden : ''}`} aria-hidden="true">
          <span />
        </div>
      </div>

      {/* Scroll sentinel at 100vh mark */}
      <div
        ref={sentinelRef}
        style={{ position: 'relative', top: 0, height: '1px' }}
        aria-hidden="true"
      />

      {/* SAH spacer — keeps page scrollable */}
      <div style={{ height: '60vh' }} aria-hidden="true" />

      {/* Scroll progress hairline */}
      <div className={styles.scrollProgress} aria-hidden="true">
        <div style={{ height: `${scrollProgress * 100}%` }} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Remove unused ScrollOrchestrator**

```bash
rm /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/canvas/src/components/ScrollOrchestrator.jsx
```

App.jsx now owns the scroll logic directly — ScrollOrchestrator is superseded.

- [ ] **Step 4: Verify full layout in browser**

```bash
npm run dev
```
Expected:
- Light canvas with particle trails, all UI chrome visible
- Scroll cue visible initially, disappears after scrolling
- Scroll triggers act transition after 600ms silence
- SAH act shows denser, differently-colored particles
- Scroll progress hairline tracks position
- Incident counter ticks up
- Year label updates as animation advances

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/App.jsx canvas/src/App.module.css canvas/src/components/GenerativeCanvas.jsx
git commit -m "feat: wire full App layout with scroll, act transitions, all UI chrome"
```

---

## Task 11: Accessibility — reduced motion + ARIA

**Files:**
- Create: `canvas/src/components/StaticSummary.jsx`
- Create: `canvas/src/components/StaticSummary.module.css`
- Modify: `canvas/src/App.jsx`

When `prefers-reduced-motion: reduce` is set, hide canvas and show a static data summary instead. All interactive elements already have ARIA labels from previous tasks.

- [ ] **Step 1: Write StaticSummary.module.css**

```css
/* canvas/src/components/StaticSummary.module.css */
.summary {
  padding: 48px;
  max-width: 720px;
  margin: 0 auto;
}

.heading {
  font-family: var(--font-sans);
  font-size: 28px;
  font-weight: 500;
  color: var(--color-ink);
  margin-bottom: 8px;
}

.subheading {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 40px;
}

.section { margin-bottom: 40px; }

.sectionTitle {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-ink-hairline);
}

.dataRow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-ink-hairline);
}

.dataLabel {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-ink);
}

.dataValue {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-ink);
}

.gap {
  background: rgba(26, 26, 46, 0.04);
  border-radius: 2px;
  padding: 16px 20px;
  margin-top: 24px;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-ink);
}
```

- [ ] **Step 2: Write StaticSummary.jsx**

```jsx
// canvas/src/components/StaticSummary.jsx
import styles from './StaticSummary.module.css'

const FBI_OFFENSES = [
  { label: 'Intimidation', pct: '38%', count: '~2,243' },
  { label: 'Vandalism / Property Destruction', pct: '29%', count: '~1,712' },
  { label: 'Simple Assault', pct: '26%', count: '~1,535' },
  { label: 'Aggravated Assault', pct: '14%', count: '~826' },
  { label: 'All other offenses', pct: '<1% ea.', count: '' },
]

const SAH_CATEGORIES = [
  { label: 'Verbal Harassment', pct: '63%', count: '~8,066' },
  { label: 'Physical Assault', pct: '16%', count: '~2,049' },
  { label: 'Avoidance / Shunning', pct: '16%', count: '~2,049' },
  { label: 'Civil Rights Violations', pct: '11.5%', count: '~1,472' },
  { label: 'Online Harassment', pct: '8.6%', count: '~1,101' },
  { label: 'Property Damage', pct: '6%', count: '~768' },
]

export default function StaticSummary() {
  return (
    <main className={styles.summary}>
      <h1 className={styles.heading}>This Is Not a Gap</h1>
      <p className={styles.subheading}>Sound Canvas — Anti-Asian Hate Crime Data</p>

      <section className={styles.section} aria-labelledby="fbi-heading">
        <h2 id="fbi-heading" className={styles.sectionTitle}>FBI Hate Crime Statistics / 1991–2023</h2>
        {FBI_OFFENSES.map(({ label, pct, count }) => (
          <div className={styles.dataRow} key={label}>
            <span className={styles.dataLabel}>{label}</span>
            <span className={styles.dataValue}>{pct}{count ? ` — ${count}` : ''}</span>
          </div>
        ))}
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>2023 total reported to FBI</span>
          <span className={styles.dataValue}>407</span>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sah-heading">
        <h2 id="sah-heading" className={styles.sectionTitle}>STOP AAPI Hate / 2020–2024</h2>
        {SAH_CATEGORIES.map(({ label, pct, count }) => (
          <div className={styles.dataRow} key={label}>
            <span className={styles.dataLabel}>{label}</span>
            <span className={styles.dataValue}>{pct}{count ? ` — ${count}` : ''}</span>
          </div>
        ))}
        <div className={styles.dataRow}>
          <span className={styles.dataLabel}>Cumulative 2020–2024</span>
          <span className={styles.dataValue}>12,803</span>
        </div>
      </section>

      <div className={styles.gap}>
        The gap between 407 (FBI, 2023) and 12,803 (STOP AAPI Hate, cumulative 2020–2024)
        is not a discrepancy to footnote. It is the subject of this work.
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Update App.jsx to use StaticSummary when reduced motion is preferred**

Add this import at the top of `canvas/src/App.jsx` (after existing imports):

```jsx
import StaticSummary from './components/StaticSummary.jsx'
```

Then add this as the **first line inside the `App()` function body**, before any state declarations:

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) return <StaticSummary />
```

- [ ] **Step 4: Verify with dev tools**

In Chrome DevTools → Rendering → Emulate CSS media: `prefers-reduced-motion: reduce`.
Expected: Static summary renders instead of canvas. All text is readable, contrast passes.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add canvas/src/components/StaticSummary.jsx canvas/src/components/StaticSummary.module.css canvas/src/App.jsx
git commit -m "feat: prefers-reduced-motion fallback with static data summary"
```

---

## Task 12: Final verification

- [ ] **Step 1: Run full test suite**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/canvas
npm test
```
Expected: All tests PASS. No skipped tests.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```
Expected: Build completes with no errors. Output in `dist/`.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```
Check: Canvas renders, scroll works, sound toggle responds, no console errors.

- [ ] **Step 4: Manual accessibility audit**

Open browser DevTools → Lighthouse → run Accessibility audit.
Expected: Score ≥ 90. Fix any contrast or ARIA errors before proceeding.

- [ ] **Step 5: Test sound scale manually**

Open in browser. Enable sound. Move mouse — verify:
- FBI act: mostly soft warm tones (intimidation/vandalism = ~67% of spawns)
- Occasional sharp shrieks (violent offenses)
- After scroll: SAH act sounds denser, more overlapping tones
- More than 8 simultaneous tones do not produce audio glitches

- [ ] **Step 6: Copy plan to project docs**

```bash
mkdir -p /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/docs/superpowers/plans
cp /Users/msl-macstudio/.claude/plans/toasty-squishing-minsky.md \
   /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound/docs/superpowers/plans/2026-03-31-tinag-sound.md
```

- [ ] **Step 7: Final commit**

```bash
cd /Volumes/MONSTER/monster_claude_projects/thisisnotagap_sound
git add .
git commit -m "feat: complete TINAG Sound Canvas — FBI + SAH data, Web Audio, scroll transition"
```
