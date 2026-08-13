# Shared Context Log — theme

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- This runs alone. Three motion features start the moment it closes and will read the
  headmatter you write.
- The global `slidev` binary cannot resolve themes. Install into `slides/package.json`
  and run through the npm scripts.
- Slides at risk from a theme change: 4 (diagram fills the frame), 17 and 19 (fenced
  blocks).

---
