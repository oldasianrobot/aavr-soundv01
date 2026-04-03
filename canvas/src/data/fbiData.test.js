import { describe, it, expect } from 'vitest'
import {
  sampleOffense,
  sampleIncidentCount,
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

describe('sampleIncidentCount', () => {
  it('returns a positive integer', () => {
    const count = sampleIncidentCount()
    expect(count).toBeGreaterThan(0)
    expect(Number.isInteger(count)).toBe(true)
  })
})

describe('getYearCount', () => {
  it('returns incident count for a known year', () => {
    expect(getYearCount(2021)).toBe(781)
    expect(getYearCount(2023)).toBe(441)
  })
  it('returns 0 for the 1994 gap year', () => {
    expect(getYearCount(1994)).toBe(0)
  })
  it('returns 0 for a year outside the dataset', () => {
    expect(getYearCount(1990)).toBe(0)
  })
})

describe('FBI_YEARS', () => {
  it('spans 1993 to 2024', () => {
    expect(FBI_YEARS[0]).toBe(1993)
    expect(FBI_YEARS[FBI_YEARS.length - 1]).toBe(2024)
  })
})
