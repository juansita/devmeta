---
description: Plan an iteration (global) — refine scope into feature specs, graph-partition for independence
argument-hint: [iteration-number]
---

## Project Context

Read `.devmeta/devmeta.md` from the project root if it exists. It provides
project-specific test commands, environment checks, and additional rules.

If no `.devmeta/devmeta.md` exists:
- Testing: look for `package.json` test scripts
- Environment: skip checks
- Additional rules: none

> **tk mapping:** tk -t epic = DevMeta Feature, tk -t task = DevMeta Task

---

## Context

- Today's date: !`date +%Y-%m-%d`
- Target iteration: $ARGUMENTS
- Ticks initialized: !`test -d .tick && echo "yes" || echo "no"`

## Design Philosophy

**The feature is the unit of context.** Each feature runs in one subagent session (~200k tokens). Tasks within a feature are sequential steps — not independent workers.

**Your primary job is finding feature boundaries that maximize independence.** More independence = more parallelism = faster wall-clock time.

**Workers are smart.** They have the project's own orientation docs (`CLAUDE.md` / `AGENTS.md`, and `docs/current/` if the repo keeps one), the spec, and the codebase. Task descriptions guide — they don't micromanage.

**This project uses AI-agentic development.** All code is written by agents. Prioritize consistency, mainstream patterns, and well-known libraries — per the repo's own recorded decisions, wherever it keeps them.

## Your Task

### Step 0: Ground yourself in a CURRENT tree, then initialize

**Do this before reading a single project file.** A worktree that has never been
pulled is the normal case, not the exception.

```bash
git fetch -q
git rev-list --left-right --count origin/<default-branch>...HEAD
```

Detect the default branch — `main` and `master` both occur — with
`git symbolic-ref refs/remotes/origin/HEAD`. Never assume.

**If the left number is non-zero, you are behind. Stop and say so**, with the
count, before doing anything else. Offer the fast-forward
(`git merge --ff-only origin/<default>`); do not research, plan or write on a
stale tree.

This is not hygiene. A discussion document was once researched on a worktree
**218 commits behind** and described a hosting provider, a public tunnel and a
model backend that had all been removed months earlier — every load-bearing fact
in it was wrong, and it read as confident and specific because the stale tree was
internally consistent. The project's own `AGENTS.md` already carried the rule
(*fetch before you judge git state*); the commands did not inherit it, and an
agent following the command faithfully never ran the fetch.

Also confirm you are in the checkout you think you are: the project may run in
several worktrees, and at least one is usually stale. `git worktree list`.

Only once the tree is current, initialize the tracker:

```bash
tk list 2>/dev/null || tk init
```

### Step 1: Read the Iteration Plan

Read the increment overview and the specific iteration plan:

```
Current increment's _overview.md (find via .devmeta/current-increment.md)
Current increment's iterations/iteration-<N>/plan.md  (if exists)
```

If no detailed plan exists yet for this iteration, read the overview's rough scope and create the iteration's `plan.md` with refined scope.

Also read:
- `CLAUDE.md` — project orientation
- the repo's architectural decisions — `docs/current/principles-and-choices.md` **if it exists**; otherwise `AGENTS.md`, `.devmeta/devmeta.md`, or the equivalent this repo actually keeps
- `.devmeta/lessons-learned.md` — don't repeat past mistakes
- Any relevant spec or architecture docs referenced in the increment overview

> **`docs/current/` is optional and often absent.** Several DevMeta commands name
> it as though it always exists; many repos never adopt it and keep the same
> knowledge in `AGENTS.md`, `CLAUDE.md`, `.devmeta/devmeta.md`, `.devmeta/lessons-learned.md`
> or a `docs/` tree of their own. **Read what the repo actually has** — check
> before citing, and never fail or stall because the path is missing.
>
> This matters more than it looks: a harness that instructs an agent to read a
> file which does not exist is committing the same defect the increments using it
> spend their time removing. If a repo has no `docs/current/`, that is a choice,
> not a gap to fill.

### Step 1.5: Scope Check — Does This Iteration Still Make Sense?

Before planning in detail, evaluate the iteration's scope against what actually exists:

