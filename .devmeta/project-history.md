# Project History

Narrative record of what was built, newest first.

## 2026-08-13 — Increment 01-zmf, iteration 01.1, content features

Five content features ran in parallel, one subagent each, each owning one file in
`slides/pages/`.

- **Problem** (slides 2-3) — the opening. Slide 2 names the pain: session ends, context
  dies, nothing on disk says what is done. Slide 3 turns it: state lives in `.devmeta/`
  and `.tick/`, and you drive it with two commands. Fixes the deck's category label for
  DevMeta as "a slash-command framework for Claude Code", and deliberately introduces no
  concept nouns, so slide 4 can present the hierarchy cold.

- **Model** (slides 4-8) — the conceptual core. Slide 4 gives the whole hierarchy with
  a "produces" clause per unit; slides 5-8 take increment, iteration, feature and I&A
  cycle one at a time. Sets the vocabulary the rest of the deck inherits, and confines
  the word "epic" to slide 7 where `tk`'s naming is explained.
- **Commands** (slides 9-12) — the practical half. The three commands you run, what
  `/devmeta:go` does, the four it calls for you, and why calling those yourself breaks
  the loop. Every claim traced back to `README.md`, `devmeta/go.md`, or a command file's
  frontmatter.

- **Example** (slides 13-16) — one increment end to end, using this deck's own
  increment. Real title, real exclusions, real seven-feature split, real iteration tick
  `7pv`. The self-reference lands on slide 13 and again on slide 15, where the slide
  names the file it came from.
- **Coherence** (all pages) — the pass that made five parallel files read as one deck.
  Found three real defects: `tk` was used from slide 7 and named on slide 17 without
  ever being introduced; slide 16 repeated slide 8's payoff instead of adding to it; one
  bullet ran 13 words against a 12-word cap. Terminology was already clean across all
  five files, which the per-feature style contract deserves the credit for.

- **Setup** (slides 17-19) — the close. Disk layout, `devmeta.md` config, and an install
  block whose every command was checked against the live URLs and against this repo
  before it shipped.

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
