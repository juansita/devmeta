# Feature Spec — Deck Setup

**Iteration:** 01.1
**Wave:** 2 (parallel with B, C, D, E)
**Owns:** `slides/pages/05-setup.md` — 3 slides, exactly

---

## Scope

The close. What DevMeta writes to disk, how to configure it per project, and the exact
steps to start. The audience should be able to act on slide 19 without notes.

---

## Source material

- `README.md` — "Installation", "Project Structure", "Per-Project Configuration"
- `.devmeta/devmeta.md` in this repo — a real, filled-in example
- `devmeta/go.md` — "Commit Metadata to Base Branch", for why the state is git-tracked

---

## Implementation guide

### Slide 17 — What lives on disk

- Show the `.devmeta/` tree in a fenced block. Trim it to what matters: `devmeta.md`,
  `current-increment.md`, `project-history.md`, `lessons-learned.md`, `increments/`,
  `projects/`.
- Mention `.tick/` alongside it: one JSON file per tick, git-tracked, with a merge
  driver so branches do not conflict.
- The point to land: it is all plain files in your repo. It branches and merges with
  your code, and you can read it yourself.

### Slide 18 — Per-project config

- `.devmeta/devmeta.md` tunes DevMeta for one project. Every command reads it first.
- Three sections: `## Testing`, `## Environment`, `## Additional Rules`.
- One line on each — the test commands to run, the pre-flight checks, the project
  constraints.
- Without it, DevMeta falls back to `package.json` scripts and skips environment checks.
- Worth writing. It is what stops the agent guessing how to test your project.

### Slide 19 — Get started

The actionable close. A fenced `bash` block, then one line of encouragement.

```bash
curl -fsSL https://ticks.sh/install | sh          # tk, the tick tracker
git clone https://github.com/mkelk/devmeta.git
ln -s "$PWD/devmeta/devmeta" ~/.claude/commands/devmeta
cd your-project && tk init
```

Then the two commands, as the last thing on the screen:

```
/devmeta:start-increment-spec "Your feature"
/devmeta:go
```

---

## Style contract

Read `.devmeta/increments/increment-01-zmf/iterations/iteration-01.1/plan.md` >
"Style contract" and follow it exactly. Summary of the parts most often broken:

- One `##` heading per slide, first line.
- Max 6 bullets, max 12 words each.
- Second person, present tense.
- Full command names in backticks.
- Stock theme only. No `v-clicks`, no custom layouts, no transitions.

Slide 19 may exceed the bullet limit, because the two fenced blocks carry it. Keep the
prose around them to two lines.

---

## Test strategy

```bash
cd slides && npm run build     # must exit 0
cd slides && npm run slides    # your file must contribute exactly 3 slides
```

Verify the install commands are real. `tk init` and the `ln -s` path must match what
this repo actually did.

---

## Open questions

None.
