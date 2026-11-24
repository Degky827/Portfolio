import { flushSync } from 'react-dom'

let isTransitioning = false

/**
 * Triggers a fluid circular wave transition across the viewport when switching theme mode.
 *
 * @param {Object} options
 * @param {MouseEvent|TouchEvent|Object} [options.event] Click or touch event from the toggle button
 * @param {boolean} options.nextDarkMode Whether the new mode is dark mode
 * @param {function} options.onApply Callback to synchronously apply the new theme state and DOM class
 */
export function triggerThemeWave({ event, nextDarkMode, onApply }) {
  if (isTransitioning) return
  isTransitioning = true

  const resetTransition = () => {
    isTransitioning = false
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-transitioning')
    }
  }

  // 1. Calculate origin coordinates from the click event or toggle button
  let x = window.innerWidth / 2
  let y = 60

  if (event) {
    if (typeof event.clientX === 'number' && typeof event.clientY === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
      x = event.clientX
      y = event.clientY
    } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
      const rect = event.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }
  }

  // Maximum radius to guarantee the wave fully covers all screen corners
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // 2. Spawn luminous wave ripple rings on top of the screen
  createWaveRipples(x, y, endRadius, nextDarkMode)

  // 3. View Transitions API (Chrome 111+, Edge 111+, Safari 18+)
  const supportsViewTransition =
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (supportsViewTransition) {
    document.documentElement.classList.add('theme-transitioning')

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          onApply(nextDarkMode)
        })
      })

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ]
          const anim = document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration: 720,
              easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )

          anim.onfinish = resetTransition
          anim.oncancel = resetTransition
        })
        .catch(resetTransition)

      transition.finished.finally(resetTransition)
      return
    } catch (err) {
      console.warn('[ThemeWave] View transition failed, falling back:', err)
      resetTransition()
    }
  }

  // 4. Fallback for browsers without View Transitions (e.g. Firefox)
  createFallbackWave(x, y, endRadius, nextDarkMode, onApply, resetTransition)
}

function createWaveRipples(x, y, endRadius, nextDarkMode) {
  if (typeof document === 'undefined') return

  const container = document.createElement('div')
  container.className = 'theme-wave-ripples'
  container.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100000;
    overflow: hidden;
  `

  const waveColor = nextDarkMode ? 'rgba(108, 43, 255, 0.85)' : 'rgba(245, 158, 11, 0.85)'
  const glowColor = nextDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(251, 191, 36, 0.5)'

  // 2 staggered ripple rings for organic water wave crest appearance
  ;[0, 100].forEach((delay, idx) => {
    const ring = document.createElement('div')
    ring.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0px;
      height: 0px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      border: ${idx === 0 ? '3px' : '1.5px'} solid ${waveColor};
      box-shadow: 0 0 35px 8px ${glowColor}, inset 0 0 15px 3px ${glowColor};
      pointer-events: none;
      will-change: width, height, opacity;
    `
    container.appendChild(ring)

    ring.animate(
      [
        { width: '0px', height: '0px', opacity: 0.95 },
        { width: `${endRadius * 2.2}px`, height: `${endRadius * 2.2}px`, opacity: 0 },
      ],
      {
        duration: 750,
        delay,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'forwards',
      }
    )
  })

  document.body.appendChild(container)
  setTimeout(() => {
    container.remove()
  }, 950)
}

function createFallbackWave(x, y, endRadius, nextDarkMode, onApply, onDone) {
  const overlay = document.createElement('div')
  const bgColor = nextDarkMode ? '#080b14' : '#ffffff'
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 99999;
    background-color: ${bgColor};
    clip-path: circle(0px at ${x}px ${y}px);
    will-change: clip-path, opacity;
  `
  document.body.appendChild(overlay)

  const animation = overlay.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 },
      { clipPath: `circle(${endRadius}px at ${x}px ${y}px)`, opacity: 1 },
    ],
    {
      duration: 600,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      fill: 'forwards',
    }
  )

  animation.onfinish = () => {
    onApply(nextDarkMode)
    const fadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      fill: 'forwards',
    })
    fadeOut.onfinish = () => {
      overlay.remove()
      onDone()
    }
  }

  animation.oncancel = () => {
    overlay.remove()
    onDone()
  }
}
