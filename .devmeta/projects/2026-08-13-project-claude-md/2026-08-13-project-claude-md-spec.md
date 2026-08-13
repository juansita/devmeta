# Feature Spec — Project CLAUDE.md

**Iteration:** 01.2
**Wave:** 1 (parallel with the three diagram features)
**Owns:** `CLAUDE.md` at the repo root

---

## Scope

Close the gap I&A cycle 01.1R found: nothing in this repo orients a fresh session, and
one of the unmarked hazards can change the user's live slash commands machine-wide.

This is not deck work. It is added scope, and the rationale is recorded in
`_overview.md` under the iteration map.

---

## Architecture

**Creates:** `CLAUDE.md` at the repo root.

**Modifies:** nothing.

---

## Implementation guide

Read the "D — Project `CLAUDE.md`" brief in
`.devmeta/increments/increment-01-zmf/iterations/iteration-01.2/plan.md`. It lists what
must be covered, in priority order.

Verify every claim before writing it:

| Claim | How to check |
|-------|--------------|
| `devmeta/` is symlinked to the live commands | `ls -la ~/.claude/commands/` |
| `upstream` is `mkelk/devmeta` | `git remote -v` |
| `gh` needs `--repo juansita/devmeta` | recorded in `.devmeta/lessons-learned.md` |
| The `slides/` scripts | `slides/package.json` |
| Global `slidev` cannot resolve the theme | recorded in `.devmeta/lessons-learned.md` |
| `npm run slides` behaviour | `slides/scripts/count-slides.mjs` |

Under 60 lines. This file is read at the start of every session in this repo, so every
line has to earn its place. Lead with the hazard — a fresh agent should hit it before it
hits anything else.

Do not restate what `README.md` already says about DevMeta itself. Point at it.

---

## Test strategy

```bash
cd slides && npm run build     # exit 0 — must be unaffected
cd slides && npm run slides    # must still report 19
wc -l CLAUDE.md                # under 60
```

Re-read the finished file as a fresh agent. Would it stop you making the symlink
mistake? If not, rewrite the opening.

---

## Open questions

None.
