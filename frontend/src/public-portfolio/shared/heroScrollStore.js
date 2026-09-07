/**
 * Simple global store for scroll progress that the 3D scene can read.
 * Updated by the Hero component's RAF loop, read by SceneContent's useFrame.
 */

let _heroProgress = 0

export function setHeroScrollProgress(value) {
  _heroProgress = value
}

export function getHeroScrollProgress() {
  return _heroProgress
}
