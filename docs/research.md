# Research

Date: 2026-05-20 CDT.

## Referenced Tutorial

Source: `https://x.com/viktoroddy/status/2057128809930104864?s=46`.

The post describes a 25-minute tutorial for making animated websites with Google AI Studio and Gemini 3.5 Flash. I used the public post metadata and the attached video to extract the workflow without copying the tutorial transcript.

## Practical Workflow Extracted

1. Start with a strong visual reference from motion-site galleries or visual inspiration boards.
2. Extract only the useful design system details: palette, typography, hero composition, nav, background style, card style, and motion feel.
3. Generate or clean up a high-resolution still image.
4. Create a matching second state, usually dark mode and light/day mode.
5. Build the first hero in Google AI Studio/Gemini, keeping the background pure and avoiding unwanted overlays.
6. Add a bottom blur or edge blend so the hero feels cinematic.
7. Add the second image and wire a day/night toggle.
8. Animate both still images with image-to-video tools, using a reference motion clip when available.
9. Replace static image backgrounds with locally hosted videos.
10. Fix non-seamless loops with a forward/reverse boomerang playback pattern.
11. Build the rest of the page as a draft, then improve section by section with human direction.
12. Verify mobile and capture a live scrolling screen recording for social proof.

## Tools Observed Or Named

- Google AI Studio
- Gemini 3.5 Flash / Gemini 3.5
- Claude
- Motionsites.ai / DesignRocket
- Higgsfield AI
- GPT Image 2
- Nano Banana 2
- Seedance 2 / Seedance 2.0
- Kling 3.0
- Pinterest
- Vite, React, TypeScript, Tailwind CSS, lucide-react

## How This Demo Applies It

This app follows the pattern without copying the tutorial site:

- Paired `hero-dark` and `hero-light` media states.
- Locally generated and hosted `hero-dark-motion.mp4` and `hero-light-motion.mp4`.
- Code-native day/night transition controls.
- Liquid-glass nav and action controls.
- Section-by-section motion surfaces: workflow loop, systems map, proof timeline, motion lab, and demo guide.
- No browser-side model keys.
