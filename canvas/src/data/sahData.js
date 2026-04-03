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

// Weighted palette: colors run red (violent/physical) → cool (non-physical)
// Weights based on STOP AAPI Hate 2020-2021 report proportions.
const OFFENSE_PALETTE = [
  { key: 'verbal_harassment', color: '#3E8A9E', weight: 0.600 }, // teal — most common, non-physical
  { key: 'physical_assault',  color: '#CC1818', weight: 0.152 }, // crimson — violent
  { key: 'avoidance',         color: '#7B8FA0', weight: 0.152 }, // cool grey-blue
  { key: 'civil_rights',      color: '#59895A', weight: 0.049 }, // sage green
  { key: 'online_harassment', color: '#2E6BAF', weight: 0.028 }, // slate blue
  { key: 'property_damage',   color: '#B06030', weight: 0.019 }, // warm brown
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
  const counts = Object.values(YEAR_DATA).filter(c => c > 0)
  return counts[Math.floor(Math.random() * counts.length)]
}

export function getYearCount(year) {
  return YEAR_DATA[year] ?? 0
}

