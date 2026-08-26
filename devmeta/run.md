---
description: Execute features (global) — one subagent per feature, parallel across execution waves
argument-hint: [feature-id(s) or --all]
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

## Design

**The feature is the unit of context.** One subagent per feature. Sequential tasks within. Parallel across independent features. `context-log.md` for inter-feature communication. You (the orchestrator) are a thin scheduler.

## Context

- Today's date: !`date +%Y-%m-%d`
- Target: $ARGUMENTS
- Open features: !`tk list --type epic --status open 2>/dev/null | head -20 || echo "No open features"`

## Your Task

You are a thin orchestrator. Compute feature dependency order, spawn one worker per feature, track progress. You do NOT implement anything yourself.

### Phase 1: Identify Scope

**If `$ARGUMENTS` contains feature ID(s):** Run those features only.
**If `$ARGUMENTS` is `--all` or empty:** Run all open features.

### Phase 2: Compute Feature Dependency Graph

```bash
tk list --type epic --status open --json
```

For each feature, check tasks for cross-feature `blocked_by`:
```bash
tk list --parent <epic-id> --json
```

Build feature-level dependency graph. Compute waves:
```
Wave 1 = features with no open feature-level blockers
Wave 2 = features whose blocker-features are all in Wave 1
...
```

### Phase 3: Locate Shared Context Log

Find the `context-log.md` path from the feature descriptions. Read it — you'll include its contents in worker prompts.

### Phase 4: Present Execution Plan

```markdown
## Execution Plan

| Wave | Features (parallel) | Depends On |
|------|-------------------|-----------|
| 1 | Feature A (foundation) | — |
| 2 | Feature B, Feature C | Wave 1 |
| 3 | Feature D (validation) | Wave 2 |

Proceeding with execution...
```

### Phase 5: Execute Waves

```
FOR each wave:
  1. Gather all features in this wave
  2. For each feature:
     a. Gather ordered tasks: tk list --parent <epic-id> --json
     b. Read base branch from `<increment-dir>/base-branch` (find increment dir via `.devmeta/current-increment.md`)
     c. Create feature branch: git checkout -b feature/YYYY-MM-DD-<feature-name> <base-branch>
     d. Push branch: git push -u origin feature/YYYY-MM-DD-<feature-name>
     [Multi-repo mode: run (c) and (d) INSIDE the feature's target repo — the `## Repo`
      line in the epic description names its local path. The increment branch (same name
      as base-branch) already exists there from go Phase 0.5; branch from it. The hub
      repo gets no feature branch unless the feature modifies the hub itself.]
  3. Spawn one subagent per feature — ALL in a SINGLE message (parallel)
     Include feature branch name in worker prompt (multi-repo mode: also the target repo path)
  4. Wait for all subagents to complete
  5. Collect results, update status
  6. Report wave results
  7. Proceed to next wave
```

**CRITICAL: Launch all feature workers in a wave in a SINGLE message with multiple Task tool calls.**

### Phase 6: Worker Prompt Template

Spawn with `subagent_type: "tk-worker"` (fallback: `"general-purpose"`).

```
## Your Assignment

**Feature:** [<epic-id>] <epic-title>
**Branch:** feature/YYYY-MM-DD-<feature-name> (already created — checkout and work here)
**Repo:** <multi-repo mode only: slug — local path. ALL code work, commits, and the PR happen
inside this repo. tk commands, context-log.md, and .devmeta/ files live in the hub repo at
<hub path> — read and write them there.>

### Feature Description

<full description from tk show>

### Tasks (complete in order)

1. [<task-1-id>] <title>
   Acceptance: <criteria>
2. [<task-2-id>] <title>
   Acceptance: <criteria>
...

### Task Details

<Full description for each task from tk show>

### Shared Context Log

<Contents of context-log.md>

### Feature Notes (from previous runs)

<Output of tk notes <epic-id>>

## Instructions

1. Read CLAUDE.md for project orientation
2. Read the repo's architectural decisions — `docs/current/principles-and-choices.md` if it exists, otherwise `AGENTS.md` / `.devmeta/devmeta.md`. Do not stall on a missing path.
3. Read .devmeta/lessons-learned.md — don't repeat known mistakes
4. Read context-log.md for context from previous features
5. If .devmeta/devmeta.md exists at project root, read it for test commands and additional rules
6. Work through tasks IN ORDER — they build on each other
7. For each task:
   a. tk update <task-id> --status in_progress
   b. Read the spec section referenced
   c. Implement the changes
   d. Write tests alongside implementation
   e. Run acceptance criteria. Fix and re-run until green
   f. Commit: `git commit -m "[TASK-ID] <what was done>"`
   g. tk close <task-id> --reason "<summary>"
