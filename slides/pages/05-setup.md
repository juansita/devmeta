## What lives on disk

```text
.devmeta/
  devmeta.md              # per-project config
  current-increment.md    # pointer to the active increment
  project-history.md      # what you built, in order
  lessons-learned.md      # what each I&A cycle taught you
  increments/             # scope, iteration plans, I&A reports
  projects/               # feature specs and context logs
```

- `.tick/` sits alongside it, one JSON file per tick.
- Both are git-tracked, so state branches and merges with your code.
- `tk init` installs a merge driver, so parallel branches never conflict.
- Plain Markdown and JSON. You can read all of it yourself.

---

## Per-project config

- Every DevMeta command reads `.devmeta/devmeta.md` before it acts.
- `## Testing` — the exact commands that prove your work.
- `## Environment` — pre-flight checks to run before the first iteration.
- `## Additional Rules` — the constraints this project must not break.
- Without it, DevMeta guesses from `package.json` and skips environment checks.
- Write it once. It stops the agent guessing how to test you.

---

## Get started

```bash
curl -fsSL https://ticks.sh/install | sh          # tk, the tick tracker
git clone https://github.com/mkelk/devmeta.git
ln -s "$PWD/devmeta/devmeta" ~/.claude/commands/devmeta
cd your-project && tk init
```

Then, in Claude Code from your project, you run two commands:

```text
/devmeta:start-increment-spec "Your feature"
/devmeta:go
```

Scope it once, then let `/devmeta:go` drive.
