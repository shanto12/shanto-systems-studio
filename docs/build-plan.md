# Build Plan

## App

- `src/App.tsx`: page composition and local state.
- `src/data/studio.ts`: workflow stages, system nodes, proof timeline, release checklist.
- `src/lib/motion.ts`: small motion helpers.
- `src/index.css`: design system, layout, responsive rules, animation, reduced-motion mode.
- `public/assets`: paired hero images and motion videos.

## Netlify

- `netlify/functions/health.mjs`: status endpoint.
- `netlify.toml`: build, SPA fallback, API redirect, security headers, immutable asset caching.

## Tests

- Vitest: render/control behavior.
- Playwright: desktop/mobile layout, every primary control, media presence, health endpoint, production headers.
- Production evidence: screenshots and evidence matrix in `docs/test-evidence.md`.
