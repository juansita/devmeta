# Shared Context Log — layout-overflow

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- Read the three motion context logs before changing anything. They record deliberate
  decisions not to animate, which must not be undone by accident.
- `verify-diagrams.mjs` is the reference implementation for headless checks. The I&A
  cycle hardened it: no fallback selectors, derive from source, wait rather than sleep.
- Negative-test any check you write, immediately.

---

## Increment exit criteria — final confirmation

Every criterion in `_overview.md` executed, with evidence. Recorded there as checked, and
here as the evidence trail.

| # | Criterion | Result |
|:-:|-----------|--------|
| 1 | build exits 0 | `npm run build` → **0** |
| 2 | 15-20 slides | `npm run slides` → **19** |
| 3 | every concept on a slide | **15 of 15 present** — coverage table in `_overview.md` |
| 4 | 3+ diagrams render | `npm run diagrams` → **0**, live SVG read from each shadow root |
| 5 | theme is not `default` | **`seriph`** |
| 6 | 5+ slides with reveals | **13** |
| 7 | no slide overflows at 16:9 | `npm run layout` → **0**, all 19 at every click state |
| 8 | all tests pass | four checks, all exit 0 |
| 9 | living docs updated | history, lessons, 3 I&A reports, context logs, `CLAUDE.md` |

**Criterion 3 was checked by parsing, not by reading.** Each concept was matched against
every slide's source, and the slide numbers recorded. That criterion is the one that
regressed silently in 01.2 when slide 4's bullets were removed, so it does not get an
eyeball.

**Criterion 6 exceeds its floor by a wide margin** (13 against a required 5). That is not
padding: it is the result of three features judging their own slides rather than animating
to a quota, and six slides being deliberately left static.

## Motion balance — reviewed, no changes made

Three features animated independently. Measured across the whole deck:

| | |
|---|---|
| Animated | 13 of 19 slides |
| Static | 6 of 19 |
| Longest static run | 2 slides (13-14) |
| Longest animated run | 5 slides (15-19) |
| Click steps | 66 total, 1 to 6 per slide |

**Verified independently rather than trusted.** `npm run layout` reports a click-state
count per slide as a side effect. Slides 4, 6, 10, 13 and 14 report exactly 1 state,
which is what a deliberately static slide looks like from the outside. That matches the
three motion context logs exactly — no worker over-reported what it did.

**Every reveal uses the opacity-based default.** No `v-click.hide` anywhere. That matters
beyond style: `.hide` removes the box, which would let a slide fit at click 0 and
overflow later. The layout check covers every click state regardless, but the invariant is
worth keeping.

### Judgement: leave the motion as delivered

The obvious temptation in a balance pass is to make a change to justify the pass. There
is no change here worth making:

- **The alternation is deliberate and it works.** Longest static run is 2, longest
  animated run is 5. Statics fall on slides that lead with a diagram or a code block —
  4, 10, 13, 14 — plus slide 6, which was left alone on purely editorial grounds.
- **The one at-risk pattern was already avoided.** Slides 5, 7 and 8 all carry 6-step
  builds, which would have been three near-identical animations in a row. The
  motion-model worker broke that run by leaving slide 6 static. Undoing it would create
  exactly the monotony it was avoiding.
- **The close decelerates correctly.** Slide 17 has 4 steps, 18 has 6, 19 has 1. Ending
  the deck on a single decisive reveal is right; the call to action should land, not
  crawl.
- **The commands worker offered slide 9 as the first cut** if whole-deck balance needed
  one. It does not — slides 9 and 11 are separated by a static slide 10, so there is no
  three-in-a-row run to break.

Removing a reveal here would be cosmetic churn against three sets of recorded reasoning.

## The overflow check — built and negative-tested

`slides/scripts/verify-layout.mjs`, behind `npm run layout`. Renders every slide at
1280×720 and compares each slide's content bounding box against its frame.

Patterns copied from `verify-diagrams.mjs` after the I&A cycle hardened it: slide count
derived from source rather than hardcoded, no fallback selectors, `waitForSelector`
rather than a fixed sleep, loud failure. Tolerance is 4px for subpixel rounding.

**It checks every click state, not just the first.** Slidev's default hidden state is
opacity-based, so the box is kept and layout does not reflow — but `v-click.hide` removes
the box, and a deck using it could fit at click 0 and overflow at click 3. Checking only
the base state would miss that entirely.

Two mechanics worth keeping, both found the hard way by wave-2 workers:

- The click-state URL is `/<n>?clicks=<c>`. The path form `/<n>/<c>` **404s** in a built
  deck.
- DOM queries must be scoped to `.slidev-page-N`. Slidev keeps neighbouring slides in the
  DOM, so a document-wide query measures the wrong content.

### Result on the real deck

All 19 slides fit at every click state. Worst case is slide 4 at +1px, within tolerance —
the same 1px the theme feature measured, unchanged by the motion wave.

Click-state counts confirm the motion decisions independently: slides 4, 6, 10, 13 and 14
report exactly 1 click state, which is what a deliberately static slide looks like from
the outside.

### Negative test

Fourteen long bullets pasted onto slide 19, then rebuilt:

| Command | Exit | |
|---------|:----:|---|
| `npm run build` | **0** | green, as always — this is precisely why the check exists |
| `npm run layout` | **1** | `slide 19: OVERFLOWS bottom +293px` |

Reverted from backup and verified byte-identical: `git diff` empty, zero probe lines
remaining, build and count green again.

A check nobody has seen fail is not evidence. This one has now been seen to fail.

---
