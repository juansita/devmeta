# Shared Context Log — deck-example

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## Example — done

`slides/pages/04-example.md`, slides 13-16. The running example is this repo's own
increment. Every fact below is on disk, so the coherence pass can check it.

**Facts cited and where they came from:**

| Slide | Claim | Source |
|:--:|-------|--------|
| 13 | `/devmeta:start-increment-spec "Slidev deck explaining how DevMeta works"` | `.devmeta/increments/increment-01-zmf/_overview.md` title line |
| 13 | Dialogue asks goal, deliverables, exclusions, iterations, exit criteria | `devmeta/start-increment-spec.md` Step 5 (9 questions; slide names 5) |
| 13 | Exclusions: PDF export, hosting, speaker notes | `_overview.md` > "What This Increment Does NOT Include" |
| 13 | Three iterations: content spine, diagrams, theme and motion | `_overview.md` > Iteration Map |
| 13 | Exit criteria: build exits 0, 15-20 slides | `_overview.md` > Exit Criteria (first two boxes) |
| 14 | Base branch cut, environment checked | `devmeta/go.md` Phase 0.5 and Phase 1 |
| 14 | Features chosen so no two touch the same file | `iteration-01.1/plan.md` > Work-to-file matrix ("Shared files: none") |
| 14 | Wave order Foundation → 5 content → Coherence | `iteration-01.1/plan.md` > Feature independence map; `status.md` > Features |
| 14 | Iteration tick `7pv` | `iteration-01.1/status.md` header |
| 14 | Iteration holds PR, merge, I&A tasks | `devmeta/go.md` > Execution Iteration Structure |
| 15 | Foundation first and alone; splits deck into six files | `status.md` deviation 4; `plan.md` > Work-to-file matrix (slides.md + 5 pages) |
| 15 | One subagent per feature, five at once | `devmeta/run.md` > Design; `status.md` independence map |
| 15 | Tasks sequential, commit and tests per task | `devmeta/run.md` > Instructions step 7 and Rules |
| 15 | Features hand off via `context-log.md`, not the orchestrator | `devmeta/run.md` > Design |
| 15 | One PR per iteration | `devmeta/run.md` Rules; `go.md` "Create PR for iteration N" |
| 16 | Merge happens before the I&A cycle | `devmeta/go.md` > Execution Iteration Structure (MERGE BEFORE I&A CYCLE) |
| 16 | I&A reviews code, audits docs, reassesses plan | `devmeta/go.md` lines 52 and 84 |
| 16 | Lessons land in `.devmeta/lessons-learned.md` | `devmeta/go.md` > Re-grounding task, item 3 |
| 16 | Last I&A task is planning the next iteration | `devmeta/go.md` > "Last I&A Cycle Task = First Task of Next Iteration" |
| 16 | Next iteration is 01.2 diagrams; 01.3 closes the increment | `_overview.md` > Iteration Map |

**Deliberate choices:**

- Slide 15 says "commit and tests per task" — the DevMeta model from `run.md`. This
  iteration deviates (coordinator commits, per `status.md`). The deck teaches the model,
  not the harness workaround. Flagging it so coherence does not "fix" it either way.
- Word "epic" avoided in prose per the Style contract; slide 14 says "feature tick".
- Slide 14 keeps a `text`-tagged fence for the wave order plus two bulleted stand-in
  lines above the `DIAGRAM-PLACEHOLDER` comment, which sits alone on its own line.
- Feature count: seven total (Foundation, five content, Coherence). Slides never state a
  number, they name them, so 01.2's diagram can show the same shape without conflict.

**Verification:** `npm run slides` → 19, exit 0. Isolated `npx slidev build --out
<scratchpad>/build-example` → exit 0. Shared `slides/dist` untouched.

---
