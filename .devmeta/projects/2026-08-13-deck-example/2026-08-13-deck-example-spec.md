# Feature Spec — Deck Example

**Iteration:** 01.1
**Wave:** 2 (parallel with B, C, D, F)
**Owns:** `slides/pages/04-example.md` — 4 slides, exactly

---

## Scope

One increment followed from first command to close. This is what makes the abstract
model on slides 4-8 stick. Four slides, four steps, one continuous thread.

**Use this repo as the example.** The deck the audience is watching was built by the
process being described. Say so on slide 13 — it is the strongest evidence available.

---

## Source material

- `devmeta/start-increment-spec.md` — Step 5, the nine questions the dialogue asks
- `devmeta/go.md` — "Execution Iteration Structure", the tick tree
- `devmeta/run.md` — the Design section, one subagent per feature
- `.devmeta/increments/increment-01-zmf/_overview.md` — the real spec for this deck
- `.devmeta/increments/increment-01-zmf/iterations/iteration-01.1/plan.md` — the real
  feature split, including the independence map

---

## Implementation guide

Keep one running example across all four slides. Do not switch subject.

### Slide 13 — Step 1: define the scope

- You run `/devmeta:start-increment-spec "Slidev deck explaining how DevMeta works"`.
- It interviews you: goal, deliverables, exclusions, iteration split, exit criteria.
- It writes `_overview.md` with exit criteria you can actually check.
- Note that this deck came from exactly that command.

### Slide 14 — Step 2: `/devmeta:go` plans

- You run `/devmeta:go` once. Nothing else is typed after this.
- It cuts a base branch and checks the environment.
- It splits iteration 1 into features chosen so no two touch the same file.
- Show the real result in a fenced block or short list: foundation first, then five
  content features in parallel, then a coherence pass.
- End with `<!-- DIAGRAM-PLACEHOLDER: tick tree for one iteration, iteration epic
  containing feature epics containing tasks, plus the PR and I&A tasks -->` and a short
  bulleted stand-in above it.

### Slide 15 — Step 3: features run

- One subagent per feature, five at once.
- Tasks inside a feature run in order.
- Commit per task. Tests run after every task and must pass.
- Features talk to each other through `context-log.md`, not through the orchestrator.
- One PR for the whole iteration.

### Slide 16 — Step 4: merge, reflect, repeat

- PR merges into the base branch before anything else happens.
- The I&A cycle reviews the code, audits docs, and reassesses the plan.
- Its last task is real work: planning iteration 2. No handoff gap.
- When the last iteration closes, `/devmeta:go` stops and hands back to you.

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
