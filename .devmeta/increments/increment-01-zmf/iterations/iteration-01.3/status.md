# Iteration 01.3 Status

**Started:** 2026-08-13
**Status:** In Progress
**Iteration tick:** `etg`
**Base branch:** `2026-08-13-devmeta-deck`
**Work branch:** `feature/2026-08-13-deck-theme-motion`

**Final iteration of Increment 01-zmf.** Its I&A cycle closes the increment and
`/devmeta:go` stops.

## Features

| Feature | ID | Tasks | Status | Depends On |
|---------|----|-------|--------|-----------|
| Theme | `0la` | 2 | **Complete** | — |
| Motion — problem and model | `38s` | 2 | Not started | Theme |
| Motion — commands and example | `iul` | 2 | Not started | Theme |
| Motion — setup and title | `66m` | 2 | Not started | Theme |
| Layout and overflow | `q43` | 4 | Not started | all three motion features |

## Feature Independence Map

```
              [Theme]
        ┌────────┼────────┐
      [M1]     [M2]     [M3]        ← wave 2, three in parallel
        └────────┼────────┘
       [Layout and overflow]         ← wave 3, alone
```

**Narrow → wide → narrow, not a wide fan-out.** I&A cycle 01.2R called this before
planning started, and it is the reason the shape differs from 01.1 and 01.2:

- A theme change is global. It touches `slides.md` and changes how all 19 slides render.
  It cannot run beside anything.
- The layout pass judges slides against each other. Whether a deck is over-animated is
  not a per-file question.

Only wave 2 is parallel, and only three wide, because the motion work does divide by
file.

## Scope added this iteration

`npm run layout` — an automated overflow check. "No slide overflows its frame at 16:9" is
the increment's last exit criterion that can only be checked by looking, and this project
has twice turned that class of criterion into an exit code (`npm run slides` in 01.1,
`npm run diagrams` in 01.2). Both caught real defects. Adding a theme and motion is
exactly the change most likely to cause overflow.

Scope grew; nothing was cut.

## Carried forward

- **Slide 4 is the overflow risk.** Heading plus a diagram that already fills the frame.
  Its bullets were removed in 01.2 for precisely this reason. If a stepped build does not
  fit there, leaving it un-animated is the correct call.
- **Negative-test every new check.** `npm run diagrams` was proven by breaking a diagram
  on purpose and watching the build stay green while the check went red. `npm run layout`
  gets the same treatment.
- **Verification code must fail loudly.** The I&A cycle found a fallback selector in
  `verify-diagrams.mjs` that could have passed a missing diagram. No fallbacks.
- Git model unchanged: one work branch, coordinator commits, workers build to their own
  `--out` directory.

## Notes

- Theme is the Theme feature's call, constrained by the plan: must install as an npm
  package, render all three Mermaid diagrams unclipped, and need no slide rewrites.
  `@slidev/theme-seriph` is the recommended default.