8. After ALL tasks done:
   a. Append learnings to context-log.md
   b. tk note <epic-id> "FEATURE COMPLETE: <summary>"
   c. Push the feature branch: `git push`. Do NOT open a PR — the coordinator opens a single PR per iteration once the iteration's features are complete.
9. If a task cannot be completed:
   a. tk note <task-id> "<what's blocking, what was tried, and your confidence in
      the parts that ARE done>"
   b. Leave it OPEN, and say so in the feature's report and in the PR body. Do not
      mark it awaiting anything — see the hard rule below. An open tick with a note
      is a thing the next agent picks up; an "awaiting" tick is a thing nobody
      picks up.
   c. Continue to the next task if possible

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

## Rules

- Complete tasks in order
- Be autonomous — don't ask questions
- NEVER close a task with failing tests. If tests fail: debug, fix, re-run. Loop until green. There is no "close with known failures"
- Tests are YOUR responsibility. Write them, run them, fix them. Never defer testing to a later task or iteration
- Use surgical test commands (not full suite)
- After completing all tasks, run the iteration's "Verify on screen" commands from the increment overview. If output doesn't match, keep working — the iteration is not done
- Leave useful notes in context-log.md
- When you solve a problem, also write it to .devmeta/lessons-learned.md
- Use tk commands, never edit .tick/issues/ directly
- Work on the feature branch. Commit after each task with `[TASK-ID] <summary>`, and push when all tasks pass. Do NOT open a PR — PR creation is the coordinator's iteration-level task (`go`'s "Create PR for iteration N"), which opens one PR per iteration into the base branch (from `<increment-dir>/base-branch`)
- Multi-repo mode: git commands (branch, commit, push) run inside the target repo; the coordinator opens the per-repo iteration PR targeting that repo's increment branch. Never commit code to the hub repo unless the feature explicitly modifies it
- NEVER reduce scope. If something is hard, work harder. If something is blocked, unblock it. Only the human can cut features

```

### Phase 7: Handling Results

**All tasks closed:** `tk close <epic-id> --reason "All tasks completed"`

**Some tasks open:**
- Check awaiting: `tk list --parent <epic-id> --awaiting --json`
- Check notes: `tk notes <task-id>`
- Reset stale in_progress: `tk update <task-id> --status open`

### Phase 8: Wave Reporting

```markdown
## Wave <N> Complete

| Feature | Title | Tasks Done | Status |
|------|-------|-----------|--------|
| <id> | <title> | X/Y | Complete / Partial / Blocked |

### Next Wave
| Feature | Title | Tasks |
|------|-------|-------|
| <id> | <title> | N tasks |
```

### Phase 9: Final Summary and Continue

```markdown
## Execution Complete

| Feature | Title | Status | Tasks |
|------|-------|--------|-------|
| <id> | <title> | Complete / Partial | X/Y |

### Totals
- Features: X complete, Y partial
- Tasks: X complete, Y blocked
- Waves: N

### Needs Attention (if any)
| Feature | Task | Issue |
|------|------|-------|
```

**DO NOT pause, summarize with "Next Steps", or hand control back to the user — except at increment boundaries.** Execution is a waypoint inside `/devmeta:go`'s autonomous loop.

After writing the summary:
1. Run `tk next` to get the next task (typically "Create PR for iteration N", "Merge PR", or the next feature).
2. Begin executing it immediately.

If there are blocked tasks that cannot be unblocked autonomously, note them in tk and move on to whatever CAN be done. Only stop for genuine external blockers (missing API keys, missing hardware, human-only decisions).

**Exception: increment completion is a stopping point.** If `tk next` returns nothing and all iterations of the current increment are closed, the increment is done — STOP. Do not create or pick up a "bootstrap next increment" task, do not ask the user which increment to start next. Write the completion summary and exit; the user re-invokes `/devmeta:go` when they're ready for the next increment.

## Error Handling

- **Worker fails to spawn:** Log error, reset tasks, continue with remaining features
- **All features blocked:** Report what needs attention, stop execution
- **Partial completion:** Completed tasks stay closed. Reset incomplete to open. Next run resumes.
