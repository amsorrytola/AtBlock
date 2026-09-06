# Loop: win-analysis

> Re-armed: 2026-09-08  
> Cadence: **15 minutes**  
> Sentinel: `AGENT_LOOP_TICK_win-analysis`  
> Local PID: 1479685

## On each tick, the agent must

1. Read `memory/CURRENT.md`, `memory/topics/ideation-loop.md`, `memory/topics/product.md`, `memory/topics/qualification-matrix.md`, `memory/state/blockers.md`.
2. Re-fetch prize + details pages if anything may have changed.
3. Run Intelligence → Score → Stress → Decide (HOLD / PATCH / PIVOT).
4. Write `memory/sessions/YYYY-MM-DD-win-loop-N.md` and update CURRENT.
5. Do **not** invent a new product unless a kill-criterion in `topics/product.md` fires.
6. If HOLD: continue the highest-priority build task unless the user is mid-ideation.

## Tick prompt (payload)

```
Run ETHOnline win-analysis loop tick. Follow memory/loops/win-analysis.md and memory/topics/ideation-loop.md. Re-score AtBlock. HOLD unless a kill-criterion in memory/topics/product.md fires. Update memory. Then continue the highest-priority build task if no user message overrides.
```
