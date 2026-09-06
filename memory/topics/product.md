# Topic: Product — AtBlock

> Last updated: 2026-09-08  
> Status: **locked** (loop iteration 2 — HOLD + PATCH)  
> Mode: Classic / From Scratch  
> **Primary win bet:** Hedera AI & Agentic Payments (qualify ≈ $2k; up to 3 teams paid)

## One sentence

Agents don’t trust other agents’ numbers — **AtBlock** sells live on-chain facts that are pinned to a Graph block, paid per query on Hedera x402, and served only by ENSv2-named agents with revocable permissions.

## Wedge (why this is not Assay / PlanBound / atlas)

| Lisbon winner | Their move | Our move |
|---------------|------------|----------|
| Assay | Reputation + slash *after* a lie | **No cite, no coin** — payment only completes if the buyer can re-query The Graph at the cited `block + deploymentId` |
| PlanBound | Shop/quote cart, then human approve | Marketplace for *facts*, not travel APIs; Graph is the merchandise |
| atlas / deeptrace | Standardized queries ± MCP | Same Graph physics **plus** a live Hedera paid request **plus** ENSv2 agent namespaces |
| BookerBob | Human-risk bands for hotels | Vault/yield facts as a metered x402 service |

Same prize physics (Graph live data + agent payments + identity). Different sentence: **provenance is the checkout rule.**

## Who it’s for

A buying agent (or a human operating one) that must act on cross-protocol DeFi state and cannot accept an LLM’s memory as evidence.

## Happy path (90 seconds — this is the whole demo)

1. **ENS (10s):** Show `seller.atblock.eth` and `buyer.atblock.eth` as ENSv2 subnames. Human owner has Enhanced Access Control; the buyer agent may spend, not transfer the name. Owner clicks **revoke**.
2. **Ask (15s):** Buyer agent: “Compare vault APY / TVL across ≥2 yield protocols with **one** standardized query (Messari yield / ERC-4626 family — not lending).”
3. **402 (25s):** Hits our fact service → HTTP 402 → pays via **Blocky402 on Hedera testnet** (metered: price × number of vaults/protocols compared) → retries with proof.
4. **Cite (25s):** UI shows the answer **and** `{blockNumber, deploymentIds[], queryHash}`. A “Re-derive” button re-runs the same standardized Graph query and matches. Mismatch → refund path / no settle.
5. **Audit (15s):** HCS topic line: paid, cited, verified. One screen, three sponsor logos earned.

## Architecture (load-bearing only)

```
[Human owner] --EAC revoke--> ENSv2 (Sepolia)
        |
        v
[Buyer agent] --x402--> [AtBlock Fact Gateway on Hedera]
                            |               |
                     Blocky402 settle    HCS audit topic
                            |
                            v
              [Graph composer]
                 Messari standardized YIELD / vault query (not lending — crowded)
                 × N deployments (Studio / live provider)
                 + Subgraph MCP tools for the agent
```

- **SDK 1 — The Graph:** Standardized **yield/vault** schema (Messari `schema-yield`) across ≥2 deployments + MCP. Live provider. Pin `_meta.block` + deployment IDs. Do **not** clone Aave/Moonwell lending MCP.
- **SDK 2 — Hedera (build first):** x402-gated service + **hosted Blocky402** (`hedera:testnet`); metered HBAR/HTS; HCS receipt. Official snippets: `@x402/hedera`, `@x402/fetch`.
- **SDK 3 — ENSv2 (tutorial-thin):** One parent registry + two subnames + one EAC revoke. Do not spend a week on custom registrars.

## Build order (win-probability)

1. Live 402 → Blocky402 settle → retry (Hedera qualify).
2. Live yield composer + pin + re-derive (Graph qualify).
3. Thin ENSv2 revoke (ENS qualify).
4. Only then: HCS extras, ERC-8004, Substreams SKILL, Harness.

## Non-goals (explicit)

- Continuity prizes
- Ledger hardware / Key Ring
- World Orb / Selfie / AgentKit (human-heavy)
- Second settlement chain (Arc) on the happy path
- 1inch Aqua / Uniswap hooks (orthogonal demo)
- ATS / RWA tokenization
- Chat-only UI with mocked subgraphs
- A fourth sponsor SDK (including Bazantic) unless a kill-criterion fires

## Partner prizes we will select (exactly 3)

Per official rules: *up to 3 Partner Prizes; all tracks under a partner count as one selection.*

1. **The Graph** — Composable/Standardized + AI From Scratch  
2. **Hedera** — AI & Agentic Payments (Harness only if leftover time)  
3. **ENS** — Best Use of ENSv2  

## Check-in #1 pitch (paste)

See `artifacts/checkin-1-pitch.md`.

## Kill-criteria (pivot only if one fires)

| ID | Trigger | Pivot toward |
|----|---------|--------------|
| K1 | Blocky402 / Hedera x402 cannot complete a real paid request by Check-in #2 | Keep Graph+ENS; replace Hedera with **Arc Agent Stack + USDC** (still 3 partners) |
| K2 | ENSv2 Sepolia is unusable / undocumented for subnames+EAC | Keep Graph+Hedera; replace ENS with **Privy** (B2B org wallet + policy as “permissions”) |
| K3 | No live Graph provider key / standardized deployments reachable | Fail Graph composable; keep AI-use with one live subgraph + MCP — **do not mock** |
| K4 | Official rule change: our stack DQ | Re-run loop scoring from scratch |

## Related

- [qualification-matrix.md](./qualification-matrix.md)
- [ideation-loop.md](./ideation-loop.md)
- [judges.md](./judges.md)
- [../decisions/0002-product-atblock.md](../decisions/0002-product-atblock.md)