1. **Is the scope too large for one iteration?** If mapping the work produces 8+ features or the foundation feature alone is massive, **split the iteration.** Update the current increment's `_overview.md` directly. Renumber subsequent iterations.
2. **Has previous work already covered some of this scope?** Remove deliverables that are already done.
3. **Are there new deliverables that belong here?** Cleanup tasks from the previous reflection, discoveries during implementation, or prerequisites that weren't anticipated.
4. **Is the iteration order still right?** If this iteration depends on something from a later iteration, reorder.

If you restructure, update the current increment's `_overview.md` and note the change in `.devmeta/project-history.md`. Then continue planning.

**Check `## Carried` in this increment's `_overview.md`** and in any previous
increment's. Work that became unblocked elsewhere is a candidate for scope here —
but it is a decision to make deliberately at planning time, not a to-do list to
hand the user.

### Step 2: Map the Work

Read the iteration plan thoroughly and explore the codebase. Build a complete picture:

1. **List all deliverables** — every feature, component, service, migration, test
2. **Map file footprints** — for each deliverable, which files will be created or modified
3. **Identify shared code** — files or modules that multiple deliverables depend on
4. **Note the test strategy** — surgical test commands per task (from `.devmeta/devmeta.md > Testing` if available)

**Output a work-to-file matrix** (internal analysis):

```
Deliverable A → creates: file1, file2 | modifies: file3
Deliverable B → creates: file4 | modifies: file3, file5
Shared files: file3 (A, B)
```

