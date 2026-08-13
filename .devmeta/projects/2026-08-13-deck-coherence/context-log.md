# Shared Context Log — deck-coherence

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## Coherence pass — verification record

### Concept checklist (increment exit criterion)

Every concept in `README.md` appears on at least one slide. Slide numbers are from
`npm run slides`.

| Concept | Introduced | Also on |
|---------|:----------:|---------|
| Increment | 5 | 4, 13, 16 |
| Iteration | 6 | 4, 14, 16 |
| Feature | 7 | 4, 15 |
| Task | 7 | 4, 15 |
| I&A cycle | 8 | 4, 11, 16 |
| `/devmeta:discuss-project` | 9 | — |
| `/devmeta:start-increment-spec` | 9 | 3, 13, 19 |
| `/devmeta:go` | 9 | 3, 5, 10, 12, 14, 16, 19 |
| `/devmeta:plan-iteration` | 11 | 12 |
| `/devmeta:run` | 11 | 12 |
| `/devmeta:reflect` | 11 | 12 |
| `/devmeta:status` | 11 | 12 |
| `.devmeta/` layout | 17 | 3 |
| `devmeta.md` config | 18 | — |
| `tk`'s role | 7 | 17 |

### Mechanical criteria

- `npm run slides` → 19, exit 0. Titles match the outline table exactly.
- `npm run build` → exit 0.
- Exactly 3 `DIAGRAM-PLACEHOLDER` comments: slides 4, 10, 14. One per page file that
  needs one, none elsewhere.
- No `v-clicks`, no `layout:`, no `transition:`, no `<style>` anywhere. The only
  `theme:` is `default` in `slides.md`. Iteration 01.3 has a clean surface.
- Every bullet is at most 12 words. Every slide is at most 6 bullets.

### Defects found and fixed

1. **`tk` was used but never introduced.** Slide 7 referenced it and slide 17 assumed
   it. Slide 7's last bullet now reads "`tk`, the tracker holding this structure, calls
   a feature an epic."
2. **Slide 16 repeated slide 8's payoff.** Both said the I&A cycle writes lessons for
   the next iteration. Slide 16 now carries this iteration's actual lesson instead —
   something only the worked example can offer.
3. **One 13-word bullet** on slide 14, against a 12-word cap. Trimmed.

### Deliberate seams, left alone

- **Slide 3 says "two commands", slide 9 is titled "The three you run".** Not a
  contradiction: slide 9 leads with `/devmeta:discuss-project` being optional and closes
  with "in day-to-day use, that is the whole surface". The opening stays punchy, the
  detail arrives when it is useful.
- **Slide 15 says "commit and tests per task".** That is DevMeta's model per `run.md`.
  This iteration deviated — the coordinator committed, the workers did not — because
  five parallel subagents cannot share one git index. The deck teaches the model, not
  this harness's workaround. The deviation is recorded in the iteration `status.md` for
  the I&A cycle to rule on.
- **Heading style varies by section** (nouns in the model section, phrases in commands,
  "Step N —" in the example). Each section is internally consistent and the variation
  signals a change of mode. Left as is.

---
