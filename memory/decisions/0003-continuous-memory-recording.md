# Decision 0003 — Continuous memory recording during build

- **Status:** accepted
- **Date:** 2026-09-10
- **Context:** User `/loop` is shipping AtBlock until credentials arrive, and explicitly asked to keep updating and recording everything in `memory/`.

## Decision

Every meaningful agent turn and every `AGENT_LOOP_WAKE_atblock_build` tick **must** update `memory/` before the turn ends. Minimum bar: `CURRENT.md` + `state/next-actions.md` + a session note (new or append). Also sync matrix / sponsor-surface / blockers / loops when those change.

## Why

Handoff must stay accurate while code moves fast under a long-running loop. Secrets stay out of memory; facts, paths, commands, and status do not.

## Consequences

- Slightly more write overhead per tick
- Future agents can resume without re-deriving status from chat
- Enforced via `.cursor/rules/project-memory.mdc` + `memory/README.md`
