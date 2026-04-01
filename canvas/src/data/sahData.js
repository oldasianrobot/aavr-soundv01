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
  { key: 'verbal_harassment', color: '#E8C5B8', weight: 0.600 }, // 60% — dusty rose
  { key: 'physical_assault',  color: '#C4704A', weight: 0.152 }, // 15.2% — terracotta
  { key: 'avoidance',         color: '#7B9BB5', weight: 0.152 }, // 15.2% — slate blue
  { key: 'civil_rights',      color: '#9EB5C4', weight: 0.049 }, // 4.9% — soft blue
  { key: 'online_harassment', color: '#D4A8A0', weight: 0.028 }, // 2.8% — muted rose
  { key: 'property_damage',   color: '#B8A898', weight: 0.019 }, // 1.9% — warm gray
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
