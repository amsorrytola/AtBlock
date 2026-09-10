# Session: 2026-09-10 · memory standing order locked

## Intent

User repeated: keep updating and recording everything in `memory/` while the AtBlock build loop runs.

## Outcome

- Strengthened `.cursor/rules/project-memory.mdc` with standing order + build-loop tick requirements.
- Updated `memory/README.md` update protocol (sessions on every loop tick; qualify/sponsor/loop rows).
- ADR [0003](../decisions/0003-continuous-memory-recording.md) accepted.
- Confirmed still **NO `.env`**; watcher + 20m heartbeat still running.
- `CURRENT` / INDEX / next-actions refreshed to match.

## Next

Continue production depth on next heartbeat or when credentials arrive; memory sync is non-optional each tick.
