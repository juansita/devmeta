# Feature Spec — Deck Model

**Iteration:** 01.1
**Wave:** 2 (parallel with B, D, E, F)
**Owns:** `slides/pages/02-model.md` — 5 slides, exactly

---

## Scope

The core of the deck. Four nested units plus the cycle that runs between them. If the
audience leaves understanding only one thing, it should be this section.

---

## Source material

- `README.md` — the "Concepts" section, verbatim definitions
- `devmeta/go.md` — "Iteration Rhythm", "Execution Iteration Structure", "I&A Cycle
  Structure"
- `devmeta/plan-iteration.md` — "Design Philosophy", for why the feature is the unit

---

## Implementation guide

### Slide 4 — The hierarchy

The whole model on one slide, before the detail slides.

- Increment → Iteration → Feature → Task, nested.
- Say what each one produces, in four words each.
- End with the `<!-- DIAGRAM-PLACEHOLDER: nested boxes, increment containing
  iterations containing features containing tasks -->` comment.
- Write a short bulleted stand-in above the comment so the slide still reads well now.

### Slide 5 — Increment

- A major scope of work. Example: "Document management + audit export".
- Contains several iterations.
- Scope never shrinks. Only a human can cut it.
- Its end is a stopping point — `/devmeta:go` exits and waits for you.

### Slide 6 — Iteration

- A deliverable slice inside an increment.
- Produces one PR, merged before anything else happens.
- Commit per task, PR per iteration.
- Always followed by an I&A cycle. Structural, not optional.

### Slide 7 — Feature

- The unit of parallel execution. One subagent runs one feature.
- Tasks inside a feature are sequential steps, not parallel workers.
- Features that share no files run at the same time.
- This is the one place to mention that `tk` stores a feature as an epic and a task as
  a task. Say it once, here, then never again.

### Slide 8 — I&A cycle

- Inspect & Adapt. Runs after every iteration on the base branch.
- Code review, docs audit, gap check against scope, plan reassessment.
- Writes what it learned to `.devmeta/lessons-learned.md` and
  `.devmeta/project-history.md`.
- The payoff: iteration N+1 is easier than iteration N.

---

## Style contract

Read `.devmeta/increments/increment-01-zmf/iterations/iteration-01.1/plan.md` >
"Style contract" and follow it exactly. Summary of the parts most often broken:

- One `##` heading per slide, first line.
- Max 6 bullets, max 12 words each.
- Second person, present tense.
- Full command names in backticks.
- Stock theme only. No `v-clicks`, no custom layouts, no transitions.

---

## Test strategy

```bash
cd slides && npm run build     # must exit 0
cd slides && npm run slides    # your file must contribute exactly 5 slides
```

---

## Open questions

None.
