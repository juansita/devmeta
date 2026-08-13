# Project History

Narrative record of what was built, newest first.

## 2026-08-13 — Increment 01-zmf, iteration 01.3, wave 2

Three motion features in parallel, one per pair of page files. 13 of 19 slides carry
reveals, 66 click steps in total.

What stands out is what the workers **declined** to animate, and that each of them said
why. Slide 4 was left completely static: it has no bullets to wrap and 1px of headroom,
so the only way to step it would be editing the Mermaid graph, which the motion contract
forbids. Slides 10 and 14 were left static because the diagram is the payload and the
bullets around it are a single thought. Slide 6 was left static on purely editorial
grounds — stepping a five-rule checklist turns it into false suspense, and it gives the
four consecutive definition slides a static beat. The title slide was left static because
stepping it delays the deck's own name. Every one of those was recorded as a deliberate
decision so the layout pass cannot undo them by accident.

The technical finding that made animating tight slides safe: Slidev's default hidden
state is opacity-based, so a hidden bullet keeps its box and the layout is byte-identical
at every click index. A slide that fit before fits at every step. That does **not** hold
for `v-click.hide`, which removes the box — worth knowing before anyone animates a
0px-headroom slide with it.

Two workers verified click wiring headlessly rather than inferring it from a green build,
and one negative-tested its own overflow measurement by pasting eight paragraphs onto
slide 19: the build stayed green and the measurement went red at 111px. The habit has
stuck without being asked for each time.

## 2026-08-13 — Increment 01-zmf, iteration 01.3, Feature Theme

Switched the deck from the stock `default` theme to `seriph` and set a deck-wide
`slide-left` transition. Serif titles, plain body — the right register for a technical
talk, and it needed no slide rewrites.

The measurement that matters for the rest of the iteration: rendered headlessly at
1280×720, slide 4 has **1px of vertical headroom** and slides 17 and 19 have exactly 0px
of overflow. Slide 4 is heading-plus-diagram with no bullets because its bullets caused an
overflow in 01.2, and under the new theme it is still right at the edge. Anything added
there will break it.

## 2026-08-13 — Iteration 01.2 complete (I&A cycle 01.2R)

The diagrams landed, but the story of this iteration is that the way it planned to check
them could not work.

Three features were told to prove their diagram had rendered by grepping the built
bundle for node labels. That is impossible: Slidev lz-string-compresses Mermaid source
into a `code-lz` prop, so no label ever appears in `dist`. The obvious next move fails
too — the rendered SVG lives inside the mermaid component's shadow root, where
`querySelectorAll('svg')` returns nothing even on success. Two workers found both facts
independently, and both stopped and said so rather than reporting a pass they could not
justify. The spec was rewritten mid-iteration, and the method that works is now
`npm run diagrams`.

The I&A review then found a false pass hiding inside that very check. It fell back to
"any `.mermaid` element on the page" when the per-slide selector missed — and because
Slidev keeps every slide in the DOM, a missing diagram on slide 14 could have passed by
quietly reading slide 4's. Verification code that degrades gracefully is worse than none.
The fallback is gone, the slide list is now derived from source instead of hardcoded, and
the fixed sleep is a proper wait. Then the check was broken on purpose: the build stayed
green and the check went red, which is the only way to know a check works.

The regression was smaller but the same shape. Slide 4's bullets had to go for layout —
a three-deep nested graph needs the whole slide body — and they turned out to hold the
deck's only definition of "task", which is on the increment's concept checklist. The
worker that removed them noticed and flagged it rather than shipping quietly.

Scope grew once and never shrank: `CLAUDE.md` was added by the previous I&A cycle and
delivered here, 58 lines, every claim checked against the machine rather than recalled.

What the framework got right this iteration was the reporting culture. Four workers, four
honest "here is something wrong with what you told me" messages, none of them papering
over a gap to close a task. What it got wrong was assuming a verification method needs no
verification.

## 2026-08-13 — Increment 01-zmf, iteration 01.2, wave 1

Four features in parallel: three Mermaid diagrams and the project `CLAUDE.md`.

- **Hierarchy diagram** (slide 4) — nested subgraphs, no edges at all, so containment is
  carried visually rather than implied by arrows. Seven nodes. The bullets had to go
  entirely: a three-deep `graph TD` needs the whole slide body, and keeping them
  overflowed the frame and clipped `Iteration 2`. The Mermaid contract's "the diagram
  replaces them, it does not join them" turned out to be a layout constraint, not just an
  editorial preference.
- **Loop diagram** (slide 10) — four nodes, `graph LR`, with both edges out of "Inspect
  and adapt" labelled so the back-edge and the stopping condition are explicit.
- **Tick tree diagram** (slide 14) — seven nodes, trimmed from the real iteration 01.1
  tree. The PR and I&A tasks sit on the features' row, which is the structural point
  people get wrong.
- **Project `CLAUDE.md`** — 58 lines, every claim checked against the machine before
  writing. Leads with the symlink hazard.

The iteration's real discovery was that **the planned way of verifying a diagram did not
work.** Two workers independently proved that grepping the built bundle cannot confirm a
Mermaid render, because Slidev lz-string-compresses the source into a `code-lz` prop, and
that the rendered SVG lives inside the component's shadow root where
`querySelectorAll('svg')` finds nothing even on success. Both switched to headless
`playwright-chromium` reading through `shadowRoot`, and both reported the correction
rather than quietly passing. The verify spec was rewritten mid-iteration to use the
method that works.

