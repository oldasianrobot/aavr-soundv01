# This Is Not a Gap — Sound Canvas
**Design Spec** | 2026-03-31

---

## Context

This is the third canvas in the "This Is Not a Gap" series examining anti-Asian hate crime data. The existing canvases (fluid v1, fluid v2) visualize the gap between FBI Hate Crime Statistics and STOP AAPI Hate community reports using data-encoded particle trails — data made visible but intentionally not legible.

This piece extends the series by adding sound as a second encoding channel, and introduces STOP AAPI Hate data as a full visual layer for the first time. The core argument becomes audible: the official record (FBI) sounds sparse. The community record (STOP AAPI Hate) sounds overwhelming. The gap between them is not a footnote — it is the subject.

---

## Structure

### Two-Act Scroll-Driven Canvas

**Act 1 — FBI Hate Crime Data (1991–2023)**
- Sparse particles encoded with FBI offense types
- Sound: each particle spawn triggers a tone based on offense type
- Predominantly warm tones (intimidation 38%, vandalism 29% = non-violent majority)
- Occasional violent shrieks mark assault/murder incidents
- The sparseness of the soundscape is the point

**Scroll Threshold**
- At a defined scroll position, a brief silence — then Act 2 begins
- FBI particles fade out; Act 2 starts fresh — clean slate, new flood

**Act 2 — STOP AAPI Hate Data (2020–2024)**
- Particles flood in at dramatically higher density (12,803 vs 407)
- Sound layers build and overlap; up to 8 simultaneous voices
- Verbal harassment (63%) drives a dense wash of warm tones
- Physical assault (16%) cuts through with high shrieks
- Combined effect: overwhelming, not for effect, but because 12,803 incidents made audible sounds overwhelming

---

## Sound Design

### Implementation
- Web Audio API (no external library)
- `SoundEngine.js` — Audio context, tone synthesis, voice queue, mute state
- Sound off by default; explicit user opt-in (WCAG 1.4.2 compliance)
- Max 8 simultaneous voices; overflow queued, not dropped

### Tone Parameters
- Non-violent offenses: sine wave, soft attack (5ms), sustain ~80ms, release 200ms
- Violent offenses: sawtooth wave, sharp attack (2ms), decay 50ms

### FBI Offense Sound Scale

| Offense | Violence | Wave | Frequency | Character |
|---|---|---|---|---|
| Murder/Non-neg. Manslaughter | Violent | Sawtooth | 1800 Hz | Piercing shriek |
| Rape | Violent | Sawtooth | 1600 Hz | Sharp shriek |
| Aggravated Assault | Violent | Sawtooth | 1400 Hz | High alarm |
| Robbery | Violent | Sawtooth | 1200 Hz | Sharp mid |
| Arson | Violent | Sawtooth | 1100 Hz | Mid-high alarm |
| Simple Assault | Violent | Square | 1000 Hz | Mid alarm |
| Intimidation | Non-violent | Sine | 440 Hz | Warm A4 |
| Vandalism/Property Destruction | Non-violent | Sine | 330 Hz | Warm E4 |
| Burglary | Non-violent | Sine | 294 Hz | Warm D4 |
| Larceny-Theft | Non-violent | Sine | 261 Hz | Warm C4 |
| Motor Vehicle Theft | Non-violent | Sine | 220 Hz | Warm A3 |

### STOP AAPI Hate Sound Scale

| Category | Violence | Wave | Frequency |
|---|---|---|---|
| Physical Assault | Violent | Sawtooth | 1400 Hz |
| Verbal Harassment | Non-violent | Sine | 440 Hz |
| Online Harassment | Non-violent | Sine | 370 Hz |
| Civil Rights Violations | Non-violent | Sine | 330 Hz |
| Avoidance/Shunning | Non-violent | Sine | 294 Hz |
| Property Damage | Non-violent | Sine | 261 Hz |

---

## Visual Design

### Aesthetic
Premium, exotic minimalism. Light color scheme. Editorial data journalism meets gallery installation. Layered depth. Modern. Accessible.

### Color Palette
- Background: `#F8F6F1` — warm off-white
- Typography/UI chrome: `#1A1A2E` — near-black navy
- **FBI particles:** Existing offense color system (amber, forest green, deep red) at 60% opacity
- **STOP AAPI Hate particles:** Shifted palette — dusty rose (`#E8C5B8`), slate blue (`#7B9BB5`), terracotta (`#C4704A`) — same offense-type logic, visually distinct from FBI layer

### Depth Layers (front to back)
1. Scroll progress indicator — hairline vertical rule, right edge, `#1A1A2E` at 30% opacity
2. Particle canvas — mid layer, full bleed
3. Ambient grain texture — CSS noise overlay, 4% opacity
4. Background wash — slow radial gradient, shifts warm→cool at Act 2 transition

