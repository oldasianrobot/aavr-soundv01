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