One regression came out of it: removing slide 4's bullets removed the deck's only
definition of "Task", which is on the increment's concept checklist. Caught by the worker
that caused it, flagged rather than papered over, and handed to the verification wave.

## 2026-08-13 — Iteration 01.1 complete (I&A cycle 01.1R)

The content spine landed in a single session. Thirteen commits, seven features, PR #1
merged into `2026-08-13-devmeta-deck`.

The decision that shaped everything was made before any content was written. The
deliverable was one Markdown file, which meant parallelism of one. Slidev's `src:`
imports turned it into six files, and the whole feature graph followed from that: one
foundation feature, five content features that could not collide because each owned a
different file, and one coherence pass that ran alone because it was the only thing
allowed to touch them all. The mechanism was smoke-tested on a throwaway three-file deck
before the plan was built on it — two minutes that would have invalidated everything if
they had gone the other way.

The five parallel workers cost roughly 45-50k tokens each and finished within two
minutes of one another. Every one of them stayed inside its file, ran the checks it was
told to run, and appended honest notes to its context log. The Setup worker fetched the
ticks install URL and confirmed the symlink and the git merge driver on disk before
writing a single install line, because its spec said not to ship a command it had not
checked. The Example worker found that its slide described `run.md`'s commit-per-task
model while this very iteration was deviating from it, taught the model anyway, and
flagged the mismatch rather than quietly choosing. That is the behaviour the harness
wants, and it happened without being asked for specifically.

What the style contract could not do was see the deck whole. It produced zero
terminology drift across five independent writers — no forbidden vocabulary, consistent
command formatting, the word "epic" confined to the one slide that explains it. But
`tk` was used on slide 7 and named on slide 17 without ever being introduced, and slides
8 and 16 both claimed the same payoff. Neither defect is visible from inside a single
feature. The coherence wave earned its place.

Where the framework fought the machine: `/devmeta:run` calls for one branch per feature,
and five subagents cannot each check out a branch in one working tree. Git worktrees
were the obvious answer and would have failed, because `slides/node_modules` is not
tracked and the build would have died inside them. The iteration used one work branch
with the coordinator committing on each worker's behalf, and recorded the deviation
rather than hiding it. `gh pr create` also defaulted to the upstream repo rather than the
fork, which is worth knowing before it opens a pull request against someone else's
project.

The self-learning system worked in the direction it was supposed to. Every lesson in
`lessons-learned.md` came out of something that actually happened, and iteration 01.2
inherits a working slide counter, a proven file split, and a written record of what the
parallel model can and cannot do.

## 2026-08-13 — Increment 01-zmf, iteration 01.1, content features

Five content features ran in parallel, one subagent each, each owning one file in
`slides/pages/`.

- **Problem** (slides 2-3) — the opening. Slide 2 names the pain: session ends, context
  dies, nothing on disk says what is done. Slide 3 turns it: state lives in `.devmeta/`
  and `.tick/`, and you drive it with two commands. Fixes the deck's category label for
  DevMeta as "a slash-command framework for Claude Code", and deliberately introduces no
  concept nouns, so slide 4 can present the hierarchy cold.

- **Model** (slides 4-8) — the conceptual core. Slide 4 gives the whole hierarchy with
  a "produces" clause per unit; slides 5-8 take increment, iteration, feature and I&A
  cycle one at a time. Sets the vocabulary the rest of the deck inherits, and confines
  the word "epic" to slide 7 where `tk`'s naming is explained.
- **Commands** (slides 9-12) — the practical half. The three commands you run, what
  `/devmeta:go` does, the four it calls for you, and why calling those yourself breaks
  the loop. Every claim traced back to `README.md`, `devmeta/go.md`, or a command file's
  frontmatter.

- **Example** (slides 13-16) — one increment end to end, using this deck's own
  increment. Real title, real exclusions, real seven-feature split, real iteration tick
  `7pv`. The self-reference lands on slide 13 and again on slide 15, where the slide
  names the file it came from.
- **Coherence** (all pages) — the pass that made five parallel files read as one deck.
  Found three real defects: `tk` was used from slide 7 and named on slide 17 without
  ever being introduced; slide 16 repeated slide 8's payoff instead of adding to it; one
  bullet ran 13 words against a 12-word cap. Terminology was already clean across all
  five files, which the per-feature style contract deserves the credit for.

- **Setup** (slides 17-19) — the close. Disk layout, `devmeta.md` config, and an install
  block whose every command was checked against the live URLs and against this repo
  before it shipped.

## 2026-08-13 — Increment 01-zmf, iteration 01.1, Feature Foundation

Split the deck across files so five content features can run in parallel.
`slides/slides.md` is now a thin table of contents: headmatter, one title slide, and
five `src:` imports pointing at `slides/pages/`. Each content feature owns exactly one
page file, so no two features write the same file.

Added `slides/scripts/count-slides.mjs`, wired up as `npm run slides`. It loads the deck
through `@slidev/parser`, follows `src:` imports, prints the count and every title, and
exits non-zero outside 15-20. Reports 19, matching the outline exactly.

Stub pages carry their final slide counts (2/5/4/4/3) from the start, so the total is
correct before any content is written.

## 2026-08-13 — Harness set up

Forked `mkelk/devmeta` into `devmetaharness`. Installed `tk` 0.24.0, the ticks skill,
and Slidev 52.19.0. Linked `devmeta/` to `~/.claude/commands/devmeta`. Ran `tk init`
and created the `.devmeta/` scaffold. No increment started yet.
