import { useRef, useCallback, useEffect } from 'react'
import { useIntro } from '../IntroContext'

const ACtx = typeof AudioContext !== 'undefined' ? AudioContext : null

function createOsc(ctx, type, freq, start, dur, gain = 0.12) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, start)
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(gain, start + 0.03)
  g.gain.linearRampToValueAtTime(0, start + dur)
  o.connect(g)
  g.connect(ctx.destination)
  o.start(start)
  o.stop(start + dur)
}

function createNoise(ctx, start, dur, gain = 0.03) {
  const len = ctx.sampleRate * dur
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const s = ctx.createBufferSource()
  s.buffer = buf
  const g = ctx.createGain()
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 600
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(gain, start + 0.05)
  g.gain.linearRampToValueAtTime(0, start + dur)
  s.connect(f)
  f.connect(g)
  g.connect(ctx.destination)
  s.start(start)
}

export function useIntroAudio() {
  const ctxRef = useRef(null)
  const { isMuted } = useIntro()

  const getCtx = useCallback(() => {
    if (!ACtx) return null
    if (!ctxRef.current) ctxRef.current = new ACtx()
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const playHeartbeat = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'sine', 40, t, 0.15, 0.2)
    createOsc(c, 'sine', 50, t + 0.15, 0.12, 0.15)
    createNoise(c, t, 0.08, 0.04)
  }, [isMuted, getCtx])

  const playParticleBirth = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'sine', 200, t, 0.3, 0.06)
    createOsc(c, 'sine', 400, t + 0.05, 0.2, 0.04)
  }, [isMuted, getCtx])

  const playDataFlow = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    for (let i = 0; i < 5; i++) {
      createOsc(c, 'sine', 300 + i * 100, t + i * 0.06, 0.1, 0.03)
    }
  }, [isMuted, getCtx])

  const playNeuralPulse = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'sawtooth', 100, t, 0.2, 0.04)
    createOsc(c, 'sine', 600, t + 0.05, 0.15, 0.03)
    createNoise(c, t, 0.1, 0.02)
  }, [isMuted, getCtx])

  const playBlueprint = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'square', 1200, t, 0.03, 0.04)
    createOsc(c, 'square', 1400, t + 0.04, 0.03, 0.03)
    createOsc(c, 'sine', 800, t + 0.08, 0.1, 0.03)
  }, [isMuted, getCtx])

  const playScanPulse = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(200, t)
    o.frequency.linearRampToValueAtTime(1200, t + 0.4)
    g.gain.setValueAtTime(0.04, t)
    g.gain.linearRampToValueAtTime(0, t + 0.4)
    o.connect(g); g.connect(c.destination)
    o.start(t); o.stop(t + 0.4)
  }, [isMuted, getCtx])

  const playRelayClick = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    createNoise(c, c.currentTime, 0.02, 0.08)
    createOsc(c, 'square', 2500, c.currentTime, 0.01, 0.04)
  }, [isMuted, getCtx])

  const playPowerOn = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'sine', 150, t, 0.2, 0.08)
    createOsc(c, 'sine', 300, t + 0.1, 0.15, 0.06)
    createOsc(c, 'sine', 600, t + 0.2, 0.2, 0.05)
    createNoise(c, t, 0.25, 0.05)
  }, [isMuted, getCtx])

  const playWhoosh = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(80, t)
    o.frequency.exponentialRampToValueAtTime(2500, t + 0.6)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.12, t + 0.1)
    g.gain.linearRampToValueAtTime(0, t + 0.7)
    o.connect(g); g.connect(c.destination)
    o.start(t); o.stop(t + 0.7)
    createNoise(c, t, 0.5, 0.06)
  }, [isMuted, getCtx])

  const playDigitalChime = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    createOsc(c, 'sine', 523, t, 0.15, 0.05)
    createOsc(c, 'sine', 659, t + 0.1, 0.15, 0.04)
    createOsc(c, 'sine', 784, t + 0.2, 0.2, 0.03)
  }, [isMuted, getCtx])

  const playAmbientDrone = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(55, t)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.03, t + 1)
    g.gain.linearRampToValueAtTime(0, t + 3)
    o.connect(g); g.connect(c.destination)
    o.start(t); o.stop(t + 3)
  }, [isMuted, getCtx])

  const playKeystroke = useCallback(() => {
    if (isMuted) return
    const c = getCtx(); if (!c) return
    createOsc(c, 'square', 700 + Math.random() * 500, c.currentTime, 0.03, 0.03)
    createNoise(c, c.currentTime, 0.02, 0.02)
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
    playHeartbeat,
    playParticleBirth,
    playDataFlow,
    playNeuralPulse,
    playBlueprint,
    playScanPulse,
    playRelayClick,
    playPowerOn,
    playWhoosh,
    playDigitalChime,
    playAmbientDrone,
    playKeystroke,
  }
}
