import { useState, useEffect, useRef, useCallback } from 'react'

export function useTypewriter(text, speed = 40, delay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayed('')
      setIsComplete(false)
      indexRef.current = 0
      return
    }

    const startTimeout = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (indexRef.current <= text.length) {
          setDisplayed(text.slice(0, indexRef.current))
          indexRef.current++
        } else {
          clearInterval(timerRef.current)
          setIsComplete(true)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speed, delay, enabled])

  const reset = useCallback(() => {
    indexRef.current = 0
    setDisplayed('')
    setIsComplete(false)
  }, [])

  return { displayed, isComplete, reset }
}

export function useSequentialTypewriter(lines, speed = 35, lineDelay = 200) {
  const [completedLines, setCompletedLines] = useState([])
  const [currentLineIndex, setCurrentLineIndex] = useState(-1)
  const [currentText, setCurrentText] = useState('')
  const [allComplete, setAllComplete] = useState(false)
  const charIndexRef = useRef(0)
  const timerRef = useRef(null)

  const start = useCallback(() => {
    setCurrentLineIndex(0)
    setCompletedLines([])
    setCurrentText('')
    charIndexRef.current = 0
    setAllComplete(false)
  }, [])

  useEffect(() => {
    if (currentLineIndex < 0 || currentLineIndex >= lines.length) {
      if (currentLineIndex >= lines.length) setAllComplete(true)
      return
    }

    const line = lines[currentLineIndex]
    charIndexRef.current = 0
    setCurrentText('')

    const lineTimer = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (charIndexRef.current <= line.text.length) {
          setCurrentText(line.text.slice(0, charIndexRef.current))
          charIndexRef.current++
        } else {
          clearInterval(timerRef.current)
          setCompletedLines((prev) => [...prev, { ...line, complete: true }])
          setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1)
            setCurrentText('')
          }, lineDelay)
        }
      }, speed)
    }, line.delay || 0)

    return () => {
      clearTimeout(lineTimer)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentLineIndex, lines, speed, lineDelay])

  return { completedLines, currentLineIndex, currentText, allComplete, start }
}
