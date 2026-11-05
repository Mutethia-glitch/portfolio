# Mutethia — Kinetic Developer Portfolio

Cinematic interactive developer portfolio with a red-orange editorial hero, a canvas-rendered orbital scene and a second procedural anatomical-style 3D spine. As visitors scroll, project cards are arranged as rotating staircase steps; connected nerve roots carry animated light pulses toward the focused project. Earlier cards recede and fade. Four case studies and a separate project archive remain accessible.

## Run locally

No build tools, secrets, package manager, or backend are required. Run `python3 -m http.server 8080` from this directory and visit `http://localhost:8080`. Use any static host such as Vercel.

## Real project screenshot provenance

- SentinelX: actual screenshot of the user-owned SentinelX Clarity **interface prototype**, not a capture of the private original production system. Example data.
- Farm Mtaani: dynamic public website screenshot via Thum.io. Availability is not guaranteed; a truthful fallback is shown on failure. No private user screens.
- PhoneHub: actual user-owned PhoneHub Preview **frontend prototype**, not the latest secure development branch.
- Realtor: actual Home Harmony Hub design prototype used as Realtor's visual design baseline, not a production deployed system.

All screenshot URLs are in `app.js` and in their associated `work/*/index.html` pages. Replace with approved first-party screenshot files for best performance, especially before a formal portfolio launch.

## The Anatomy of Work — spine experience

- `spine-experience.js` generates individually shaped vertebral bodies, discs, posterior arches and processes, a spinal cord, nerve roots and project-connected light pulses using perspective projection and layered canvas shading. This is a **creative anatomical-style 3D rendering**, not a clinical or medically precise reconstruction, and does not import/download anatomy models.
- Desktop: a 470svh scroll track with a sticky scene. Four project cards traverse a perspective staircase path; one focuses while the others move back, blur and fade. Light-up nerve branches terminate at the actual project cards.
- Mobile (<=900px): natural scrolling cards; no scroll hijacking. For `prefers-reduced-motion: reduce`, all four cards become a static accessible grid/list and decorative motion stops.
- Design theme: high-contrast sunset-orange/red hero inspired by the supplied reference, transitioning into deep indigo, pearlescent bone, cyan, gold, pink and violet.
- All canvas visuals are decorative (`aria-hidden`); every case study has a semantic text heading and standard links.

## Features / decisions

- No heavy 3D runtime dependency: a canvas renderer projects a rotating 3D spherical network and orbital rings at controlled resolution.
- Project slideshow: 8s cycle (pauses on hover/focus), arrow controls, touch-swipe support, keyboard left/right, crossfade/motion transitions, and reduced-motion disables autoplay.
- Image load fallback uses real titles, never fictionalized dashboards.
- Simple static HTML case studies permit direct links, semantic structure and page-specific SEO without JavaScript.
- No invented employment history, outcomes, traffic, revenue or personal email.

## Next improvements

Replace remote screenshots with locally licensed optimized AVIF/WebP captures, conduct real device/browser QA, add personal verified contact info and résumé, integrate accessible analytics with consent, publish under an owned domain, and use an automated accessibility/performance CI gate.

## Important

This site is a standalone portfolio upgrade because the connected Lovable workspace ran out of credits. It does not modify the Lovable project.

## GitHub and Vercel

Source repository: [Mutethia-glitch/portfolio](https://github.com/Mutethia-glitch/portfolio). Production site: [portfolio-mutethia-glitchs-projects.vercel.app](https://portfolio-mutethia-glitchs-projects.vercel.app). The files are at the repository root. For deployment, import this repository into Vercel using the **Other** framework preset, without a build command; the static site and `vercel.json` are deployment-ready. Keep preview and production deployments separate until verified.
