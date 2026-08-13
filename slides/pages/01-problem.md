## Agents forget

- Your session ends. The plan, the reasoning, the half-finished work — gone.
- Next session you re-explain the project from scratch.
- Mid-session compaction takes the same things, without telling you.
- Nothing on disk says what is done or what is next.
- So the agent re-decides what to work on, and drifts.

---

## What DevMeta adds

- DevMeta is a slash-command framework for Claude Code.
- State lives on disk, in `.devmeta/` and `.tick/`, not in chat.
- The structure records what is done and what is next.
- The next session reads it and continues. No re-explaining.
- You run two commands: `/devmeta:start-increment-spec`, then `/devmeta:go`.
