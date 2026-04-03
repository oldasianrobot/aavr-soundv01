import { describe, it, expect } from 'vitest'
import {
  sampleOffense,
  sampleIncidentCount,
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
  it('returns 0 for a year outside the dataset', () => {
    expect(getYearCount(2019)).toBe(0)
  })
})

describe('SAH_YEARS', () => {
  it('spans 2020 to 2024', () => {
    expect(SAH_YEARS[0]).toBe(2020)
    expect(SAH_YEARS[SAH_YEARS.length - 1]).toBe(2024)
  })
})

describe('sampleIncidentCount', () => {
  it('returns a positive integer from the known set', () => {
    const KNOWN = [3795, 4533, 2227, 1751, 497]
    for (let i = 0; i < 50; i++) {
      const count = sampleIncidentCount()
      expect(count).toBeGreaterThan(0)
      expect(KNOWN).toContain(count)
    }
  })
})
