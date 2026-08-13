# Shared Context Log — motion-commands

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The theme landed in wave 1. Read `slides/slides.md` headmatter to see which one.
- You own your files only. Do not touch another motion feature's page files.
- Motion only. Do not rewrite prose.
- Over-animation is a defect. Leaving a slide alone is a valid, recordable decision.

---

## Motion — commands and example — done. Slides 9-16.

Motion only. No prose was changed: every edit is a `<v-clicks>` open/close pair around an
existing bullet list. No `layout:`, no per-slide `transition:` (the deck-wide `slide-left`
from wave 1 covers it), no Mermaid source touched.

**Animated — 5 of my 8 slides, one click per bullet:**

| Slide | Title | Click steps | Why |
|:-----:|-------|:-----------:|-----|
| 9 | The three you run | 5 | Enumeration of the three user-facing commands. The presenter talks to each one, and "that is the whole surface" lands as the closing beat. |
| 11 | The four it calls for you | 5 | Same shape as 9 — four commands walked through one at a time, then two caveats. Stepping 11 but not 9 (or vice versa) would be arbitrary; the pair is treated alike. |
| 12 | Do not call them yourself | 5 | The warning slide. As a wall it reads as five prohibitions at once; as a build it reads as an argument — primitive, consequence, cost, exception, the safe one. |
| 15 | Step 3 — features run | 6 | Strictly ordered narrative: Foundation alone → five at once → one file each → tasks in order → handoff → coherence last. |
| 16 | Step 4 — merge, reflect, repeat | 6 | Ordered walk through the close of the loop, ending on the increment handing back. The last beat is the deck's payoff. |

**Deliberately left alone — 3 slides:**

- **Slide 10 (`What /devmeta:go does`)** — diagram slide. The four bullets are one thought
  (what the driver is), and the loop diagram below them is the payload, not a supporting
  point. Also the rule I applied consistently: no motion markup added on either of my
  diagram slides, which keeps the slide-4 overflow lesson from being tested again.
- **Slide 13 (`Step 1 — define the scope`)** — leads with a command block; the bullets are
  the record of one interactive dialogue rather than five separate beats. Stepping the
  outcomes of a single conversation reads worse than showing them together.
- **Slide 14 (`Step 2 — /devmeta:go plans`)** — three bullets that are one thought ("you
  run it once and it plans"), plus a diagram that carries the slide. Same diagram rule as
  slide 10.

**For the layout pass (feature E):** slides 9, 11 and 12 are three stepped slides in a row
— that is the commands section and is intentional, but it is the densest run of motion in
my range if the deck ends up feeling over-animated. 15 and 16 are also adjacent. If the
whole-deck balance needs a cut, **slide 9 is the one I would drop first** (its point is
"there are only three", which a static view states more directly), then slide 15.

### Gotchas found

- **`npm run diagrams` builds into a shared `.diagram-check`.** In a parallel wave that is
  the same collision hazard as `npm run build`/`dist`. Run the underlying script against
  your own build instead:
  `node scripts/verify-diagrams.mjs <your-out-dir>` — one build then serves both checks.
- **Overflow can be measured at click 0.** Slidev's default `v-click` hide is `opacity: 0`,
  so hidden bullets still occupy their space and the layout is identical at every click
  index. No need to drive the deck to its final click state to measure height.
- **A scratchpad script cannot `import 'playwright-chromium'`** — resolution is relative to
  the script's own directory, not the cwd. Use a dynamic import of the absolute path
  `slides/node_modules/playwright-chromium/index.mjs`.
- **The `/N/<clicks>` route breaks a naive static file server.** Assets get requested
  relative to `/N/` and the SPA fallback serves `index.html` for them, so the page never
  boots. `verify-diagrams.mjs` uses bare `/N` for exactly this reason.

### Checks

```
npm run slides                                  → 19, exit 0
npx slidev build slides.md --out <own dir>      → exit 0
node scripts/verify-diagrams.mjs <own dir>      → slides 4, 10, 14 all RENDERED, exit 0
```

Click wiring verified headlessly against my own build: slides 9/11/12 carry 5 click targets
each and 15/16 carry 6, all in `slidev-vclick-hidden` at click 0 — i.e. one reveal per
bullet, in source order. Content bounding box vs frame at 1280×720 across slides 9-16: no
overflow on any edge. Tightest of mine is **slide 14 at 131px of bottom headroom** (diagram
slide, untouched); the animated slides all sit at 368px or more.

---