**Multi-repo mode** (`devmeta.md` has a `## Repos` section): map footprints **per repo** — every deliverable names the repo it lands in (from the increment's `_overview.md > Repos`). Prefer feature boundaries that keep each feature within ONE repo; a cross-repo feature is allowed only when the change is genuinely atomic across repos, and must name all its repos.

### Step 3: Find the Cuts (THE CRITICAL STEP)

Graph partitioning — group deliverables into features:

1. **Cluster by shared files.** Deliverables modifying the same files belong together.
2. **Extract shared foundations.** Schemas, types, utilities, shared components → foundation feature.
3. **Check independence.** Can each non-foundation feature run without others? If not, move more to foundation or add minimal cross-feature deps.
4. **Check sizing.** Each feature should fit in ~60-70% of context. Split if too large, merge if trivially small.
5. **Maximize the parallel frontier.** How many features run simultaneously after foundation? Optimize for this.

**General dependency ordering heuristics:**
- Shared types, interfaces, and schemas belong in foundation (they must exist before consumers)
- Config and environment loading belongs in foundation
- Storage/persistence layer belongs in foundation (other layers read/write it)
- Service layers that share a persistence layer can be parallel after foundation
- CLI/API/web layers depend on core services being functional

### Step 4: Create Feature Specs

For each feature, create a spec file:

```
.devmeta/projects/YYYY-MM-DD-<feature-name>/YYYY-MM-DD-<feature-name>-spec.md
```

Each spec contains:
- Scope (what this feature delivers)
- Target repo (multi-repo mode: slug + local path from `devmeta.md > Repos`)
- Architecture (files to create/modify)
- Implementation guide (ordered steps)
- Test strategy (surgical commands)
- Open questions (if any)

### Step 4.5: Every user-facing artifact gets a cold read

**If a feature produces something a human other than its author will follow —
a README, a setup guide, a runbook, an onboarding path, an API's public docs, a
migration procedure — its LAST task is a cold read, and the feature does not close
without one.**

A cold read is a subagent given the repository and **the artifact alone**, with no
conversation history, no spec, and no idea what the author intended. Tell it to
follow the thing as its intended reader and to be adversarial. Concretely:

```
You are a stranger to this codebase. You have <the reader's situation> and you
have been handed exactly one document: <path>.

Read ONLY that file first, cover to cover, before looking at anything else.
Then report:
1. Everything you would need before step 1 could succeed — including what the
   document implies but never names.
2. Every value you must produce yourself, and whether it says how.
3. Every step that assumes something already exists on the author's machine —
   an account, a file, a hostname, a vault, a prior install. Quote the line.
   This is the most important thing you are looking for.
4. Every place you would get stuck, in order: an unstated success condition, an
   output you could not interpret, an ordering problem where step N needs
   something only step N+2 provides.
5. Anything factually checkable that is wrong. AFTER your first read you may
   inspect the repo to verify claims.

Be specific and quote lines. Do not be polite about gaps.
```

**Why this is a required step and not a nice-to-have.** A setup document written
in one session opened with "nothing here assumes anything already exists on the
machine". Its author verified every path in it by hand and closed the task. A cold
read found it could not get past step 2 — the repository was private and no auth
step was given — and then failed again at three more steps, and showed that both
of its stated success conditions were numerically wrong against code in the same
repo. **Every one of those was invisible from inside the session**, because the
author had the accounts, the daemon and the history that the document forgot to
mention.

Rules that make it work:

- **Context-free, or it is worthless.** A subagent that inherits the conversation
  inherits the assumptions. Do not summarise the work for it.
- **The finding list is the task's output.** Record it in the feature's
  `context-log.md`, then fix. If findings invalidate a closed task, use the
  reopen path in Step 8.
- **Verify before acting on it.** A cold read is a strong signal, not an oracle —
  check each claim yourself. In practice most will hold, and the ones that do not
  are still telling you the document is ambiguous.
- **Do not use it for code.** Code has tests. This is for prose whose only test is
  a reader.

### Step 5: Create Shared Context Log — and a task that fills it

```
.devmeta/projects/YYYY-MM-DD-<feature-name>/context-log.md
```

```markdown
# Shared Context Log — <feature-name>

> Feature workers: read this before starting. Append your section when done.
> Captures patterns established, gotchas discovered, and decisions made.

> **An empty context-log is a finding.** If this file still holds only these
> lines when the feature closes, the feature did not record what it learned and
> the next reader starts from nothing.

---
```

**"Append your section when done" is an instruction, and instructions do not
gate.** Two features in one increment closed with their context-log holding only
the template header, while three others carried the whole iteration's knowledge —
and the re-grounding pass afterwards could not promote what was never written
down. Nothing failed, because nothing checked.

So make it a **task**, the last one in every feature, with acceptance criteria
like any other:

```bash
tk create "Record what this feature learned" \
  --parent <epic-id> \
  -d "## Objective
context-log.md holds what the next person needs and would otherwise re-derive.

## Scope
**Files:** \`.devmeta/projects/<date>-<name>/context-log.md\`

## Implementation
Write what is NOT obvious from the diff:
1. What you expected to find and did not — wrong assumptions cost the most time.
2. Numbers, names and paths you had to re-check, and what they actually are.
3. Decisions you made that the spec left open, and the evidence for each.
4. Anything you found and deliberately did NOT fix, with the tick id.
5. Traps for the next person in this area.

Not a diff summary. Git already has the diff." \
  --acceptance "context-log.md contains more than the template header, and names at least one thing a reader could not get from the diff"
```

Where a feature has a mapping or inventory step (audit tables, site-to-counterpart
maps, per-file verdicts), make **that** its first task and have it write into the
same file. Then the log is populated before the work starts rather than
reconstructed from memory after it — which is the difference between a record and
a recollection.

## A ticket is never addressed to the owner (HARD RULE)

**Never create a tick whose completion depends on the owner doing something.** Not
`HUMAN: exercise the microphone on the iPhone`, not `Verify on the phone: …`, not
`HUMAN: attach the disk`, not "confirm X works", not "check this on real hardware".
No `--awaiting approval`, no `--awaiting escalation`, no `BLOCKED ON HUMAN`.

**This harness runs on trust.** The owner verifies at PR review, on their own
schedule, with the running system in front of them. That is the only verification
step there is, and it is theirs.

### Why the old shape failed

One project ran an entire iteration made of them — seven tickets, all reading
`HUMAN:` or `Verify on the phone:`. They stayed open for **months** and held their
increment "active" long after its code had shipped, because **a ticket assigned to
the owner is not work anybody is doing.** It is a note wearing a ticket's clothes.
It cannot be worked, it cannot be closed, and it makes every board it sits on lie
about what is left.

Worse, it corrupts the thing it was meant to protect: an agent that can write
"HUMAN: verify this" has an escape hatch from finishing, and a board that always
has open human tickets can never say COMPLETE — so COMPLETE stops meaning anything.

### What to do instead

When you reach something you genuinely cannot exercise — a device in a pocket, an
account you have no credentials for, a physical disk:

1. **Do the part you can**, all of it. Exercise the same code path every way that
   is available from here: the unit level, the seam, the live service, a fixture
   that stands in for the device.
2. **State your confidence, and what it rests on.** `High — whisper transcribes the
   fixture correctly through the live seam, checked on content rather than on a
   200.` Not "should work". Not "untested". A claim with its evidence attached.
3. **Name what a real device would add**, specifically. `That iOS Safari's
   MediaRecorder produces a container whisper accepts.` That sentence is the whole
   value of the thing you were about to ticket.
4. **Write it in the repo**, in a document the owner reads — `docs/UNVERIFIED.md`
   is a good name — and in the PR body. Not on the board.
5. **Close the tick and move on.** The work is done. What remains is the owner's
   review, and their review is not your ticket.

### Facts are not tasks

"There is no off-machine backup because no disk is attached" is a **fact about the
system**. Record it in the orientation docs, where it stays true and stays read.
Putting it on a board turns a standing condition into a chore nobody accepted.

### What still stops you

Nothing here weakens the three real stopping conditions — a judgement only the
owner can make, something you cannot do, and work genuinely finished. **Say those
in your handoff, in prose, once.** The distinction is: a sentence to a person is
communication, and a ticket to a person is a queue with no worker.

### Step 6: Create Features and Tasks in tk

**Feature format** (multi-repo mode: include the `## Repo` line; omit it otherwise):
```bash
tk create "<iteration>: <phase>" -t epic -d "## Scope
<What this feature delivers>

## Repo
<slug> — \`<local path>\` (all code work happens here; tk and .devmeta/ stay in the hub)

## Spec
\`.devmeta/projects/YYYY-MM-DD-<name>/YYYY-MM-DD-<name>-spec.md\`

## Worker Instructions
- Complete tasks in order
- Read \`.devmeta/projects/YYYY-MM-DD-<name>/context-log.md\` before starting
- Read \`.devmeta/lessons-learned.md\` before starting
- Append learnings to context-log.md when done"
```

**Task format:**
```bash
tk create "<title>" \
  --parent <epic-id> \
  -d "## Objective
<what this step delivers>

## Spec Reference
\`<path>\` — Section: \"<section>\"

## Scope
**Files:** \`path/to/file\` — what changes

## Implementation
1. Step
2. Step

## Tests
Run: \`<surgical test command>\`
Do NOT close until tests pass." \
  --acceptance "<test command> passes"
```

**A subagent never closes its own ticks.** It reports; the orchestrator verifies
and closes. A worker closing the tick it just worked is the tracker recording a
*claim*, and the whole point of an acceptance criterion is that someone other
than the author runs it. Say so in the subagent's prompt, and close from here —
`tk close <id>`, then `tk list` to see the `✓`.

This is the same rule as *"Verify the world before believing the tracker"* in
`.devmeta/devmeta.md`, applied one level up: a closed tick is a claim, and a
claim by the party being graded is the weakest kind.

**Beyond the features, an iteration owes six more ticks — create them here.**

These used to be specified in `go.md` Phase 2, which meant that when `/devmeta:go`
called this command it supplied them and when a **user** called this command
directly **nobody did**. Measured on increment 08, planned by four direct
invocations: 51 such ticks across the increments run under `go`, and **zero**
across this one — no PR, no merge, no I&A cycle, no `base-branch` file. The
obligations belong to the command that does the planning, so they are here now
and `go.md` points at this list rather than restating it.

- **A "Re-ground after Feature X" task, last in every feature.**
- **A "Create PR for iteration N" task** (parent: iteration).
- **A "Merge PR and return to base branch" task** (parent: iteration).
- **A "Commit metadata to base branch" task** (parent: iteration) — commits the
  `.tick/` and `.devmeta/` files orchestration modified.
- **A "Kick off I&A Cycle NR" task, last in the iteration** (parent: iteration).
- **The I&A cycle iteration itself**: `Iteration NR: Inspect & Adapt on
  Iteration N` (epic, blocked by iteration N), holding two tasks — `Run
  /devmeta:reflect N`, and `Plan Iteration N+1: read scope, create feature tick
  structure, begin first task`. The first invokes the full I&A skill; the second
  is **concrete work, not a handoff**, which is what stops the loop stalling at
  the boundary.

**The base branch.** The PR and merge tasks need one, and `go.md` Phase 0.5
writes it to `<increment-dir>/base-branch`. A direct invocation has not run that
phase, so **check for the file and write it if it is missing** — do not assume
`main`. `AGENTS.md` in this project says `main` ships via pull request, and an
iteration that pushes straight to a long-lived branch has skipped a gate the
project believes it has.

**Cross-feature dependencies (feature level only):**
```bash
tk block <epic-B-first-task-id> <epic-A-last-task-id>
```

### Step 7: Create Iteration Status File

```
Current increment's iterations/iteration-<N>/status.md
```

```markdown
# Iteration <N> Status

**Started:** YYYY-MM-DD
**Status:** In Progress

## Features

| Feature | ID | Tasks | Status | Depends On |
|---------|----|-------|--------|-----------|
| Foundation | <id> | N | Not started | — |
| Feature X | <id> | N | Not started | Foundation |
| Feature Y | <id> | N | Not started | Foundation |

## Feature Independence Map

        [Foundation]
        /          \
  [Feature X]  [Feature Y]   ← parallel

## Notes

<Updated as iteration progresses>
```

### Step 8: Continue Immediately to Execution

**DO NOT pause, summarize, or ask the user anything.** Planning is not a stopping point.

After creating the tick structure, immediately:
1. Run `tk next` to get the first task.
2. Begin executing it.

Do NOT write "here's the plan, shall I proceed?" messages. Do NOT present the feature independence map as a decision point. Do NOT offer options. The tick structure IS the plan; execution starts now.

If the human needs to intervene, they will interrupt. Your job is to keep moving.

#### When verification invalidates something already closed

Step 8 forbids pausing or asking. That is right for ordinary progress and wrong
for one case, which has no other rule and therefore no defined move: **a
verification step proves an earlier, already-closed task was not done.**

It happens for a specific reason. A verify task is often the first time anyone
looks at the work from outside — a cold read, a probe, an adversarial pass — and
outside is where the author's assumptions stop holding. In one session a setup
document passed every path check its author wrote, was hand-verified, closed, and
was then shown by a context-free reader to fail at four separate steps and to
state two success conditions that were numerically wrong. The completion claim had
already been made.

When that happens:

1. **Reopen the task.** `tk reopen <id>`. A task whose deliverable is wrong is
   not done, however green its own acceptance criterion was.

   > `tk update` has **no `--status` flag**, and passing one is accepted
   > silently — exit 0, no output, nothing changed. This command said
   > `tk update <id> --status open` until 2026-08-26 and would have quietly
   > done nothing. `tk close <id>` closes; `tk reopen <id>` reopens; the glyph
   > in `tk list` is the only proof either happened.
2. **Write the finding into the feature's `context-log.md` before fixing
   anything** — what was claimed, what is true, and how the gap survived. The
   mechanism that let it through is worth more than the fix.
3. **Fix what belongs to this iteration; file the rest.** Findings routinely
   spill into code the iteration does not own. Create ticks for those and name
   them in the iteration `status.md` under a handoff heading. Do not widen the
   iteration to swallow them, and do not drop them.
4. **Do not close the iteration** while a reopened task is open — and correct any
   status file that already called it complete, in the same edit.
5. **Only then continue.** Still do not ask the user; this is a recorded
   correction, not a decision.

The failure mode this prevents is the quiet one: a finding arrives after the
summary is written, and the cheapest response is to treat it as the next
iteration's problem. It is this iteration's problem, and the record should say
the claim was withdrawn rather than silently superseded.

#### Where this command ends depends on who called it

This is the only DevMeta command with no defined stopping point, and that
ambiguity has cost a real session: three iterations were planned and executed
back to back, and then execution halted after the fourth *planning* phase for no
reason other than the absence of a rule. The command is named for planning, its
Step 8 mandates execution, and it has no `Report:` block — so a direct invocation
has no turn boundary and one gets invented.

Branch on the caller. You can tell which you are:

- **Called from `/devmeta:go`** — a `go` phase is already running in this
  conversation. You are a waypoint inside its autonomous loop. Execute every
  feature in the iteration, then return to `go` **without a report**. Do not stop
  at the iteration boundary either; `go` decides that.

- **Invoked directly by the user** (`/devmeta:plan-iteration <N>`, nothing else
  running) — plan, **execute the whole iteration, then run its I&A cycle**, and
  only then stop and report with the block below.

  Planning alone is never a complete answer to this command: the user asked for
  an iteration, and a tick structure is not one. **Nor is working code.**
  `reflect.md` states that the I&A cycle is *"a waypoint inside the loop, not a
  stopping point"* and forbids any phrasing implying the user drives the next
  step — and that is true whichever way this command was called. A direct
  invocation that stops before the I&A cycle stops one step short of the
  harness's own definition of done, and hands the user a slash command the rest
  of the harness says they should never have to type.

  So: `tk next` through the I&A cycle iteration you created in Step 6, exactly as
  `go` would. **The one place to stop is the increment boundary** — when the
  increment's `_overview.md` scope is fully delivered and there is no Iteration
  N+1, `reflect.md` says that IS a stopping point. Stop there, and do not
  bootstrap the next increment.

  ```markdown
  ## Iteration <N> — <STATUS>

  **Features:** <N> (<ids>) · **Parallel frontier:** <N>
  **Shipped:** <one line per feature — what changed, not what was attempted>
  **Verified:** <the actual command and its result>
  **Filed not done:** <tick ids + one line each, or "none">
  **Blocked on you:** <only what the agent cannot do, or "nothing">
  ```

  **There is deliberately no `Next:` field.** It used to be here, reading "the
  literal next command", and it structurally demanded that a devmeta command be
  handed back to the user — which is the one thing this harness exists to avoid.
  It is what produced a report ending `Next: /devmeta:reflect` after an iteration
  whose I&A cycle this command should have run itself. `Blocked on you:` already
  carries the only thing a user should see, and the honest answer there is
  usually "nothing".

Either way, **finishing the iteration is the deliverable.** If you find yourself
writing a summary while a task in this iteration is unstarted and unblocked, that
is the bug this section exists to prevent — go and do the task.

## Quality Checklist

- [ ] No file modified by two independent features — **or, if one is, the plan names the order and says why merging the features would be worse** (see below)
- [ ] Multi-repo mode: every feature names its target repo; cross-repo features only when atomic
- [ ] Shared code in foundation feature
- [ ] Each feature fits in ~60-70% of context
- [ ] Tasks ordered and building on each other within feature
- [ ] Every task has surgical test commands
- [ ] Cross-feature deps are minimal
- [ ] **Every feature producing a user-facing document ends with a cold-read task** (Step 4.5)
- [ ] **Every feature's LAST task is "append to context-log.md", with acceptance criteria** (Step 5)
- [ ] context-log.md created per feature
- [ ] iteration status.md created
- [ ] Parallel frontier is as wide as possible

### The shared-file rule has one exception, and it must be stated

"No file modified by two independent features" exists so two subagents cannot
collide. When two features legitimately touch **disjoint regions** of one file —
different functions, different sections, one appending and one editing elsewhere —
merging them into a single feature is the worse outcome: it puts two unrelated
jobs in one context and serialises work that could run in parallel.

So the exception is allowed when **all three** hold, and the plan says so
explicitly:

1. the regions are genuinely disjoint, named in the work-to-file matrix;
2. the plan states **which feature edits first**, and the second feature's task
   description says to rebase onto it rather than revert it;
3. the reason for not merging is written down.

If you cannot state all three, merge the features. An ordering that works by luck
is the thing this rule was protecting against.
