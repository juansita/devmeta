# Feature Spec — Deck Problem

**Iteration:** 01.1
**Wave:** 2 (parallel with C, D, E, F)
**Owns:** `slides/pages/01-problem.md` — 2 slides, exactly

---

## Scope

The opening. Establish the pain before naming the cure. A developer who has never heard
of DevMeta must want it by the end of slide 3.

---

## Source material

- `README.md` — sections "DevMeta — Development Meta" and "Core Loop"
- `devmeta/go.md` — the Purpose section, for what "autonomous driver" actually means

---

## Implementation guide

### Slide 2 — Agents forget

The problem, concretely. Not abstract hand-wringing.

Points to land:
- A session ends. The plan, the reasoning, the half-finished work — gone.
- Next session you re-explain the project from scratch.
- Context compaction loses the same things mid-session.
- Without structure the agent re-decides what to work on every time, and drifts.

Make it recognisable. The audience has lived this.

### Slide 3 — What DevMeta adds

The turn. State the fix in one breath.

Points to land:
- State lives on disk in `.devmeta/` and `.tick/`, not in the conversation.
- The next session reads it and continues. No re-explaining.
- You drive it with two commands.
- Name them: `/devmeta:start-increment-spec` then `/devmeta:go`. Do not explain them
  yet — slide 9 does that.

Do not oversell. No "revolutionary", no "10x".

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
cd slides && npm run slides    # your file must contribute exactly 2 slides
```

---

## Open questions

None.
