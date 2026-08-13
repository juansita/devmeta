# DevMeta Project Config

Project: **devmetaharness** — a sandbox for trying DevMeta. First deliverable is a
Slidev presentation that explains how DevMeta works.

## Testing

This repo has no automated test suite. Verify work with these commands instead:

```bash
cd slides && npm run build     # deck must build with no errors
```

If a task changes a `devmeta/*.md` command file, verify by reading it — there is
nothing to execute.

## Environment

Check these before the first iteration of an increment:

```bash
node --version      # expect v20 or later
slidev --version    # expect 52.x or later
tk version          # expect 0.24 or later
gh auth status      # must be logged in
```

## Additional Rules

- The repo is a fork of `mkelk/devmeta`. `upstream` is the original. Never push to
  `upstream`.
- The `devmeta/` directory holds the upstream command definitions. Do not change it
  unless a task says so — it is symlinked to `~/.claude/commands/devmeta` and edits
  change the live slash commands in every project.
- Put all presentation work in `slides/`. It is a self-contained npm project. Keep it
  separate from `devmeta/`.
- Run slidev through the `slides/` scripts (`npm run dev|build|export`). The global
  binary cannot resolve the theme.
- Do not run `npm run dev` from a task — it blocks. Use `npm run build` to verify.
