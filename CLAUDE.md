# CLAUDE.md — devmetaharness

## Read this first — `devmeta/` is live

`~/.claude/commands/devmeta` is a symlink pointing **into this repo**, at `devmeta/`.
The directory here is the real one, not a copy. Editing any file in `devmeta/` changes
the `/devmeta:*` slash commands in **every project on this machine**, immediately, with
no install step and no way to notice from inside this repo.

Do not touch `devmeta/` unless a task explicitly says to. Deck work goes in `slides/`.

## The fork

- `origin` = `juansita/devmeta` (yours). `upstream` = `mkelk/devmeta` (the original).
- **Never push to `upstream`.**
- `gh` targets upstream by default — `gh repo set-default --view` prints `mkelk/devmeta`
  (git config has `remote.upstream.gh-resolved=base`). Every `gh` command needs
  `--repo juansita/devmeta`; `gh pr create` also needs `--head juansita:<branch>`, or it
  fails with "No commits between…".

## The deck — `slides/`

A self-contained npm project. Run from `slides/`, always through its scripts:

| Script | Does |
|---|---|
| `npm run dev` | serves and opens. **Blocks — never run from a task.** |
| `npm run build` | builds to `slides/dist`. Main verification. |
| `npm run slides` | slide-count acceptance test (below) |
| `npm run export` | PDF export |

The global `slidev` binary (`/opt/homebrew/bin/slidev`) cannot resolve the theme — it
dies with `The theme "@slidev/theme-default" was not found and cannot prompt for
installation`. The theme is a local devDependency. Use the scripts.

### `npm run slides` is the acceptance test

`scripts/count-slides.mjs` loads `slides.md` through `@slidev/parser`, follows every
`src:` import, prints the exact total, and **exits 1 outside 15-20**. Currently **19**.

Run it bare and check `$?`. Piping to `grep`/`tail`/`head` returns the *pipe's* exit
code and silently swallows the failure.

### Layout

`slides/slides.md` is a thin table of contents: headmatter, title slide, then one `src:`
import per section. Content lives in `slides/pages/`, one file per section —
`01-problem.md`, `02-model.md`, `03-commands.md`, `04-example.md`, `05-setup.md`.
Edit the page file, not `slides.md`.

## Where state lives

- `.devmeta/` — increments, iteration plans, feature specs, `lessons-learned.md`.
  `.devmeta/devmeta.md` is this project's config and **is read before every DevMeta
  command**; check it before assuming a test command or a project rule.
- `.tick/` — `tk` issue tracker state, with custom merge drivers wired in
  `.gitattributes`.
- What DevMeta *is*, and what each command does: see `README.md`. Not repeated here.
