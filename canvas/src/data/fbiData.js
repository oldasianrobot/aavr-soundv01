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
