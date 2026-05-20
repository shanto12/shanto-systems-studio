import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn(() => Promise.resolve()),
})

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
  })),
  configurable: true,
})

window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16))
window.cancelAnimationFrame = vi.fn((id: number) => window.clearTimeout(id))
