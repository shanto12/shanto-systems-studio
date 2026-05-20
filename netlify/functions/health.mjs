export default async () => {
  const body = {
    service: 'shanto-systems-studio',
    status: 'ok',
    mode: 'static-motion-demo',
    provider: 'none',
    model: 'local-react-css-canvas-motion',
    createdAt: '2026-05-20T16:00:00-05:00',
    localTimezone: 'America/Chicago',
    capabilities: {
      pairedHeroStates: { live: true, modes: ['night', 'day'] },
      localMotionMedia: { live: true, assets: ['hero-dark-motion.mp4', 'hero-light-motion.mp4'] },
      transitionToggle: { live: true, controls: ['day-night', 'motion-density', 'reduced-motion'] },
      workflowTabs: { live: true, stages: ['observe', 'plan', 'act', 'verify'] },
      systemsMap: { live: true, filters: ['all', 'ai', 'security', 'automation', 'frontend', 'live-ops'] },
      proofTimeline: { live: true, filters: ['all', 'ai', 'security', 'automation', 'frontend'] },
      accessibility: { live: true, features: ['keyboard-controls', 'visible-focus', 'reduced-motion-toggle', 'aria-live-status'] },
      dataPolicy: { live: true, storage: 'synthetic-only; no user data collected' },
    },
    syntheticReady: true,
    dataPolicy: 'static synthetic demo; no personal data, no external API calls from the browser',
    version:
      env('COMMIT_REF') ||
      env('NETLIFY_COMMIT') ||
      env('DEPLOY_ID') ||
      env('BUILD_ID') ||
      'local-static-demo',
  }

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export const config = { path: '/api/health' }

function env(key) {
  return globalThis.Netlify?.env?.get?.(key) || process.env[key]
}
