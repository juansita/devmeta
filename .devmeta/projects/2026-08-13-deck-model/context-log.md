# Shared Context Log — deck-model

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## Model — done

`slides/pages/02-model.md`, 5 slides. Deck total 19, `npm run slides` exit 0.
Build clean (built to a private `--out` dir, not `slides/dist`).

### Canonical vocabulary — the whole deck inherits this

These are the exact definitions now on slides 4-8. Commands and Example sections must
not contradict them. If you need a shorter form, shorten — do not redefine.

- **Increment** — "a major scope of work". Contains several iterations, each planned
  when its turn comes. Scope never shrinks; only the human can cut it. `/devmeta:go`
  drives **one** increment, then stops and waits — its end is a human decision point.
  Example used on the slide: "Document management + audit export".
- **Iteration** — "a deliverable slice inside an increment". Produces **exactly one PR**,
  merged before anything else starts. Nothing closes with failing tests. Always followed
  by an I&A cycle — structural, not optional.
- **Feature** — "the unit of parallel execution, and the unit of context". One subagent
  runs one feature start to finish. Features that share no files run at the same time.
- **Task** — "one step inside a feature" → one commit. Tasks within a feature are
  **sequential steps, not parallel workers**. Never describe tasks as running in parallel.
- **I&A cycle** — "Inspect & Adapt. Runs after every iteration, on the base branch."
  Code review, docs audit, gap check against scope, plan reassessment. Writes learnings
  to `.devmeta/lessons-learned.md` and `.devmeta/project-history.md`. Its last task is
  real work: planning iteration N+1. Payoff: iteration N+1 is easier than iteration N.

### Production phrases (reuse verbatim where useful)

- Increment → many iterations. Iteration → one merged PR. Feature → several commits.
  Task → one commit.
- "Commit per task, PR per iteration." Merge happens **before** the I&A cycle runs.

### Terminology rules enforced here

- The word **epic** appears exactly once in the deck, slide 7: "`tk` stores a feature as
  an epic, a task as a task." Do not use "epic" or "story" or "sprint" anywhere else.
- "I&A cycle" is spelled that way in prose; expanded once, on slide 8, as
  "Inspect & Adapt".
- Commands always in full backticked form — `/devmeta:go`, never bare `go`.
- US spelling ("maximize"), matching `devmeta/plan-iteration.md`.

### Gotchas

- Slide 4 carries the diagram placeholder comment on its own line, directly after the
  bullets. The bullets are a stand-in and are expected to survive alongside the diagram
  or be replaced by 01.2 — they are not throwaway filler.
- Kept to bullets only, no lead-in prose lines, so 01.3 has a uniform surface to style.

---
