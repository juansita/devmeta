# Feature Spec — Deck Coherence

**Iteration:** 01.1
**Wave:** 3 (runs alone, after B, C, D, E and F all close)

---

## Scope

Five writers produced five files in parallel. This feature makes them read as one deck.
It is the only feature allowed to touch every page file, which is why it runs alone.

---

## Architecture

**Modifies:** any of `slides/pages/*.md`, plus `slides/slides.md` if the title slide
needs to match the finished tone.

**Creates:** nothing.

---

## Implementation guide

### 1. Read the whole deck cold

Read `slides/slides.md` and all five page files end to end, in order, before changing
anything. Note problems; do not fix them yet.

### 2. Fix terminology drift

The five features wrote independently. Check every occurrence:

- increment, iteration, feature, task, I&A cycle, tick — used consistently
- no "sprint", "story", "phase", "stage" in prose
- "epic" appears only on slide 7, where `tk`'s naming is explained
- commands always in full backticked form, `/devmeta:go` not `go`

### 3. Fix seams

- No slide repeats a point another slide already made. The commands section and the
  example section are the likely offenders — the example should show, not re-explain.
- Transitions work: slide 3 promises two commands, slide 9 must deliver them; slide 8
  ends the model, slide 9 must open the practical half.
- Heading style is uniform. Every slide title is a `##`, phrased the same way.

### 4. Verify the mechanical criteria

```bash
cd slides && npm run slides
```

- Total is 19, and inside the 15-20 range the increment requires.
- Every slide title matches the outline in
  `.devmeta/increments/increment-01-zmf/iterations/iteration-01.1/plan.md`.
- Exactly three `DIAGRAM-PLACEHOLDER` comments exist, on slides 4, 10 and 14.
- No `v-clicks`, no `layout:` other than the stock default, no theme change — 01.3
  needs a clean surface.

### 5. Concept checklist

Confirm each of these appears on at least one slide. This is an increment exit
criterion, so record the slide number for each in the context log:

increment, iteration, feature, task, I&A cycle, the three user commands, the four
internal commands, the `.devmeta/` layout, `devmeta.md` config, `tk`'s role.

### 6. Cold-read judgement

Read it once more as a newcomer. Can you tell an increment from an iteration from a
feature? If not, fix the model section — that failure is the iteration's acceptance
test.

---

## Test strategy

```bash
cd slides && npm run build     # must exit 0
cd slides && npm run slides    # must report 19 and exit 0
```

---

## Open questions

None.
