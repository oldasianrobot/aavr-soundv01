// Annual incident counts indexed by year. 0 = no data (gap year).
// Source: FBI UCR Hate Crime Statistics, Table 1 (Anti-Asian). 1993–2024.
// 1994 = n/a (not collected that year).
const YEAR_DATA = {
  1993: 258, 1994:   0,
  1995: 355, 1996: 355, 1997: 347, 1998: 293, 1999: 298,
  2000: 281, 2001: 280, 2002: 217, 2003: 231, 2004: 217, 2005: 199,
  2006: 181, 2007: 188, 2008: 137, 2009: 126, 2010: 150,
  2011: 138, 2012: 121, 2013: 135, 2014: 140, 2015: 111,
  2016: 113, 2017: 131, 2018: 148, 2019: 158,
  2020: 358, 2021: 781, 2022: 531, 2023: 441, 2024: 336,
}

export const FBI_YEARS = Object.keys(YEAR_DATA).map(Number)
const MIN_COUNT = 111
const MAX_COUNT = 781

// Weighted offense palette: colors run red (violent felony) → cool (non-violent misdemeanor)
const OFFENSE_PALETTE = [
  { key: 'murder',             color: '#B81C1C', weight: 0.005 }, // deep crimson
  { key: 'aggravated_assault', color: '#D63B00', weight: 0.13  }, // red-orange
  { key: 'robbery',            color: '#E05500', weight: 0.005 }, // orange-red
  { key: 'arson',              color: '#D97000', weight: 0.005 }, // burnt orange
  { key: 'simple_assault',     color: '#B89000', weight: 0.24  }, // amber — mid severity
  { key: 'intimidation',       color: '#59895A', weight: 0.355 }, // sage green
  { key: 'vandalism',          color: '#3E8A9E', weight: 0.27  }, // teal
  { key: 'burglary',           color: '#2E6BAF', weight: 0.005 }, // slate blue
  { key: 'larceny',            color: '#1A4F8A', weight: 0.005 }, // deep blue
  { key: 'motor_vehicle_theft',color: '#4A3584', weight: 0.005 }, // indigo
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

