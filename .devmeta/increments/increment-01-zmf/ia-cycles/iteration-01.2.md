# I&A Cycle Complete — Iteration 01.2

**Date:** 2026-08-13
**Increment:** 01-zmf — Slidev deck explaining how DevMeta works
**Base branch:** `2026-08-13-devmeta-deck`
**Tag:** `iteration-01-zmf.2`

---

## Learnings Captured

- 6 learnings from feature context logs (three diagrams, verification, `CLAUDE.md`)
- 6 new entries in `.devmeta/lessons-learned.md`, now grouped by iteration
- The headline one is not a tip, it is a corrected method: **a green build proves nothing
  about a Mermaid diagram**, and both cheaper ways of checking silently lie

## Code Quality Review

- **Files reviewed:** 8 (`CLAUDE.md`, three page files, both scripts, `package.json`,
  `.gitignore`)
- **Drift instances found:** 1, in code written this same iteration
- **Overall assessment: clean.** No TODO/HACK/FIXME anywhere. `CLAUDE.md` is 58 lines
  against a 60-line budget with every claim machine-verified.

The drift, fixed in this cycle rather than deferred:

| File | Problem | Fix |
|------|---------|-----|
| `scripts/verify-diagrams.mjs` | A fallback selector `?? document.querySelector('.mermaid')`. Slidev keeps every slide in the DOM, so a missing diagram on slide 14 could pass by reading slide 4's. **A false pass in the one check whose entire purpose is to not lie.** | Fallback removed; a missing diagram now fails loudly |
| `scripts/verify-diagrams.mjs` | Slide list `[4, 10, 14]` hardcoded. A diagram moved in 01.3 would be silently skipped. | Slides are now derived from the ` ```mermaid ` blocks in source; the derivation independently produced 4, 10, 14 |
| `scripts/verify-diagrams.mjs` | Fixed 1500ms sleep before reading the DOM | Replaced with `waitForFunction` polling for the SVG, 15s ceiling |

**The check was then negative-tested.** A deliberate syntax error was introduced into
slide 10's diagram: `npm run build` exited **0**, and `npm run diagrams` exited **1** with
`slide 10: FAILED — no rendered SVG`. The source was restored and both go green again. A
check that has never been observed failing is not evidence.

**Cleanup tasks created:** none.

## Gaps Verified (Outside-In)

Every acceptance criterion executed, not assumed.

| Scope item | Claimed | Verified | Evidence |
|------------|---------|----------|----------|
| Hierarchy diagram, slide 4 | Closed | **Closed** | live SVG, viewBox `0 0 667.375 469`, 3 clusters + 4 nodes, no error box |
| Loop diagram, slide 10 | Closed | **Closed** | live SVG, viewBox `0 0 906.34 129`, 4 nodes, both exit edges labelled |
| Tick tree diagram, slide 14 | Closed | **Closed** | live SVG, viewBox `0 0 896.77 278`, 7 nodes, PR and I&A on the features' rank |
| All placeholders replaced | Closed | **Closed** | `DIAGRAM-PLACEHOLDER` → 0 occurrences |
| No diagram over 8 nodes | Closed | **Closed** | node-count parse over every ` ```mermaid ` block → max 7 |
| Slide count unchanged | Closed | **Closed** | `npm run slides` → 19 |
| Build clean | Closed | **Closed** | `npm run build` → exit 0 |
| Project `CLAUDE.md` | Closed | **Closed** | 58 lines, 13 claims each verified against the machine |
| Concept checklist intact | **Regressed, then closed** | **Closed** | "task" lost with slide 4's bullets, restored on slide 7 |

**Follow-up tasks created:** none. Nothing was left partially closed.

## Docs Updated

