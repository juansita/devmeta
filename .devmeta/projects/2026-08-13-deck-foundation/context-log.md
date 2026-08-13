# Shared Context Log — deck-foundation

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- Slidev `src:` imports work on 52.19.0 and reach the built output. Verified with a
  3-file test deck.
- `@slidev/parser/fs` `load()` takes `(rootsInfo, filepath)`. The one-argument form
  throws `ERR_INVALID_ARG_TYPE`.
- The global `slidev` binary cannot resolve `@slidev/theme-default`. Always run through
  the `slides/` npm scripts.

---
