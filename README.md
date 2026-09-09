# Brodie — Seasons hero → carousel

Scroll-driven prototype for the "12 Months. 4 Seasons." section: the full-bleed hero scales down into the centre card of a looping four-season carousel (Apple TV-style), with paddles, arrow keys, swipe, and side-card taps to cycle.

- `index.html` — test harness. The Webflow-ready block sits between `<!-- SSC:START -->` and `<!-- SSC:END -->`.
- `assets/` — season photos (Figma exports, 2400px) and the four season badges (SVG).

Tunables live at the top of the `.ssc` CSS (`--ssc-card-pct`, `--ssc-gap`, `--ssc-radius`, `--ssc-peek-dim`, …) and at the top of the script (`PIN_DISTANCE`, `SCRUB`, `SLIDE_DUR`, timeline positions in `buildTimeline()`). Append `?p=0.5&debug` to the URL to freeze the transition at 50%.

Requires GSAP 3 + ScrollTrigger (loaded from cdnjs by the block itself; shares one copy with the Ways To Play blocks).
