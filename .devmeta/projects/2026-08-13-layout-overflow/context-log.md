# Shared Context Log — layout-overflow

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- Read the three motion context logs before changing anything. They record deliberate
  decisions not to animate, which must not be undone by accident.
- `verify-diagrams.mjs` is the reference implementation for headless checks. The I&A
  cycle hardened it: no fallback selectors, derive from source, wait rather than sleep.
- Negative-test any check you write, immediately.

---
