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
- **`npm run slides` loses its exit code when piped to `tail` or `head`.** Run it bare
  and check `$?`, then run it again for the output if you need to see it. Found by the
  Commands worker; it applies to every `npm run` check in this repo.
- **Name the boundary between adjacent features in both specs.** Commands and Example
  cover the same commands from different angles. Each spec said explicitly what the
  other owned, and neither duplicated the other. Cheap to write, and it removes the
  most likely coherence defect before it happens.
- **Make workers verify external facts, not recall them.** The Setup spec said "do not
  ship a command you have not checked". The worker fetched the install URL, confirmed
  the symlink on disk, and confirmed the merge driver in `git config` before writing the
  slide. Every install line in the deck is checked rather than remembered.
- **A worker that spots a spec/reality mismatch should report it, not silently pick.**
  The Example worker found that slide 15's "commit and tests per task" describes
  `run.md`'s model, which this iteration deviates from. It taught the model, flagged the
  gap, and left the call to the I&A cycle. That is the right instinct — record it here
  so later workers copy it.
- **Deviations from the standard git model** are recorded in the iteration `status.md`.
  Five parallel subagents cannot each own a branch in one working tree, and worktrees
  would not carry `slides/node_modules`. The I&A cycle should rule on whether 01.2 keeps
  this or moves to worktrees with a symlinked `node_modules`.
