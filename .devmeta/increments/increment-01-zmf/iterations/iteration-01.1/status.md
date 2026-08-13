# Iteration 01.1 Status

**Started:** 2026-08-13
**Status:** In Progress
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
| Coherence | `k5z` | 3 | Not started | Problem, Model, Commands, Example, Setup |

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

## Notes

- Slidev `src:` imports verified working on 52.19.0 during planning. This is what makes
  the five-wide parallel wave possible.
- `@slidev/parser/fs` gives an exact slide count across imports. Wired up as
  `npm run slides` by the Foundation feature.
