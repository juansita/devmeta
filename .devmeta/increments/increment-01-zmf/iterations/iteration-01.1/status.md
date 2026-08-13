# Iteration 01.1 Status

**Started:** 2026-08-13
**Completed:** 2026-08-13
**Status:** Complete
**Iteration tick:** `7pv`
**Base branch:** `2026-08-13-devmeta-deck`
**Work branch:** `feature/2026-08-13-deck-content-spine`

## Features

| Feature | ID | Tasks | Status | Depends On |
|---------|----|-------|--------|-----------|
| Foundation | `glx` | 4 | **Complete** | — |
| Problem | `jo0` | 2 | **Complete** | Foundation |
| Model | `vs2` | 2 | **Complete** | Foundation |
| Commands | `nc1` | 2 | **Complete** | Foundation |
| Example | `fbc` | 2 | **Complete** | Foundation |
| Setup | `q19` | 2 | **Complete** | Foundation |
| Coherence | `k5z` | 3 | **Complete** | Problem, Model, Commands, Example, Setup |

## Feature Independence Map

```
              [Foundation]
       ┌────┬──────┼──────┬────┐
   [Problem][Model][Cmds][Ex][Setup]   ← wave 2, five in parallel
       └────┴──────┼──────┴────┘
              [Coherence]              ← wave 3, alone
```

Wave 2 is five wide because each content feature owns exactly one file in
`slides/pages/`. No two features write the same file.

## Deviations from the standard DevMeta git model

Recorded here and in `.devmeta/lessons-learned.md` for the I&A cycle to rule on.

1. **One work branch for the iteration, not one branch per feature.** `run.md` calls
   for `feature/YYYY-MM-DD-<name>` per feature. Five parallel subagents cannot each
   check out a different branch in one working tree, and git worktrees would not carry
   `slides/node_modules`, so the build would fail inside them.
2. **Workers do not commit.** The coordinator commits once per feature after the worker
   returns. This keeps five agents out of one git index.
3. **Each worker builds to its own output directory** (`--out` under the scratchpad), so
   concurrent Vite builds never write the same `slides/dist`.
4. **Foundation runs inline, not in a subagent.** Wave 1 holds one feature and blocks
   everything else, so there is no parallelism to gain.

## Summary

Delivered a 19-slide DevMeta explainer deck, complete in narrative, on the stock theme.
Split the deck into six files so five content features could be written in parallel, one
subagent each, then made them read as one deck in a dedicated coherence wave. PR #1
merged into the base branch.

## Key Learnings

- Splitting the artifact is what unlocks splitting the work. One Markdown file caps
  parallelism at one; six files made a five-wide wave possible.
- A written style contract eliminated terminology drift entirely, but could not catch
  the two defects that needed a whole-deck read: a term used without introduction, and
  two slides claiming the same payoff.
- Turning "15-20 slides" into `npm run slides` with an exit code made an exit criterion
  checkable by every task, instead of by eye at the end.

## Changes to Project Docs

- `.devmeta/lessons-learned.md`: 8 entries added across planning, execution and I&A.
- `.devmeta/project-history.md`: Foundation, five content features, and the coherence
  pass recorded.
- No `CLAUDE.md` or `docs/current/` in this project — nothing to promote there. Noted in
  the I&A report as a genuine gap for iteration 01.2 to consider.

## Notes

- Slidev `src:` imports verified working on 52.19.0 during planning. This is what makes
  the five-wide parallel wave possible.
- `@slidev/parser/fs` gives an exact slide count across imports. Wired up as
  `npm run slides` by the Foundation feature.
