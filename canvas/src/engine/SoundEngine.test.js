import { describe, it, expect, vi, beforeEach } from 'vitest'
import SoundEngine from './SoundEngine.js'

// Mock Web Audio API
const mockOscillator = {
  type: '',
  frequency: { setValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
}
const mockGain = {
  gain: {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  disconnect: vi.fn(),
}
const mockContext = {
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({ ...mockGain })),
  destination: {},
  currentTime: 0,
  state: 'running',
  resume: vi.fn(),
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', class {
    constructor() {
      Object.assign(this, mockContext)
    }
  })
  mockContext.createOscillator.mockClear()
  mockContext.createGain.mockClear()
  SoundEngine._reset()
})

describe('SoundEngine', () => {
  it('starts muted by default', () => {
    expect(SoundEngine.isMuted).toBe(true)
  })

  it('unmute / mute toggles isMuted', () => {
    SoundEngine.unmute()
    expect(SoundEngine.isMuted).toBe(false)
    SoundEngine.mute()
    expect(SoundEngine.isMuted).toBe(true)
  })

  it('playTone does not call AudioContext when muted', () => {
    SoundEngine.init()
    SoundEngine.playTone('intimidation', 'fbi')
    expect(mockContext.createOscillator).not.toHaveBeenCalled()
  })

  it('playTone creates oscillator when unmuted', () => {
    SoundEngine.init()
    SoundEngine.unmute()
    SoundEngine.playTone('intimidation', 'fbi')
    expect(mockContext.createOscillator).toHaveBeenCalled()
  })

  it('getToneParams returns correct params for known keys', () => {
    expect(SoundEngine.getToneParams('murder', 'fbi')).toEqual({ wave: 'sawtooth', freq: 1800 })
    expect(SoundEngine.getToneParams('intimidation', 'fbi')).toEqual({ wave: 'sine', freq: 440 })
    expect(SoundEngine.getToneParams('verbal_harassment', 'sah')).toEqual({ wave: 'sine', freq: 440 })
    expect(SoundEngine.getToneParams('physical_assault', 'sah')).toEqual({ wave: 'sawtooth', freq: 1400 })
  })
})
