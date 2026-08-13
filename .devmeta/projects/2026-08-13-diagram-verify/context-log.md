# Shared Context Log — diagram-verify

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The build exit code does not prove a Mermaid diagram rendered. Check the screen.
- The 01.1 coherence pass found that a style contract catches local drift but not
  whole-artifact defects. Expect the same here: each diagram will be individually fine.

## Verification pass — record

### Render check (the part the build cannot do)

All three diagrams render. Read out of each Mermaid component's shadow root in headless
Chromium, against a served build:

| Slide | Result | viewBox | Labels in the live SVG |
|:-----:|--------|---------|------------------------|
| 4 | RENDERED | `0 0 667.375 469` | Increment, Iteration 1, Feature A, Task 1, Task 2, Feature B, Iteration 2 |
| 10 | RENDERED | `0 0 906.34 129` | Plan iteration, Execute features, Inspect and adapt, Stop, + edge labels "next iteration" and "increment closes" |
| 14 | RENDERED | `0 0 896.77 278` | Iteration 01.1, Feature: Foundation, Feature: Example, Task: create PR, Task: I&A cycle, Task: write the slides, Task: re-ground |

No error box on any slide. Node counts 7, 4 and 7 — all inside the 8-node cap. No label
over 4 words.

**This check is now a repeatable command.** The one-off script was promoted to
`slides/scripts/verify-diagrams.mjs` and wired up as `npm run diagrams`. It builds,
serves, renders slides 4, 10 and 14, and exits non-zero if any diagram is missing, empty
or showing an error box. Exit code 0 as of this pass. A future iteration that breaks a
diagram will now fail a command rather than a reading.

### Consistency across the set

- **Direction:** `TD`, `LR`, `TD`. The `LR` on slide 10 is deliberate — a loop reads
  better horizontally, and the back-edge is the point of that diagram.
- **Label case and punctuation:** sentence case throughout, no trailing punctuation.
- **Kind prefixes:** slide 4 uses generic names (`Feature A`, `Task 1`), slide 14 uses
  real ones (`Feature: Foundation`). Left as is — the difference marks abstract versus
  concrete, and both lead with the kind, so the levels stay readable.
- **Terminology:** slide 10 spells out "Inspect and adapt" as a loop stage; slide 14 uses
  "I&A cycle" as a tick name. Both forms are already in the deck's prose. Consistent.

### Defects found and fixed

1. **The deck no longer defined "Task"** — see the section below. Fixed on slide 7:
   "Tasks run in order inside a feature: one step, one commit." This restores the
   definition *and* the sequential-not-parallel contrast the original bullet carried.
2. **Slide 14 was overloaded** — three bullets, a fenced wave block, and a diagram. The
   wave block (`Foundation → … → Coherence`) duplicated what slide 15 already narrates in
   prose. Removed. Slide 14 is now bullets plus diagram, and no information was lost.

### Slide integrity after the diagrams

- Slide 4 is heading plus diagram, with no bullets. Deliberate: the diagram is the
  content, and it needs the full body — bullets overflowed the frame and clipped
  `Iteration 2`.
- Slides 10 and 14 keep their 01.1 narrative above the diagram, and it still reads
  correctly with the stand-ins gone.

### Mechanical criteria

- `npm run slides` → 19, exit 0
- `npm run build` → exit 0
- `npm run diagrams` → exit 0
- `DIAGRAM-PLACEHOLDER` → 0 occurrences
- No `v-click`, `layout:`, `transition:` or `classDef` anywhere in `slides/pages/`
- Every bullet at most 12 words, every slide at most 6 bullets

---

## REQUIRED FIX — the deck no longer defines "Task"

Slide 4's bullets held the only outright definition of a task ("one step inside a
feature → one commit"). The hierarchy diagram needed the whole slide body — keeping the
bullets overflowed the frame and clipped `Iteration 2` — so they are gone, and with them
the definition.

"Every concept in `README.md` appears on at least one slide" is an increment exit
criterion, and `task` is on that list. This is a real regression, not a nitpick, and
`reflect.md` is explicit that a gap gets fixed now rather than deferred.

Slide 7 is the right home: it already says "Tasks inside a feature are sequential steps,
not parallel workers", which describes tasks without defining them. It is at the 6-bullet
cap, so replace that bullet rather than adding one.

## Flagged by the coordinator during wave 1

- **Slide 14 may now be overloaded.** It carries its bullets, a fenced `text` block
  (`Foundation → Problem, Model, Commands, Example, Setup → Coherence`) *and* the new
  tick tree diagram. The text block shows the wave structure and the diagram shows the
  tick structure — related enough that a viewer may not see why both are there. Judge
  whether the text block still earns its place now that the diagram exists. This is
  exactly the "did the diagram orphan its slide" check in section 4 of the spec.
- **Verification method was corrected mid-iteration.** See section 1 of the spec. Two
  workers independently proved that grepping `dist/` cannot verify a Mermaid render, and
  found that the SVG lives inside the mermaid component's **shadow root** — plain
  `querySelectorAll('svg')` finds nothing even on success. Read
  `.slidev-page-N .mermaid` → `shadowRoot` to reach it. Their context logs have working
  code.

---
