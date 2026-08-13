# Shared Context Log — deck-problem

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The deck is split across files. You own exactly one file. Do not edit any other
  page file, `slides/slides.md`, or `slides/package.json`.
- Run slidev through the `slides/` npm scripts. The global binary cannot resolve
  the theme.
- `npm run slides` prints the exact slide count and every title.

---

## Problem — done

`slides/pages/01-problem.md` written. 2 slides, headings unchanged
("Agents forget", "What DevMeta adds"). `npm run slides` → 19, exit 0.
Build clean via `npx slidev build slides.md --out <own dir>`.

**Wording later sections must stay consistent with:**

- **One-line definition of DevMeta, stated on slide 3:** "a slash-command framework
  for Claude Code". This is the deck's first and only category label. Do not restate
  it differently later (not "tool", not "system", not "workflow engine").
- **The core claim, slide 3:** "State lives on disk, in `.devmeta/` and `.tick/`,
  not in chat." Slide 17 ("What lives on disk") is the payoff for this line — it
  should read as the detailed version of it, same two directories, same order.
- **The two commands are named but not explained on slide 3**, in this order and
  with this framing: "You run two commands: `/devmeta:start-increment-spec`, then
  `/devmeta:go`." Slide 9 owns the explanation, and it is the first place
  `/devmeta:discuss-project` may be mentioned — slide 3 deliberately omits the
  optional precursor so the opening lands as "two commands".
- **Call-back pair.** Slide 2 ends with "Nothing on disk says what is done or what
  is next." Slide 3 answers with "The structure records what is done and what is
  next." Keep both lines intact — the near-identical phrasing is the hinge of the
  opening, not accidental repetition.
- Slide 2's vocabulary for the pain: **session ends**, **re-explain**,
  **compaction**, **drifts**. Reuse these words if the pain is referenced again
  rather than inventing synonyms.

**Terms introduced:** none new. No DevMeta concept nouns (increment, iteration,
feature, task, I&A cycle, tick) appear in these two slides — deliberately. Slide 4
onward introduces the hierarchy cold, which is correct; the opening should not
pre-empt it.

**For the coherence pass:**

- No hedging or superlatives used. "Do not oversell" was a spec constraint — if a
  later slide reaches for "revolutionary"/"10x", slides 2-3 set the opposite tone.
- Bullet counts: 5 and 5. Both slides have headroom under the 6-bullet cap if the
  coherence pass needs to add a bridging line.
- Longest bullet is 11 words ("Your session ends. The plan, the reasoning, the
  half-finished work — gone."). Any rewrite has 1 word of slack, not more.
- Em dash used once, on slide 2 bullet 1, for the drop-off beat. If the deck
  standardises punctuation, that one is load-bearing.
- No `v-clicks`, no `layout:`, no notes, no code fences. Stock theme surface is
  clean for 01.3.

---
