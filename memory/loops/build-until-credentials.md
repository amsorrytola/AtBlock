# Loop: build-until-credentials

> Armed: 2026-09-10  
> Mode: **dynamic** (local monitored wake)  
> Sentinel: `AGENT_LOOP_WAKE_atblock_build`  
> Stop when: user pastes credentials / says stop

## Prompt (each tick)

Continue making AtBlock production-grade. Maximize sponsor surface for The Graph, Hedera, and ENS (ETHOnline tracks + extras). Prefer live paths over mocks. Update `memory/` every meaningful tick. Hold live qualify until `.env` secrets exist.

## Wake strategy

1. Primary: watch for `.env` creation / change → wake immediately to wire keys + smoke. **PID watcher:** see CURRENT / this file timestamps.
2. Fallback heartbeat: **20 minutes** — keep shipping code/docs/memory while blocked.

### Armed processes (2026-09-10)

| Role | Sentinel | Cadence |
|------|----------|---------|
| `.env` watcher | `AGENT_LOOP_WAKE_atblock_build` | poll 20s |
| Heartbeat | same sentinel | **1200s** active build (HOLD 1800s retired per user continue) |

## On each tick

1. Read `memory/CURRENT.md`, `state/next-actions.md`, `state/blockers.md`.
2. Check whether `.env` appeared (never log secrets).
3. If keys present → write/verify env, run smoke/pay/probe/create-topic, update matrix to live.
4. Else → ship next production depth item from `topics/sponsor-surface.md`; update CURRENT + session note.
5. Re-arm heartbeat (and watcher only if exited).
6. **Always** refresh `memory/` (CURRENT, next-actions, session append or new tick file, matrix if status changed). **ADR 0003 — non-optional.**

## Do not

- Commit secrets
- Mock Graph for judges
- Claim live-qualified without `npm run pay` evidence
- Skip memory updates (user standing order)