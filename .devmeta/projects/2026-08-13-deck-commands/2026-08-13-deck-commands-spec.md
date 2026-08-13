# Feature Spec — Deck Commands

**Iteration:** 01.1
**Wave:** 2 (parallel with B, C, E, F)
**Owns:** `slides/pages/03-commands.md` — 4 slides, exactly

---

## Scope

The practical section. Which commands exist, which ones you type, which ones you must
leave alone, and why.

---

## Source material

- `README.md` — the "Commands" section and both tables
- `devmeta/go.md` — "Purpose" and "Critical Rules"
- Frontmatter `description:` lines of all seven files in `devmeta/`

---

## Implementation guide

### Slide 9 — The three you run

- `/devmeta:discuss-project` — optional. Use when the shape of the work is still
  unclear. Writes a thinking doc to `docs/thoughts/`.
- `/devmeta:start-increment-spec` — define one increment, through an interactive
  dialogue.
- `/devmeta:go` — drive it to completion.
- Say plainly: in day-to-day use, that is the whole surface.

### Slide 10 — What `/devmeta:go` does

- Reads the current state and decides the next action itself.
- Loops: plan → execute → inspect and adapt → next iteration.
- Never asks whether to continue.
- Stops on a genuine external blocker, or when the increment closes.
- Interrupted? Run it again. It resumes from tick state, no setup.
- End with `<!-- DIAGRAM-PLACEHOLDER: the go loop, plan to run to reflect back to
  plan, exiting when the increment closes -->` and a short bulleted stand-in above it.

### Slide 11 — The four it calls for you

- `/devmeta:plan-iteration N` — split an iteration into features and tasks.
- `/devmeta:run` — execute features, one subagent each.
- `/devmeta:reflect N` — the I&A cycle.
- `/devmeta:status` — read-only progress check. Safe to run at any time. `/devmeta:go`
  never calls it.

### Slide 12 — Do not call them yourself

- The first three are orchestration primitives, not user commands.
- Calling one directly pre-empts `/devmeta:go` and breaks the loop.
- You then have to stitch iteration boundaries by hand.
- The exception is debugging. And `/devmeta:status`, which is always safe.

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
cd slides && npm run slides    # your file must contribute exactly 4 slides
```

---

## Open questions

None.
