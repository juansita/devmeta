# Shared Context Log — motion-model

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The theme landed in wave 1. Read `slides/slides.md` headmatter to see which one.
- You own your files only. Do not touch another motion feature's page files.
- Motion only. Do not rewrite prose.
- Over-animation is a defect. Leaving a slide alone is a valid, recordable decision.

---

## Motion — problem and model — done. Read before the layout pass.

Motion only. No prose changed, no `layout:` added, no per-slide `transition:` (the deck-wide
`slide-left` from wave 1 covers it). Files touched: `slides/pages/01-problem.md`,
`slides/pages/02-model.md`. Nothing else.

### Per-slide decisions

| Slide | Title | Animated | Clicks | Reasoning |
|:-----:|-------|:--------:|:------:|-----------|
| 2 | Agents forget | yes | 5 | Five bullets that escalate — session ends, re-explain, compaction, nothing on disk, agent drifts. The last line is the conclusion the first four earn. |
| 3 | What DevMeta adds | yes | 5 | The answering half of slide 2's setup. Lands on the two commands; revealing them last keeps the takeaway as the takeaway. |
| 4 | The hierarchy | **no** | 0 | **Deliberate. Do not animate.** Heading plus a diagram with no bullets. Its bullets were deleted in 01.2 for overflow, and the theme feature measured it at **1px of vertical headroom** under `seriph`. There is nothing to wrap in `<v-clicks>` and no room for anything new. Stepping the diagram would mean editing the Mermaid graph, which the Motion contract forbids. |
| 5 | Increment | yes | 6 | Six distinct facts closing on a rhetorical decision point ("what next?"). Benefits from arriving last. |
| 6 | Iteration | **no** | 0 | **Deliberate.** Five terse rules that are one thought: an iteration is one PR, one commit per task, no failing tests, I&A always follows. A rule-set read as a single card; stepping it turns a checklist into false suspense. Also gives the four consecutive definition slides (5-8) a static beat so the run does not become four identical builds. |
| 7 | Feature | yes | 6 | The conceptual core. Builds an argument to "Planning's real job: find boundaries that maximize independence" — the line the whole deck's parallelism story rests on. |
| 8 | The I&A cycle | yes | 6 | Same shape: five mechanics, then "The payoff: iteration N+1 is easier than iteration N." The payoff should not be on screen while the mechanics are explained. |

**Five of seven animated, 28 click steps total.** Two left alone on purpose, for different
reasons — 4 is a hard layout constraint, 6 is an editorial call about rhythm. The layout
pass should not "fill in" either one without re-deciding deliberately; slide 4 in
particular will overflow if anything is added.

### Gotchas

- `<v-clicks>` needs a **blank line either side of the list** or the Markdown list is not
  parsed inside the component. Verified in the build output: the `ul` renders inside the
  `VClicks` default slot, not as a sibling.
- Reveals are invisible to a build exit code, so verified structurally instead: each slide
  compiles to its own `md-*.js` chunk, and grepping those chunks confirms `VClicks` appears
  exactly on slides 2, 3, 5, 7, 8 and is **absent** from 4 and 6. Cheaper than a headless
  click-through and it distinguishes "wrapped" from "passed through as inert HTML".
- `<v-clicks>` does not change layout — hidden items stay in the DOM at zero opacity, so
  it adds no overflow risk on the slides it was applied to.

### Checks

- `npm run slides` → **19**, exit 0.
- `npx slidev build slides.md --out <own scratchpad dir>` → exit 0, no errors. Built to a
  private dir, never the shared `dist`, since wave 2 runs three workers in parallel.
