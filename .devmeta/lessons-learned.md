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
- **A written style contract prevents the drift a coherence pass would have to fix.**
  Five workers wrote independently against one contract in the iteration plan. The
  coherence pass found zero terminology drift — no forbidden words, consistent command
  formatting, "epic" confined to the one slide that explains it. What it did find were
  gaps no single worker could see: a term used but never introduced, and two slides
  claiming the same payoff. **Contracts catch local drift; only a whole-deck read
  catches missing introductions and duplicated payoffs.** Budget a wave for it.
- **Parallel feature cost, measured.** Five subagents, roughly 45-50k tokens each,
  90-115s wall clock, all five landing inside two minutes. Sequential would have been
  one context carrying all five sections. The split bought both wall-clock and context
  headroom, and cost one extra wave for coherence.
## Iteration 01.2

- **A green build is not a rendered diagram.** Mermaid parse errors render an error box
  on the slide and still exit 0. Worse, the two obvious checks both lie: grepping the
  bundle finds nothing because Slidev lz-string-compresses the source into a `code-lz`
  prop, and `querySelectorAll('svg')` finds nothing because the SVG lives in the mermaid
  component's **shadow root**. Reach `.slidev-page-N .mermaid` → `shadowRoot`. Also,
  `mermaid.parse()` in bare Node dies with `DOMPurify.addHook is not a function` — it
  needs a DOM, and that error is not a syntax error.
- **Promote a verification you had to invent into a command.** The shadow-root render
  check started as three workers each writing their own throwaway script. It is now
  `slides/scripts/verify-diagrams.mjs` behind `npm run diagrams`. The rule that keeps
  earning out: if a criterion can only be checked by looking, turn it into an exit code.
- **A diagram takes the whole slide body.** Keeping slide 4's bullets alongside a
  three-deep `graph TD` overflowed the frame and clipped a node. "The diagram replaces
  the stand-in, it does not join it" turned out to be a layout constraint, not an
  editorial preference. Write it as one in the next diagram contract.
- **Deleting a stand-in can delete a definition.** Slide 4's bullets held the deck's only
  definition of "Task", which is on the increment's concept checklist. The worker that
  caused it flagged it instead of quietly shipping, and the verification wave fixed it.
  **Before deleting prose to make room, check what only that prose said.**
- **The global `slidev` binary cannot resolve `@slidev/theme-default`.** It fails with
  `The theme "@slidev/theme-default" was not found and cannot prompt for installation`.
  The theme is a local devDependency, so always run through the `slides/` npm scripts.
  This rule was living in `.devmeta/devmeta.md` and copy-pasted into six feature context
  logs, but was never here — which is why a spec cited the wrong source for it. Rules
  that every worker needs belong in one place, and this file is it.
- **Piping `npm run` to `grep`, `tail` or `head` returns the pipe's exit code**, not the
  command's, so a failing check reads as a pass. Run it bare, check `$?`, then run it
  again for output. First hit in 01.1, hit again in 01.2 — it is now in `CLAUDE.md`.

## Iteration 01.1

- **`gh pr create` targets the upstream repo in a fork, not your own.** The first
  attempt failed with "No commits between…" because it aimed at `mkelk/devmeta`. Always
  pass `--repo juansita/devmeta` and a `--head juansita:<branch>` in this repo.
- **Deviations from the standard git model** are recorded in the iteration `status.md`.
  Five parallel subagents cannot each own a branch in one working tree, and worktrees
  would not carry `slides/node_modules`. The I&A cycle should rule on whether 01.2 keeps
  this or moves to worktrees with a symlinked `node_modules`.
