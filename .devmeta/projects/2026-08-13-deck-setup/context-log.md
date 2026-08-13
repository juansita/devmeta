# Shared Context Log — deck-setup

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## Setup (slides 17-19) — done

**Install commands verified, and how:**

- `curl -fsSL https://ticks.sh/install | sh` — fetched it. HTTP 200, real Ticks
  installer script for `pengelbrecht/ticks`, installs `tk` to `~/.local/bin`.
  Matches this machine: `which tk` → `/Users/kristofferjoanesarson/.local/bin/tk`.
- `git clone https://github.com/mkelk/devmeta.git` — HTTP 200. Same URL as
  `README.md` > Installation.
- `ln -s "$PWD/devmeta/devmeta" ~/.claude/commands/devmeta` — `ls -la ~/.claude/commands/`
  shows `devmeta -> /Users/kristofferjoanesarson/devmetaharness/devmeta`. The link target
  is `<clone>/devmeta`, which is what the slide's one-liner produces from the clone's
  parent directory. README does the same thing in two steps (`cd devmeta` first).
- `tk init` — real subcommand. `tk init --help`: "creates the .tick directory structure,
  detects the GitHub repository and owner, and sets up the merge driver". Confirmed on
  this repo: `.tick/{config.json,issues/,activity/}`, `git config` has `merge.tick.driver`
  and `merge.tick-activity.driver`, `.gitattributes` maps `.tick/issues/*.json merge=tick`.
  So the "merge driver, no conflicts" claim on slide 17 is checked, not assumed.
- `tk version` → `tk 0.24.0`, matching the floor in `.devmeta/devmeta.md` > Environment.

**Wording the coherence pass should align elsewhere:**

- Slide 17 calls a tick file "one JSON file per tick" and uses the word **tick**, never
  "issue", even though the directory is `.tick/issues/`. Keep that everywhere.
- Slide 19 ends on `/devmeta:start-increment-spec` then `/devmeta:go`, in that order,
  with `discuss-project` omitted entirely — it is optional and the close should be the
  short path. Slide 9 introduces all three; that is the only place the optional one
  belongs.
- "Scope it once, then let `/devmeta:go` drive." is the deck's last line. If slide 3 or
  slide 10 uses a similar drive/loop phrasing, let this one stay the final word and
  vary the earlier one.
- Slides 17-19 say **pre-flight checks**, **I&A cycle**, **increment**, **iteration**,
  **feature**, **task**. No "epic" in prose (slide 7 owns that one mention).
- Second fenced block on 19 is tagged ```text (slash commands are not bash). Same
  choice for the tree on 17. If another page fences slash commands, match the tag.

**Checks:** `npm run slides` → 19, exit 0. `npx slidev build --out <own dir>` → built
clean in 751ms; grepped the output bundle for `ticks.sh/install` to confirm the new
content actually reached it.

---
