# Shared Context Log — deck-commands

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## D Commands — done

`slides/pages/03-commands.md`, 4 slides (deck positions 9-12). `npm run slides` → 19,
exit 0. `npx slidev build --out <scratchpad>` → built clean.

### Claims and their sources

| Claim on a slide | Source |
|---|---|
| `/devmeta:discuss-project` is optional, for when the shape is unclear | `README.md` normal-use table + `devmeta/discuss-project.md` frontmatter |
| It writes a thinking doc to `docs/thoughts/` and hands off to a spec | `README.md` "Concepts" > Discussion, and the normal-use table |
| `/devmeta:start-increment-spec` defines one increment via interactive dialogue | `devmeta/start-increment-spec.md` frontmatter; `README.md` table |
| `/devmeta:go` is the autonomous driver, takes the increment to completion | `README.md` "Core Loop"; `devmeta/go.md` > Purpose |
| Those three are the whole day-to-day surface | `README.md` "In day-to-day use you should only ever need these" |
| `/devmeta:go` reads tick state and decides itself | `devmeta/go.md` > Phase 0 ("Ticks are the single source of truth") |
| Never asks whether to continue; iteration/I&A boundaries are waypoints | `devmeta/go.md` > Critical Rules, rules 1-3 |
| Stops on a genuine external blocker, or when the increment closes | `devmeta/go.md` > Purpose + "completing an increment IS a stopping point" |
| Interrupted → run it again, resumes from tick state, no setup | `README.md` "Typical Workflow" comment block |
| Loop is plan → execute → inspect and adapt → next iteration → close | `README.md` "Core Loop"; `devmeta/go.md` Critical Rules |
| `/devmeta:plan-iteration N` splits an iteration into features and tasks | `README.md` internal table; `devmeta/plan-iteration.md` frontmatter |
| `/devmeta:run` — one subagent per feature, parallel across waves | `README.md` internal table; `devmeta/run.md` frontmatter |
| `/devmeta:reflect N` — I&A cycle: code review, docs audit, plan reassessment | `README.md` internal table; `devmeta/reflect.md` frontmatter |
| `/devmeta:status` is read-only, safe any time, never called by `/devmeta:go` | `README.md` line after the internal table, and "Typical Workflow" closing paragraph |
| Calling internals directly breaks the loop, forces manual iteration boundaries | `README.md` internal-commands intro + "Typical Workflow" closing paragraph |
| Debugging is the stated exception | `README.md` "You can run them manually for debugging" |

### Exactly what slides 9-12 say (do not contradict)

- **Slide 9 "The three you run":** `/devmeta:discuss-project` (optional, unclear shape,
  writes to `docs/thoughts/`, hands off), `/devmeta:start-increment-spec` (one increment,
  interactive scope dialogue), `/devmeta:go` (autonomous driver, takes that increment to
  completion). Closes: "in day-to-day use, that is the whole surface."
- **Slide 10 "What `/devmeta:go` does":** reads tick state and decides itself; never asks
  whether to continue, iteration boundaries are waypoints; stops on a genuine external
  blocker or when the increment closes; re-run after an interrupt resumes from tick
  state. Loop stand-in line: `plan → execute → inspect and adapt → next iteration →
  close`, followed by the `DIAGRAM-PLACEHOLDER` comment.
- **Slide 11 "The four it calls for you":** `/devmeta:plan-iteration N`, `/devmeta:run`,
  `/devmeta:reflect N`, plus `/devmeta:status` as read-only and safe. States explicitly
  that `/devmeta:go` never invokes `/devmeta:status`.
- **Slide 12 "Do not call them yourself":** the first three are orchestration primitives;
  calling one pre-empts `/devmeta:go` and breaks the loop; you then stitch iteration
  boundaries by hand; debugging is the only exception; `/devmeta:status` is always safe.

### Notes for the Example section (13-16)

- No worked example is narrated here — deliberate, per the boundary in the spec. Slides
  9-12 explain the commands only.
- Terminology used: "autonomous driver", "orchestration primitives", "tick state",
  "I&A cycle", "waypoint". Reusing these keeps the two sections consistent.
- I say `/devmeta:go` "takes **that** increment to completion" — singular increment, then
  it stops. If the example shows a second increment, it must show the user re-invoking
  `/devmeta:go`, not the loop rolling on by itself.
- I say the run loop is plan → execute → inspect and adapt → next iteration → close.
  Slide 16's ordering should match (merge, then I&A cycle, then next iteration).

### Gotchas

- `npm run slides` swallows the exit code when piped to `tail`; check `$?` on a separate
  run.
- Building with `npx slidev build --out <dir>` from `slides/` works and does not touch
  the shared `slides/dist`.

---
