# Mutethia — Kinetic Portfolio · Sunset Edition

The original Kinetic portfolio layout restored with a sunset vermilion/red editorial hero and deep-plum, gold, cyan, rose and violet palette. Keeps the 3D orbital canvas hero, autoplay/manual project slideshow, interactive 3D browser cards, four case studies, scroll reveals, accessible navigation and mobile support. The spine-and-staircase experience is intentionally removed.

## Run locally

No build tools, secrets, package manager, or backend are required. Run `python3 -m http.server 8080` from this directory and visit `http://localhost:8080`. Use any static host such as Vercel.

## Real project screenshot provenance

- SentinelX: actual screenshot of the user-owned SentinelX Clarity **interface prototype**, not a capture of the private original production system. Example data.
- Farm Mtaani: dynamic public website screenshot via Thum.io. Availability is not guaranteed; a truthful fallback is shown on failure. No private user screens.
- PhoneHub: actual user-owned PhoneHub Preview **frontend prototype**, not the latest secure development branch.
- Realtor: actual Home Harmony Hub design prototype used as Realtor's visual design baseline, not a production deployed system.

All screenshot URLs are in `app.js` and in their associated `work/*/index.html` pages. Replace with approved first-party screenshot files for best performance, especially before a formal portfolio launch.

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

Source repository: [Mutethia-glitch/portfolio](https://github.com/Mutethia-glitch/portfolio). The files are at the repository root. For deployment, import this repository into Vercel using the **Other** framework preset, without a build command; the static site and `vercel.json` are deployment-ready. Keep preview and production deployments separate until verified.

## Theme / restoration

- Base: original GitHub Kinetic portfolio source from commit `22e17a0`.
- `sunset-theme.css` applies new colors and corrected clamp typography without changing original sections.
- `app.js` is the original interactive script, with colors of the 3D hero orb updated for the sunset palette.
- The spine-specific script, section and assets are not part of this restored version.
- Social-cover SVG and PNG and SEO URLs match the new palette and active Vercel domain.
