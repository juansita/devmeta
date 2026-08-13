# Shared Context Log — project-claude-md

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The hazard this file exists for: `devmeta/` is symlinked to
  `~/.claude/commands/devmeta`. An edit there changes the live slash commands in every
  project on this machine.
- You own ONE file: `CLAUDE.md` at the repo root. Do not touch `slides/` or `.devmeta/`
  except your own context-log.
- Verify every claim against the machine before writing it. The 01.1 Setup feature set
  this precedent and it caught real detail.

---

## D — Project `CLAUDE.md` (worker)

Created `CLAUDE.md` at the repo root. 58 lines. Touched nothing else.

### Claims verified, with the exact command used

| Claim as written in `CLAUDE.md` | Command run | Result |
|---|---|---|
| `~/.claude/commands/devmeta` is a symlink pointing into this repo | `readlink ~/.claude/commands/devmeta` | `/Users/kristofferjoanesarson/devmetaharness/devmeta` |
| The repo's `devmeta/` is the real directory, not a copy | `readlink /Users/.../devmetaharness/devmeta` | empty — plain directory, so edits here *are* the live commands |
| `origin` is `juansita/devmeta`, `upstream` is `mkelk/devmeta` | `git remote -v` | confirmed both |
| `gh` targets upstream by default | `gh repo set-default --view` | prints `mkelk/devmeta` |
| …and why | `git config --get-regexp 'remote\.'` | `remote.upstream.gh-resolved base` |
| `--head juansita:<branch>` needed, "No commits between…" | `.devmeta/lessons-learned.md` (01.1) | recorded there |
| The four `slides/` scripts and what each runs | read `slides/package.json` | `dev` (`--open`), `build`, `export`, `slides` |
| Global `slidev` cannot resolve the theme | built a throwaway `theme: default` deck in scratchpad, ran `slidev build slides.md` with `/opt/homebrew/bin/slidev` | `The theme "@slidev/theme-default" was not found and cannot prompt for installation` — exact string quoted in the file |
| `npm run slides` = exact count across `src:` imports, exits 1 outside 15-20 | read `slides/scripts/count-slides.mjs` | `MIN=15`, `MAX=20`, `load()` + `data.slides.length`, `process.exit(1)` |
| Count is currently 19 | `cd slides && npm run slides` | `slides: 19`, bare exit 0 |
| Piping swallows the exit code | `false \| tail -1; echo $?` vs `false; echo $?` | `0` vs `1` — shell-level proof, not just recall |
| `slides.md` is a thin TOC, one `src:` per section | read `slides/slides.md`, `ls slides/pages/` | 30 lines, 5 imports, 5 page files |
| `.devmeta/devmeta.md` read before every DevMeta command | `README.md` "Per-Project Configuration"; file exists on disk | confirmed |
| `.tick/` + merge drivers | `ls .tick/`, `cat .gitattributes` | `issues/`, `activity/`, `config.json`; `merge=tick` and `merge=tick-activity` |

### Post-write check

- `wc -l CLAUDE.md` → **58** (under the 60 limit).
- `cd slides && npm run slides` → bare exit **0**, reports **19**. Nothing broken.
- `npm run build` deliberately **not** run — three workers were editing `slides/pages/`
  concurrently, so a build result would not have been attributable. The count test is
  read-only and was the safe check.

### Spec/reality mismatch, reported not silently fixed

The spec's check table sources two claims to `.devmeta/lessons-learned.md`:

- **`gh` needs `--repo juansita/devmeta`** — correct, it is there (01.1 section).
- **Global `slidev` cannot resolve the theme** — *not* in `lessons-learned.md`. It lives
  in `.devmeta/devmeta.md` under Additional Rules, and is echoed into six
  `projects/*/context-log.md` files. I verified it against the machine instead of citing
  it, so the claim in `CLAUDE.md` is sound either way. Flagging for the I&A cycle: a rule
  every worker is told costs six copies today and is missing from the one file that is
  supposed to accumulate learnings.

### Note for later iterations

`CLAUDE.md` quotes two things that can drift: the current slide count (**19**) and the
`slides/pages/` file list. Iteration 01.3 changes theme and motion, not structure, so
both should hold — but if a page file is ever added, split, or renamed, this file needs
the same edit.

---