### Typography
- Space Grotesk — UI labels, act headings (already loaded in project)
- JetBrains Mono — data counter, incident readout (already loaded in project)

### UI Chrome
- Top left: Act label
  - Act 1: `"FBI Hate Crime Data / 1991–2023"`
  - Act 2: `"STOP AAPI Hate / 2020–2024"`
  - Crossfade transition between acts
- Bottom left: Live incident counter (ticks up as particles spawn, resets at act transition)
- Bottom center: Scroll cue (animated chevron, disappears after first scroll event)
- Top right: Sound toggle (muted by default, icon button with label)

---

## Accessibility

- **`prefers-reduced-motion`**: Disables particle animation; shows static data summary with full offense breakdown
- **`prefers-reduced-transparency`**: Removes grain texture overlay
- **Sound off by default**: Explicit unmute control per WCAG 1.4.2 (Audio Control)
- **ARIA live region**: Incident counter announced to screen readers on update (throttled to ~1/sec)
- **Keyboard navigation**: All interactive controls (sound toggle, scroll) keyboard-accessible
- **Contrast**: All text meets WCAG AA minimum (4.5:1) against `#F8F6F1` background
- **Focus indicators**: Visible focus ring on all interactive elements

---

## Architecture

### Project Structure
```
thisisnotagap_sound/
├── canvas/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenerativeCanvas.jsx   # Particle system (extended from fluid v2)
│   │   │   ├── ScrollOrchestrator.jsx # Act transitions, scroll position → canvas state
│   │   │   ├── ActLabel.jsx           # Animated act indicator
│   │   │   ├── IncidentCounter.jsx    # Live ARIA counter
│   │   │   └── SoundToggle.jsx        # Mute/unmute control
│   │   ├── data/
│   │   │   ├── fbiData.js             # Reused from fluid v2
│   │   │   └── sahData.js             # New: STOP AAPI Hate data layer
│   │   ├── engine/
│   │   │   └── SoundEngine.js         # Web Audio API, tone synthesis, voice queue
│   │   └── App.jsx
│   └── index.html
├── data/
│   ├── fbi/                           # Reused from fluid v2
│   └── stop_aapi_hate/                # Reused from fluid v2
└── docs/
    └── superpowers/specs/
        └── 2026-03-31-tinag-sound-design.md
```

### Key Modules

**`SoundEngine.js`**
- Singleton Web Audio context (created on first user gesture)
- `playTone(offenseType, dataset)` — looks up frequency/wave from scale tables
- Voice queue: max 8 simultaneous `OscillatorNode`s; oldest voice released when limit hit
- Exposes `mute()` / `unmute()` / `isMuted` state

**`sahData.js`**
- Mirrors structure of existing `fbiData.js`
- Exports: incident type palette, normalized counts, weighted random sampler
- STOP AAPI Hate color palette constants

**`ScrollOrchestrator.jsx`**
- Tracks scroll position via `IntersectionObserver`
- Emits `act` state: `'fbi' | 'transition' | 'saph'`
- Passes act state down to `GenerativeCanvas` and `ActLabel`

**`GenerativeCanvas.jsx`**
- Extended from fluid v2: accepts `act` prop
- Act 1: spawns particles using FBI data + calls `SoundEngine.playTone()`
- Act 2: switches to STOP AAPI Hate palette + higher spawn rate + same sound integration
- Transition: brief particle fade, background gradient crossfade

---

## Data Sources

**FBI:** `/data/fbi/fbi_anti_asian_annual.csv`, `fbi_offense_types.csv`
**STOP AAPI Hate:** `/data/stop_aapi_hate/sah_annual_totals.csv`, `sah_incident_types.csv`

Both datasets already present in fluid v2 — copy into new project.

---

## Verification

1. **Sound scale**: Open in browser, unmute, observe particle spawns trigger correct tones by offense type
2. **Act transition**: Scroll past threshold — confirm brief silence, then STOP AAPI Hate flood begins
3. **Density contrast**: Act 1 should feel sparse; Act 2 noticeably denser visually and audibly
4. **Voice limit**: Rapid spawns should not exceed 8 simultaneous tones (check browser audio inspector)
5. **Accessibility**: Test with `prefers-reduced-motion` enabled — static summary renders
6. **Sound default off**: Hard refresh — confirm no sound plays until toggle clicked
7. **Keyboard nav**: Tab through all controls, confirm focus visible and functional
8. **Contrast check**: Run axe or Lighthouse accessibility audit, target zero contrast errors
