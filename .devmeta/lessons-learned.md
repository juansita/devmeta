# Lessons Learned

Accumulated learnings. Each I&A cycle adds to this file.

## Setup

- `devmeta/` in this repo is symlinked to `~/.claude/commands/devmeta`. An edit here
  changes the live slash commands in every project.

## Iteration 01.1

- **Split the artifact before splitting the work.** The deliverable was one Markdown
  file, which caps parallelism at one. Slidev's `src:` imports turned it into six files
  and made a five-wide parallel wave possible. Look for this shape in any
  single-artifact deliverable.
- **Verify the mechanism before planning around it.** `src:` imports were smoke-tested
  on a throwaway 3-file deck before the whole feature split was built on them. Cost:
  two minutes. It would have invalidated the entire plan.
- **`@slidev/parser/fs` `load()` takes `(rootsInfo, filepath)`.** The one-argument form
  throws `ERR_INVALID_ARG_TYPE`. Signature checked in
  `node_modules/@slidev/parser/dist/fs.d.mts`.
- **Give the iteration a machine-checkable acceptance test.** "15-20 slides" was an exit
  criterion no one could check by eye across six files. `npm run slides` turned it into
  an exit code, and every task now runs it.
- **Deviations from the standard git model** are recorded in the iteration `status.md`.
  Five parallel subagents cannot each own a branch in one working tree, and worktrees
  would not carry `slides/node_modules`. The I&A cycle should rule on whether 01.2 keeps
  this or moves to worktrees with a symlinked `node_modules`.
