# Iteration 01.1 Plan — Content spine

**Increment:** 01-zmf — Slidev deck explaining how DevMeta works
**Base branch:** `2026-08-13-devmeta-deck`

---

## Goal

Write every slide of the deck. Narrative complete, stock theme, no diagrams yet.
A reader who has never seen DevMeta must finish the deck able to run their own
increment.

**Audience:** developers who use Claude Code daily and have never seen DevMeta.
Assume they know git, PRs, and subagents. Assume they know nothing about DevMeta.

---

## Architecture decision — why the deck is many files

Five content features run in parallel. If they all wrote `slides/slides.md`, every one
would conflict with the others.

Slidev supports splitting a deck across files:

```markdown
---
src: ./pages/02-model.md
---
```

The imported file's slides are inlined at that position. Verified working on Slidev
52.19.0 — a 3-file test deck built clean and all slides reached the output.

So `slides/slides.md` becomes a thin table of contents, and each content feature owns
exactly one file in `slides/pages/`. No two features touch the same file.

---

## Slide-by-slide outline (authoritative)

19 slides. Each content feature must produce **exactly** its stated slide count — the
15-20 total is an increment exit criterion.

| # | File | Slide | Purpose |
|:--:|------|-------|---------|
| 1 | `slides.md` | Title | "How DevMeta Works" + one-line subtitle |
| 2 | `pages/01-problem.md` | Agents forget | Session ends, context dies. Next session re-explains everything. |
| 3 | `pages/01-problem.md` | What DevMeta adds | A structure on disk that outlives the session. Two commands to drive it. |
| 4 | `pages/02-model.md` | The hierarchy | Increment → Iteration → Feature → Task. **Diagram placeholder (01.2).** |
| 5 | `pages/02-model.md` | Increment | A major scope of work. Many iterations. Ends at a human decision point. |
| 6 | `pages/02-model.md` | Iteration | A deliverable slice. Produces one PR. Always followed by an I&A cycle. |
| 7 | `pages/02-model.md` | Feature | The unit of parallel execution. One subagent per feature. Tasks inside are sequential. |
| 8 | `pages/02-model.md` | I&A cycle | Inspect & Adapt. Code review, docs audit, plan reassessment. Why iteration N+1 is easier than N. |
| 9 | `pages/03-commands.md` | The three you run | `discuss-project` (optional), `start-increment-spec`, `go`. |
| 10 | `pages/03-commands.md` | What `go` does | Plan → execute → reflect → repeat → close. **Diagram placeholder (01.2).** |
| 11 | `pages/03-commands.md` | The four it calls for you | `plan-iteration`, `run`, `reflect`. Plus `status`, read-only, safe any time. |
| 12 | `pages/03-commands.md` | Do not call them yourself | Calling internals directly breaks the loop and forces manual iteration boundaries. |
| 13 | `pages/04-example.md` | Example, step 1 | `start-increment-spec` and its scope dialogue: goal, deliverables, exclusions, iterations, exit criteria. |
| 14 | `pages/04-example.md` | Example, step 2 | `go` plans iteration 1 and the tick tree appears. **Diagram placeholder (01.2).** |
| 15 | `pages/04-example.md` | Example, step 3 | Features run in parallel subagents. Commit per task, PR per iteration. |
| 16 | `pages/04-example.md` | Example, step 4 | Merge, then I&A cycle, then iteration 2. Increment closes and `go` stops. |
| 17 | `pages/05-setup.md` | What is on disk | `.devmeta/` layout and `.tick/`. Both are git-tracked. |
| 18 | `pages/05-setup.md` | Per-project config | `.devmeta/devmeta.md`: Testing, Environment, Additional Rules. |
| 19 | `pages/05-setup.md` | Get started | Install, link commands, `tk init`, run the two commands. |

---

## Style contract (every content feature must follow)

- **Slide title:** one `##` heading, first line of the slide. The title slide in
  `slides.md` is the only `#`.
- **Body:** at most 6 bullets, at most 12 words per bullet. Slides are shown, not read.
- **Voice:** second person, present tense. "You run", not "the user runs".
- **Terminology:** use exactly these words — increment, iteration, feature, task,
  I&A cycle, tick. Never "sprint", "story", "epic" in prose. `tk` calls a feature an
  epic; say so once on slide 7 and never again.
- **Commands:** always the full form, in backticks — `/devmeta:go`, not `go`.
- **Code fences:** tag the language (` ```bash `, ` ```markdown `). Never untagged.
- **No diagrams this iteration.** Where the outline says *diagram placeholder*, write a
  short bulleted stand-in and add the HTML comment
  `<!-- DIAGRAM-PLACEHOLDER: <what it should show> -->` on its own line.
- **No `v-clicks`, no custom layouts, no theme changes.** Those are 01.3. Stock
  `default` theme only, so 01.3 has one clean surface to change.
- **Speaker notes:** out of scope. Do not add them.

---

## Work-to-file matrix

```
A Foundation  → creates: slides/slides.md (rewrite), slides/pages/*.md (stubs),
                         slides/scripts/count-slides.mjs
                modifies: slides/package.json (adds "slides" script)
B Problem     → owns: slides/pages/01-problem.md
C Model       → owns: slides/pages/02-model.md
D Commands    → owns: slides/pages/03-commands.md
E Example     → owns: slides/pages/04-example.md
F Setup       → owns: slides/pages/05-setup.md
G Coherence   → modifies: all of slides/pages/*.md (runs alone, after B-F)

Shared files: none between B, C, D, E, F.
```

---

## Feature independence map

```
              [A Foundation]
       ┌────┬──────┼──────┬────┐
      [B]  [C]    [D]    [E]  [F]      ← wave 2, five in parallel
       └────┴──────┼──────┴────┘
              [G Coherence]            ← wave 3, alone
```

---

## Test strategy

Every task closes only when this passes:

```bash
cd slides && npm run build
```

Foundation additionally delivers an exact slide counter, used from then on:

```bash
cd slides && npm run slides
```

It loads the deck through `@slidev/parser`, follows `src:` imports, and prints the
count and every slide title. Verified working on Slidev 52.19.0.

---

## Open questions

None. Scope, audience, length, and output format were all fixed at spec time.
