# Topic: Win strategy (ETHOnline 2026)

> Last updated: 2026-09-08  
> Status: active (framework; idea not locked)

## Goal

Maximize chance of **winning ≥1 partner track**. Official cap: **3 partner prizes** on the form; **every track under those partners counts**. Winning = qualify hard under those 3 + crush demo clarity.

## Locked selection (2026-09-08)

**AtBlock** → partners **The Graph + Hedera + ENS**. See [product.md](./product.md). Do not re-open unless a kill-criterion fires.

## Operating principles

1. **Prize-first product** — pick tracks first, shape the idea to their qualification checklists.
2. **Stack ≤3 sponsors** — depth over seven shallow logos.
3. **One killer demo path** — 90 seconds a judge can narrate without reading docs.
4. **Live data / live payments** — mocks DQ many top pools (Graph, Hedera agentic pay, Privy).
5. **Continuity if you have leverage** — 2026 explicitly rewards bringing a repo; continuity-only bounties are less contested than greenfield popularity contests.
6. **Ship check-ins on time** — missed check-ins kill eligibility/mentorship signal.

## Recommended stack patterns (pick ONE)

### Pattern A — “Agent that pays + reads chain” (highest overlap)

**Core narrative:** An AI agent that uses live chain data and settles real micropayments / actions with human-in-the-loop trust.

| Primary | Why |
|---------|-----|
| **The Graph** ($15k) | AI use case with live Subgraph MCP / Substreams; or composable standardized subgraphs |
| **Hedera** ($15k) | AI & agentic payments (x402 / Blocky402 end-to-end paid request) |
| **Third slot (pick one):** Ledger Agent Stack / Arc USDC agents / ENS agent identity / Privy wallets | Trust layer, settlement chain, identity, or UX |

**Why it wins:** Matches the 2026 workshop theme (agents, Arc USDC, Hedera, Graph AI, Ledger agents, Bazantic recipes). Judges already primed.

### Pattern B — “Human-gated agents” (World + payments)

| Primary | Why |
|---------|-----|
| **World** AgentKit / Selfie Check | Human vs bot authorization — distinct story |
| **Privy** or **Ledger** | Wallet UX or hardware-backed agent secrets |
| **The Graph** or **1inch** | Data or execution |

**Why it wins:** Clear differentiation; World has continuity-specific pool.

### Pattern C — “Continuity upgrade of your existing product”

If you already have a repo/users: document baseline → add **one** load-bearing sponsor integration that unlocks a Continuity prize (Graph Continuity AI, Ledger Continuity, World AgentKit Continuity, Chainlink Continuity, Hedera Continuity).

**Why it wins:** Smaller competitor set; judges score *delta*, not “built universe in 10 days.”

### Pattern D — Avoid as sole strategy

- Pure frontend wallet wrapper with no live sponsor tech.
- “ChatGPT but for crypto” with mocked subgraphs.
- Spreading across >3 SDKs so nothing qualifies deeply.

## Judging-facing deliverables (non-negotiable)

- [ ] Public GitHub + README: architecture, setup, **what’s new this event**
- [ ] Live demo URL or local script that runs in <5 minutes
- [ ] Demo video (2–5 min) showing **qualification moments** (paid request, live Graph query, World proof, etc.)
- [ ] Per-sponsor feedback docs if required (World, Uniswap often require feedback artifacts)
- [ ] Explicit “Submitting for: …” list matching prize page titles

## Timeline (from Sep 8)

| Window | Focus |
|--------|-------|
| **Now → Check-in #1 (Sep 8 morning)** | Lock idea + tracks + one-sentence pitch; submit check-in |
| Sep 8–9 | Vertical slice: auth/wallet + one live sponsor call |
| Sep 10 feedback #2 | Bring working happy path; get mentor critique |
| → Check-in #2 (Sep 11) | Second sponsor live; architecture diagram |
| Sep 12–14 | Polish, video, README, qualification checklist pass |
| Final | Freeze features; only demo reliability fixes |

## Decision needed from user

None on product. User only: Check-in #1, accounts when asked, human-narrated video, feedback attendance.

## Related

- [ethonline-brief.md](./ethonline-brief.md)
- [../state/goals.md](../state/goals.md)
- [../decisions/0001-prize-first-win-framework.md](../decisions/0001-prize-first-win-framework.md)
