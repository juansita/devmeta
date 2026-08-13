# Shared Context Log — diagram-verify

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

## Known before starting (from planning)

- The build exit code does not prove a Mermaid diagram rendered. Check the screen.
- The 01.1 coherence pass found that a style contract catches local drift but not
  whole-artifact defects. Expect the same here: each diagram will be individually fine.

## REQUIRED FIX — the deck no longer defines "Task"

Slide 4's bullets held the only outright definition of a task ("one step inside a
feature → one commit"). The hierarchy diagram needed the whole slide body — keeping the
bullets overflowed the frame and clipped `Iteration 2` — so they are gone, and with them
the definition.

"Every concept in `README.md` appears on at least one slide" is an increment exit
criterion, and `task` is on that list. This is a real regression, not a nitpick, and
`reflect.md` is explicit that a gap gets fixed now rather than deferred.

Slide 7 is the right home: it already says "Tasks inside a feature are sequential steps,
not parallel workers", which describes tasks without defining them. It is at the 6-bullet
cap, so replace that bullet rather than adding one.

## Flagged by the coordinator during wave 1

- **Slide 14 may now be overloaded.** It carries its bullets, a fenced `text` block
  (`Foundation → Problem, Model, Commands, Example, Setup → Coherence`) *and* the new
  tick tree diagram. The text block shows the wave structure and the diagram shows the
  tick structure — related enough that a viewer may not see why both are there. Judge
  whether the text block still earns its place now that the diagram exists. This is
  exactly the "did the diagram orphan its slide" check in section 4 of the spec.
- **Verification method was corrected mid-iteration.** See section 1 of the spec. Two
  workers independently proved that grepping `dist/` cannot verify a Mermaid render, and
  found that the SVG lives inside the mermaid component's **shadow root** — plain
  `querySelectorAll('svg')` finds nothing even on success. Read
  `.slidev-page-N .mermaid` → `shadowRoot` to reach it. Their context logs have working
  code.

---
