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

## Foundation — done

**What the content features inherit:**

- `slides/slides.md` is a thin table of contents. Do not edit it. It holds the
  headmatter, the title slide, and five `src:` imports in order.
- Your page file already exists with the right number of `##` headings and a `TODO`
  under each. Replace the TODOs. Keep the heading count.
- `npm run slides` prints the exact total and every title. It fails outside 15-20, so a
  dropped or added slide is caught immediately. Total is 19 right now.

**Gotchas found:**

- A `src:` block is a slide whose frontmatter carries the import. Its body must stay
  empty, or you get a stray slide.
- Concurrent builds write the same `slides/dist`. Parallel workers must pass
  `--out <own dir>` instead of `npm run build`.
- Slide 1's title comes from the deck `title:` in headmatter, not from the `#` heading.
  Cosmetic, affects the counter's output only.

---
