import { useRef, useCallback, useEffect } from 'react'
import { useIntro } from '../IntroContext'

const AudioCtx = typeof AudioContext !== 'undefined' ? AudioContext : null

function createOscillator(ctx, type, freq, startTime, duration, gainValue = 0.15) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.05)
  gain.gain.linearRampToValueAtTime(0, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
  return { osc, gain }
}

function createNoise(ctx, startTime, duration, gainValue = 0.03) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.1)
  gain.gain.linearRampToValueAtTime(0, startTime + duration)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(startTime)
  return source
}

export function useIntroAudio() {
  const ctxRef = useRef(null)
  const { isMuted } = useIntro()

  const getCtx = useCallback(() => {
    if (!AudioCtx) return null
    if (!ctxRef.current) ctxRef.current = new AudioCtx()
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const playStartupHum = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, t)
    osc.frequency.linearRampToValueAtTime(120, t + 2)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.08, t + 0.5)
    gain.gain.linearRampToValueAtTime(0.04, t + 2)
    gain.gain.linearRampToValueAtTime(0, t + 3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 3)
  }, [isMuted, getCtx])

  const playKeystroke = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    createOscillator(ctx, 'square', 800 + Math.random() * 400, t, 0.04, 0.04)
    createNoise(ctx, t, 0.03, 0.02)
  }, [isMuted, getCtx])

  const playCheckmark = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    createOscillator(ctx, 'sine', 880, t, 0.08, 0.06)
    createOscillator(ctx, 'sine', 1100, t + 0.06, 0.1, 0.05)
  }, [isMuted, getCtx])

  const playBeep = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    createOscillator(ctx, 'sine', 600, ctx.currentTime, 0.1, 0.05)
  }, [isMuted, getCtx])

  const playScanPulse = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, t)
    osc.frequency.linearRampToValueAtTime(800, t + 0.3)
    gain.gain.setValueAtTime(0.04, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.3)
  }, [isMuted, getCtx])

  const playWhoosh = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(100, t)
    osc.frequency.exponentialRampToValueAtTime(2000, t + 0.5)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.1, t + 0.1)
    gain.gain.linearRampToValueAtTime(0, t + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.6)
    createNoise(ctx, t, 0.5, 0.06)
  }, [isMuted, getCtx])

  const playPowerOn = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    createOscillator(ctx, 'sine', 200, t, 0.15, 0.06)
    createOscillator(ctx, 'sine', 400, t + 0.1, 0.15, 0.05)
    createOscillator(ctx, 'sine', 600, t + 0.2, 0.2, 0.04)
    createNoise(ctx, t, 0.3, 0.04)
  }, [isMuted, getCtx])

  const playRelayClick = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    createNoise(ctx, ctx.currentTime, 0.02, 0.08)
    createOscillator(ctx, 'square', 2000, ctx.currentTime, 0.01, 0.04)
  }, [isMuted, getCtx])

  const playDigitalChime = useCallback(() => {
    if (isMuted) return
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    createOscillator(ctx, 'sine', 523, t, 0.15, 0.05)
    createOscillator(ctx, 'sine', 659, t + 0.1, 0.15, 0.04)
    createOscillator(ctx, 'sine', 784, t + 0.2, 0.2, 0.03)
  }, [isMuted, getCtx])

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
    }
  }, [])

  return {
    playStartupHum,
    playKeystroke,
    playCheckmark,
    playBeep,
    playScanPulse,
    playWhoosh,
    playPowerOn,
    playRelayClick,
    playDigitalChime,
  }
}