| File | Changes |
|------|---------|
| `.devmeta/lessons-learned.md` | 6 entries; reorganised under per-iteration headings |
| `.devmeta/project-history.md` | Iteration 01.2 wave 1 narrative |
| `iterations/iteration-01.2/status.md` | Features marked complete, completion date |
| `projects/2026-08-13-diagram-verify/context-log.md` | Full verification record: viewBoxes, labels, consistency findings, both defects |
| `projects/2026-08-13-diagram-verify/…-spec.md` | Rewritten mid-iteration once the planned verification method was proven wrong |
| `CLAUDE.md` | Created |
| `slides/package.json` | `npm run diagrams` added |

## Pattern Problems Found

1. **The planned verification method was wrong, and only the workers could have found
   that.** The spec told three features to grep the built bundle for node labels. That
   cannot work — Slidev lz-string-compresses Mermaid source into a `code-lz` prop. Two
   workers discovered it independently, and both **reported the correction instead of
   quietly passing**, which is the behaviour that made it recoverable. **Resolution:** the
   spec was rewritten mid-iteration and the working method is now a command. Planning
   lesson: when a spec prescribes a verification technique nobody has run before, smoke-
   test the *technique*, not just the tool. `src:` imports and Mermaid rendering were both
   smoke-tested; the verification method was not.

2. **Removing prose to make room can remove the only statement of something.** Slide 4's
   bullets had to go for layout reasons, and they carried the deck's only definition of
   "task". **Resolution:** fixed on slide 7, and recorded in `lessons-learned.md` as a
   check to run before deleting prose.

3. **A shared rule lived everywhere except `lessons-learned.md`.** "The global `slidev`
   binary cannot resolve the theme" was in `devmeta.md` and copy-pasted into six feature
   context logs, so a spec cited the wrong source for it. Caught by the `CLAUDE.md`
   worker, which verified against the machine instead of trusting the citation.
   **Resolution:** the rule is now in `lessons-learned.md`, which is the file meant to
   accumulate them.

4. **Every worker verified against reality rather than recall, unprompted after the first
   time.** The 01.1 Setup spec established "do not ship a command you have not checked".
   In 01.2 all four workers did this by default. Worth keeping in specs — it is cheap and
   it caught real detail three times.

## Git & Housekeeping

- **Tagged:** `iteration-01-zmf.2`
- **PR:** #2, merged with `--merge` into `2026-08-13-devmeta-deck`
- **Metadata commit:** `.tick/` and `.devmeta/` committed directly to the base branch
- **Ticks pruned: none — deliberately.** Same reasoning as 01.1R: `tk delete` is
  permanent, gives no cascade guarantee for children, and the closed ticks are the only
  per-task audit trail. Left for the user to request.
- **Remaining open items:** iteration 01.3, its I&A cycle, and their tasks

## Iteration Plan Reassessment

- **Remaining iterations reviewed:** 1 (01.3 Theme and motion)
- **Changes made:** none to scope. The verify list gains `npm run diagrams`, which did
  not exist when 01.3 was written.
- **Rationale:** 01.3's scope — theme, click reveals, stepped diagram builds, transitions,
  layout pass — is unchanged and correct. The surface it needs is confirmed clean: no
  `v-clicks`, no `layout:`, no `transition:`, no `classDef` anywhere in `slides/pages/`,
  and the only `theme:` is `default`.
- **One risk to carry forward:** 01.3 adds click reveals to the diagram slides. Slide 4 is
  heading-plus-diagram with no bullets, and its diagram already fills the frame — a
  stepped build there must not reintroduce the overflow that removed those bullets.

## Next Iteration Readiness

- **Iteration 01.3 — Theme and motion.** Final iteration of the increment.
- **Scope adjustments:** none.
- **Cleanup tasks carried forward:** 0.
- **Shape:** unlike 01.1 and 01.2, this iteration is **not** cleanly parallel. A theme
  change touches `slides.md` and affects every slide at once, and the layout pass has to
  judge slides against each other. Expect a narrow first wave (theme) followed by
  per-file motion work, not a wide fan-out. The planning step should say so explicitly
  rather than reaching for the five-wide pattern that worked twice.
