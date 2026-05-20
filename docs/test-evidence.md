# Test Evidence

Last local verification: May 20, 2026 5:04 PM CT.
Last live verification: May 20, 2026 5:06 PM CT.

Production URL: https://shanto-systems-studio.netlify.app
Netlify site ID: `94df3053-8d3b-4954-ba5f-09b7a213e2da`
Production deploy ID: `6a0e2fef7c310b187e3a8c37`
Production build ID: `6a0e2fee7c310b187e3a8c35`

## Evidence Matrix

| Requirement | Status | Evidence |
| --- | --- | --- |
| Deployed Netlify URL tested, not just localhost | Verified | `npm run verify:prod` against `https://shanto-systems-studio.netlify.app` passed 9/9. `curl -D -` returned HTTP 200 for `/`. |
| Real Chrome profile final pass | Verified | Computer Use drove the running Google Chrome app/profile on the production URL. Clicked nav, theme/motion toggles, walkthrough, workflow controls, systems filters/nodes, evidence filter, and Demo Guide. Screenshot: `docs/evidence/real-chrome-profile-pass.png`. |
| Every visible primary control clicked | Verified | Production Playwright clicked nav links, hero buttons, theme/motion toggles, all workflow tabs, pause/replay/next, all systems filters, all systems nodes, all timeline filters, previous/next proof controls, Motion Lab sliders, checkbox, reset, and health request. Real Chrome covered the main manual pass. |
| Auth, logout/login, password manager if relevant | N/A | No auth, login, payment, form submission, password storage, or account state in this static demo. |
| API calls, backend/runner jobs, task completion | Verified | `curl https://shanto-systems-studio.netlify.app/api/health` returned `status: ok`; Netlify deploy reports 1 function deployed with `/api/health` route. |
| Desktop and mobile layouts | Verified | Local and production Playwright screenshots generated for desktop and mobile. No horizontal overflow assertion failures. |
| Console errors and failed network requests | Verified | Playwright failure collector ran in local and production tests; production run passed 9/9 with no console error, pageerror, failed request, or same-origin HTTP 400+ failure. |
| Security headers and CSP | Verified | Production headers include CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`. CSP allows only self-hosted scripts/assets plus inline style attributes needed by React motion controls. |
| Production npm audit | Verified | `npm audit --omit=dev --audit-level=moderate` returned `found 0 vulnerabilities`. |

## Local Gates

- `npm audit --omit=dev --audit-level=moderate`: 0 vulnerabilities.
- `npm run verify:release`: passed.
- `eslint .`: passed.
- `tsc -b --noEmit`: passed.
- `vitest run`: 1 file, 3 tests passed.
- `vite build`: passed.
- Local Playwright: 6 passed, 3 production-only header checks skipped.

## Live Netlify Verification

- Netlify deploy state: ready.
- Deploy context: production.
- Deploy time: 21 seconds.
- Available functions: `health`.
- `curl /`: HTTP 200.
- `curl /api/health`: `status: ok`, `mode: static-motion-demo`, `provider: none`.
- `curl -I /assets/shanto-linkedin.jpg`: HTTP 200, `content-type: image/jpeg`, immutable cache.
- `curl -I /assets/hero-dark-motion.mp4`: HTTP 200, `content-type: video/mp4`, immutable cache.
- Production Playwright: 9 passed across desktop, mobile, and narrow projects.

## Visual Evidence

- Accepted concept: `docs/concepts/shanto-systems-studio-concept.png`
- Hero dark asset: `public/assets/hero-dark.jpg`
- Hero light asset: `public/assets/hero-light.jpg`
- LinkedIn profile photo: `public/assets/shanto-linkedin.jpg`
- Local desktop screenshot: `docs/evidence/local-desktop.png`
- Local mobile screenshot: `docs/evidence/local-mobile.png`
- Production desktop screenshot: `docs/evidence/production-desktop.png`
- Production mobile screenshot: `docs/evidence/production-mobile.png`
- Real Chrome profile screenshot: `docs/evidence/real-chrome-profile-pass.png`
