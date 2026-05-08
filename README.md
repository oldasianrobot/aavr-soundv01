# Anti-Asian Violence and Racism — Sound v01

A two-act, scroll-free data visualization of anti-Asian hate crimes in the United States,
expressed through generative sound and visual composition.

---

## The Work

*Anti-Asian Violence and Racism* is part of a series examining the documented record of anti-Asian
hate in America — and more critically, what that record fails to capture.

The piece runs in two acts:

**FBI Uniform Crime Reports (1993–2024)**
Anti-Asian hate crime incidents reported to law enforcement and submitted to the FBI's
annual Hate Crime Statistics program. 7,755 incidents over 32 years. 1994 contains no
data — not collected that year.

**STOP AAPI Hate (2020–2024)**
Self-reported incidents submitted directly by community members, bypassing law
enforcement entirely. 12,803 incidents in just five years.

The gap between those two numbers is not a footnote. It is the subject of this work.

---

## Why Sound?

*Anti-Asian Violence and Racism* uses sound not as decoration but as a second language for the
same data. Each incident spawns both a visual bar and a synthesized tone — violent
offenses rendered as high-frequency, harsh sawtooth waves; non-violent offenses as
lower, warmer sine tones. The density of what you hear in any given moment directly
mirrors the density of documented harm in that year.

The choice to sonify this data is deliberate. Charts ask you to read harm at a
remove. Sound asks you to be present with it. A spike year doesn't just look
different — it sounds different. The silence of a gap year is conspicuous in a way
that an empty column is not. And the contrast between the FBI's 32 years of sparse,
interrupted data and STOP AAPI Hate's five years of volume is something you can hear
before you read a single number.

Sound also enforces duration. You cannot skim this piece. You have to sit with each
year at the pace it is given — six seconds, one after another — which is a small but
meaningful analog to the time these incidents actually occupied.

---

## Data Sources

| Dataset | Years | Incidents | Notes |
|---|---|---|---|
| FBI UCR Hate Crime Statistics | 1993–2024 | 7,755 | Anti-Asian (Table 1). 1994 not collected. |
| STOP AAPI Hate | 2020–2024 | 12,803 | Self-reported via community reporting center. |

FBI data: https://ucr.fbi.gov/hate-crime
FBI Crime Data Explorer: https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/explorer/crime/hate-crime
STOP AAPI Hate: https://stopaapihate.org/

---

## Technical Stack

- **React 19** + **Vite** — SPA framework
- **HTML5 Canvas API** — generative bar visualization
- **Web Audio API** — OscillatorNode + GainNode + BiquadFilter + ConvolverNode (synthetic reverb)
- **CSS Modules** — component-scoped styling
- No external UI or charting libraries

---

## Running Locally

```bash
cd canvas
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

## Project Structure

```
canvas/src/
├── App.jsx                  # Phase state machine, transitions, layout
├── components/
│   ├── GenerativeCanvas.jsx # Bar spawning, rAF loop, canvas rendering
│   ├── SoundEngine.js       # Web Audio synthesis, reverb chain
│   ├── ActLabel.jsx         # Dataset + year label (top left)
│   ├── IncidentCounter.jsx  # Cumulative incident counter
│   ├── About.jsx            # Modal with legend, sources, context
│   └── SoundToggle.jsx      # Enable/disable audio
└── data/
    ├── fbiData.js           # FBI UCR 1993–2024, offense palette
    └── sahData.js           # STOP AAPI Hate 2020–2024, offense palette
```

---

## Interaction

The piece moves through five states:

1. **Press any key to start** — blank screen
2. **FBI UCR** — runs 1993–2024 at 6 seconds/year (~3 min 12 sec)
3. **Press any key to continue** — blank screen
4. **STOP AAPI Hate** — runs 2020–2024 at 6 seconds/year (~30 sec)
5. **Press any key to restart** — blank screen, loops to FBI

All transitions are fade-based (2s). Sound must be enabled manually due to
browser autoplay policy.
