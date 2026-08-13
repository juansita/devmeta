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

## Theme — done. Read this before starting motion work.

**Theme:** `seriph` (`@slidev/theme-seriph@^0.25.0`, added to `slides/package.json`).
Maintained by the Slidev team, serif titles, plain body — right register for a technical
talk, and it needed no slide rewrites.

**Transition:** `slide-left`, set in the `slides.md` headmatter. It applies deck-wide, so
motion features do **not** need to set a per-slide `transition:` and should not.

**Headmatter is now:**

```yaml
theme: seriph
title: How DevMeta Works
info: How DevMeta turns a Claude Code session into a repeatable delivery loop.
transition: slide-left
mdc: true
```

Do not change these keys. The Motion — setup and title feature owns the title slide
*body* in `slides.md`, not the headmatter.

### The at-risk slides, measured under the new theme

Rendered headlessly at 1280×720 and compared each slide's content bounding box against
its frame:

| Slide | Why it was at risk | Result |
|:-----:|--------------------|--------|
| 4 | heading plus a diagram that already fills the frame | **FITS** — 1px bottom, within tolerance |
| 17 | fenced `.devmeta/` tree block | **FITS** — 0px |
| 19 | two fenced code blocks | **FITS** — 0px |

**Slide 4 has 1px of headroom and nothing else.** That is the number to remember. Adding
anything to slide 4 will overflow it. If a stepped build does not fit there, leaving it
un-animated is the correct call, not a compromise.

### Checks

`npm run build`, `npm run slides` (19) and `npm run diagrams` (all three render) all exit
0 after the theme change. The diagrams are not clipped by `seriph`.

---
