# Architecture

This is a static-first React/Vite motion site with one Netlify Function for release status.

## Runtime Boundaries

- Browser: React UI, CSS animation, local state, videos, decorative canvas.
- Netlify Function: `/api/health`, non-sensitive runtime metadata only.
- No browser-side API keys.
- No external API calls required for normal operation.

## Motion System

- Paired local MP4 backgrounds emulate the tutorial's animated still-image workflow.
- The hero split uses `clip-path` and a draggable control.
- Workflow and system map animations are CSS-based.
- `prefers-reduced-motion` and the visible Motion control disable long transforms and video reliance.
