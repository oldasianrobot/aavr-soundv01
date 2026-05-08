# CLAUDE.md — Anti-Asian Violence and Racism: Sound v01

## Project Overview

A two-act data sonification and generative visualization of anti-Asian hate crimes.
Built in React 19 + Vite with the HTML5 Canvas API and Web Audio API — no external
charting or audio libraries.

## Architecture

### Phase State Machine (App.jsx)

The experience runs as a linear phase sequence:

```
'start' → 'fbi' → 'paused' → 'sah' → 'done' → (restart → 'fbi')
```

- Gate screens (start/paused/done): full-screen white overlay with bold centered text
- Canvas phases (fbi/sah): GenerativeCanvas mounted behind a transparent overlay
- All transitions are CSS opacity animations (2s), chained with setTimeout
- Key: done → restart goes directly to FBI, not back to the start screen

### Transition Sequencing

Gate → Canvas: text fades out (2s) → 1s pause → overlay fades out (2s)
Canvas → Gate: 1s pause → overlay fades in (2s) → gate text fades in (2s)

The overlay is always present; it fades in/out over the canvas rather than
mounting/unmounting. `setBgOpacity` and `setTextOpacity` drive CSS transitions.

### Stale Closure Pattern

Long-lived callbacks (rAF, setTimeout chains) use the `xRef` pattern to avoid
stale closures:
```js
const phaseRef = useRef('start')
useEffect(() => { phaseRef.current = phase }, [phase])
```
All long-lived callbacks read from refs, not closed-over state.

### GenerativeCanvas (GenerativeCanvas.jsx)

- Each bar is a vertical full-height rectangle: random x, width 36–120px,
  color sampled by offense type, alpha decaying over 3–6s
- Spawn rate tied to actual `yearCount` via accumulator:
  `spawnAccum += spawnsPerMs * dt; n = floor(spawnAccum); spawnAccum -= n`
- FBI: `SPAWN_DENSITY = 0.08` | SAH: `SPAWN_DENSITY = 0.034`
- `YEAR_DURATION_MS = 6000` (6 seconds per year)
- `onComplete` fires when `yearIndex === years.length - 1` AND `yearTimer >= YEAR_DURATION_MS`

### Sound Engine (SoundEngine.js)

- Shared lowpass filter (1600Hz) + synthetic reverb (ConvolverNode) for warmth
- Violent offenses → sawtooth wave, high frequency
- Non-violent offenses → sine wave, lower frequency
- Dry/wet mix: 0.65 / 0.35
- Web Audio context created on first user gesture (browser autoplay policy)

### Progress Bar (App.jsx)

- Computed from `currentYear` via React state — not rAF callback (avoids dt interference)
- `progress = yearIndex / years.length`; CSS `transition: width 6s linear` smooths jumps
- `key={runId}` on the bar div forces remount on each act start, preventing rubber-band
  backwards animation when `progress` resets to 0 from the previous act's stale value
- FBI bar color: `#B87020` (warm amber) | SAH bar color: `#3E6A9E` (cool slate)

## Data

### FBI UCR (fbiData.js)
Source: FBI Hate Crime Statistics, Table 1 (Anti-Asian). 1993–2024.
https://ucr.fbi.gov/hate-crime
1994 = 0 (not collected that year). All other years have real data.
Total: 7,755 incidents.

### STOP AAPI Hate (sahData.js)
Source: STOP AAPI Hate annual reports. 2020–2024.
Total: 12,803 incidents.

### Updating FBI Data
To find anti-Asian figures: open any year's report, search "Asian" in Table 1.
Note: category changed from "Anti-Asian/Pacific Islander" (pre-2013) to
"Anti-Asian" (2013+). Use the Crime Data Explorer for recent years.

## Design System

- Background: `#F8F6F1` (warm cream)
- Ink: `#1A1A2E` (dark navy)
- Font: system sans-serif + mono stack
- Offense color palette runs warm → cool by severity:
  red-orange (murder, aggravated assault) → amber (simple assault) →
  sage green (intimidation) → teal/blue (property crimes)

## Known Behaviors

- Sound requires explicit user enable (browser autoplay policy)
- `prefersReducedMotion` check renders `<StaticSummary>` fallback
- 1994 is a genuine gap year — canvas is silent and empty, which is intentional
- Gap years produce no bars and no sound; the silence is meaningful, not a bug
