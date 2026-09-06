# Topic: Win-analysis loop (professional)

> Last updated: 2026-09-08  
> Status: active  
> Iteration: 15 (HOLD — still waiting on check-in/keys)

## Purpose

A repeatable analysis engine. Each tick re-scores the project against everything that can change a prize outcome, then either **confirms the lock**, **patches the plan**, or **triggers a kill/pivot**.

This is not brainstorming. It is a closed loop with a written decision at the end of every tick.

## Hard constraints (never re-open unless a kill-criterion fires)

| Lock | Value | Source |
|------|--------|--------|
| Mode | Classic / From Scratch | user 2026-09-08 |
| Coding | Agent codes; user is non-technical operator | user 2026-09-08 |
| Goal | Win ≥1 sponsor track prize | user |
| SDK cap | ≤3 sponsor SDKs | ETHOnline 2026 rule |
| Human intervention | Minimize (no hardware wallets, no Orb, no dual-chain ops) | user |
| Secrets | Never in `memory/` | protocol |

## Loop anatomy (every tick)

```
INTELLIGENCE → SCORE → STRESS → DECIDE → WRITE → ARM NEXT
```

### 1. Intelligence (gather)

Pull only what can change judging:

| Channel | What to check | Where to write |
|---------|---------------|----------------|
| Prize pages | New bounties, DQ wording, extra-points | `topics/ethonline-brief.md` + this tick session |
| Workshops / schedule | What sponsors just taught (judges primed) | `topics/judges.md` |
| Showcase / winners | Clone crowding, winning shapes | `topics/prize-strategy.md` |
| Docs / SDKs | Breakages, starter kits, facilitator URLs | `artifacts/_index.md` |
| Our build | What actually works vs mocked | `state/blockers.md` |
| Deadlines | Check-ins, final submit, video rules | `CURRENT.md` |
| Mentors | Feedback session notes | latest `sessions/` |

### 2. Score (weighted model)

Score the **current product** and any challenger on 0–5 each:

| Factor | Weight | What “5” looks like |
|--------|--------|---------------------|
| F1 Eligible categories unlocked | 15% | ≥4 From-Scratch bounties from ≤3 SDKs |
| F2 Prize EV | 15% | Large pool + many podium slots (not one $2.5k 1st-only) |
| F3 Demo cohesion | 20% | One 90s path hits every qualification moment |
| F4 Build risk (solo AI coder, ~8 days) | 20% | Official starters exist; one settlement chain |
| F5 Crowding / clone risk | 10% | Same physics as winners, different wedge |
| F6 Judge / workshop priming | 10% | Extra-point bullets match this week’s talks |
| F7 DQ hardness | 10% | Live Graph + live paid request are unavoidable in the demo |

**Reject immediately if:** Continuity-only; 4th SDK required; mock data; hardware device required; two settlement chains in the happy path.

### 3. Stress (pre-mortem)

Ask, and answer in writing:

1. If a Graph judge clones our repo, do they see **composition / standardized schema**, or one subgraph?
2. If a Hedera judge watches the video muted, do they still see a **402 → pay → retry**?
3. If an ENS judge greps the repo, is ENSv2 **central** (registry / EAC / subnames) or a text record sticker?
4. What is the single most likely integration outage (Blocky402, Studio key, Sepolia ENS)? What’s the fallback that still qualifies?
5. Would Austin Griffith / a UX mentor understand the product in one sentence?

### 4. Decide (one of three)

| Decision | When |
|----------|------|
| **HOLD** | Scores still win; only tasks change |
| **PATCH** | Wedge or extra-points change; name/stack stay |
| **PIVOT** | A kill-criterion fires (see product topic) |

Never invent a new idea for sport. Pivot only when the locked idea cannot qualify.

### 5. Write (mandatory artifacts this tick)

- Append `sessions/YYYY-MM-DD-win-loop-N.md`
- Update `CURRENT.md` one-liner + next actions
- If scores or kill-criteria change → patch `topics/product.md` + `topics/qualification-matrix.md`
- If a new fact is durable → `topics/*` + `INDEX.md`

### 6. Arm next

- Default cadence: **15 minutes** while ideation/build week is active (user preference).
- Shorten further only if a hard deadline is <1h away.
- Lengthen to **6 hours** after Check-in #2 if the happy path is green (optional).

## Tick log

| N | Date | Decision | Note |
|---|------|----------|------|
| 1 | 2026-09-08 | **LOCK** | Stack Graph + Hedera + ENSv2; product **AtBlock** |
| 2 | 2026-09-08 | **HOLD + PATCH** | Primary bet = Hedera qualify≈win; merchandise = yield/vaults not lending |
| 3 | 2026-09-08 | **HOLD** | Yield schema official; HCS-14 stretch; cadence 2h until check-in |
| 4 | 2026-09-08 | **HOLD** | Cadence → 15m; AtBlock still the single idea |
| 5 | 2026-09-08 | **HOLD** | First auto tick; begin Hedera-first scaffold |
| 6 | 2026-09-08 | **HOLD** | Facilitator URL fixed; verify+settle + pay script |
| 7 | 2026-09-08 | **HOLD** | Graph subgraph-ID expander; hosted service dead |
| 8 | 2026-09-08 | **HOLD** | `@atblock/ens` thin revoke helpers |
| 9 | 2026-09-08 | **HOLD** | SKILL.md + HCS audit + git init |
| 10 | 2026-09-08 | **HOLD** | Yearn Graph IDs + SETUP.md |
| 11 | 2026-09-08 | **HOLD** | Demo script + architecture docs |
| 12 | 2026-09-08 | **HOLD** | Facilitator smoke green; check-in critical |
| 13 | 2026-09-08 | **HOLD** | Idle on human gates; feedback #1 tonight |
| 14 | 2026-09-08 | **HOLD** | No change; still waiting on user |
| 15 | 2026-09-08 | **HOLD** | No change; still waiting on user |

## Related

- [product.md](./product.md)
- [prize-strategy.md](./prize-strategy.md)
- [judges.md](./judges.md)
- [../loops/win-analysis.md](../loops/win-analysis.md)
