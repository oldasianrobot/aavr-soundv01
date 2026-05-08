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
const mockFilter = {
  type: '',
  frequency: { value: 0 },
  Q: { value: 0 },
  connect: vi.fn(),
}
const mockConvolver = {
  buffer: null,
  connect: vi.fn(),
}
const mockContext = {
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({ ...mockGain })),
  createBiquadFilter: vi.fn(() => ({ ...mockFilter })),
  createConvolver: vi.fn(() => ({ ...mockConvolver })),
  createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array(100)) })),
  destination: {},
  currentTime: 0,
  sampleRate: 44100,
  state: 'running',
  resume: vi.fn(),
  close: vi.fn(),
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', class {
    constructor() {
      Object.assign(this, mockContext)
    }
  })
  mockContext.createOscillator.mockClear()
  mockContext.createGain.mockClear()
  mockContext.createBiquadFilter.mockClear()
  mockContext.createConvolver.mockClear()
  mockContext.createBuffer.mockClear()
  mockContext.close.mockClear()
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

  it('evicts oldest voice when MAX_VOICES (8) is exceeded', () => {
    SoundEngine.init()
    SoundEngine.unmute()
    for (let i = 0; i < 8; i++) {
      SoundEngine.playTone('intimidation', 'fbi')
    }
    expect(SoundEngine._voices.length).toBe(8)
    SoundEngine.playTone('intimidation', 'fbi')
    expect(SoundEngine._voices.length).toBe(8)
  })

  it('_reset closes AudioContext to prevent leaks', () => {
    SoundEngine.init()
    SoundEngine._reset()
    expect(mockContext.close).toHaveBeenCalled()
  })
})
