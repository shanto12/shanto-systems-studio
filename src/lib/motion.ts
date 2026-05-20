export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function formatDensity(value: number) {
  if (value < 34) return 'calm'
  if (value > 76) return 'cinematic'
  return 'balanced'
}
