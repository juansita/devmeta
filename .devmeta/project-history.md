# Project History

Narrative record of what was built, newest first.

## 2026-08-13 — Increment 01-zmf, iteration 01.1, Feature Foundation

Split the deck across files so five content features can run in parallel.
`slides/slides.md` is now a thin table of contents: headmatter, one title slide, and
five `src:` imports pointing at `slides/pages/`. Each content feature owns exactly one
page file, so no two features write the same file.

Added `slides/scripts/count-slides.mjs`, wired up as `npm run slides`. It loads the deck
through `@slidev/parser`, follows `src:` imports, prints the count and every title, and
exits non-zero outside 15-20. Reports 19, matching the outline exactly.

Stub pages carry their final slide counts (2/5/4/4/3) from the start, so the total is
correct before any content is written.

## 2026-08-13 — Harness set up

Forked `mkelk/devmeta` into `devmetaharness`. Installed `tk` 0.24.0, the ticks skill,
and Slidev 52.19.0. Linked `devmeta/` to `~/.claude/commands/devmeta`. Ran `tk init`
and created the `.devmeta/` scaffold. No increment started yet.
