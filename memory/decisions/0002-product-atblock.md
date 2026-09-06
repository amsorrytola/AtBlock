# ADR 0002: Lock AtBlock on Graph + Hedera + ENSv2

- **Date:** 2026-09-08
- **Status:** accepted
- **Deciders:** agent (user: win, Classic, agent-codes, min intervention, max tracks)

## Context

User declined to pick an idea. Constraints: Classic track, ≤3 partner SDKs/prizes, win ≥1 track, minimize human steps. Continuity-only bounties are dead. Official rule: 3 partner selections; **all tracks under each partner count**.

Lisbon 2026 Graph winners converged on standardized schemas, pinned provenance, and agents as data consumers. Hedera’s largest scratch bounty is live x402 + Blocky402. ENS’s workshop and $4.5k / 4-slot pool is agent namespaces + EAC.

## Decision

Build **AtBlock**: metered Graph facts, paid on Hedera x402, identified/permissioned via ENSv2.

Select partners: **The Graph, Hedera, ENS**.

Wedge: **no cite, no coin** (re-derive from Graph at pinned block or payment does not complete).

## Alternatives considered

| Stack | Why not |
|-------|---------|
| Graph + Hedera + Arc | Two settlement chains; happy-path demo risk; Arc is K1 fallback only |
| Graph + Hedera + Privy | Weaker identity story vs ENSv2 workshop + 4 ENS podium slots |
| Graph + Hedera + Bazantic | Smaller $; 3rd partner spent on recipes instead of identity judges |
| Graph + Hedera + Ledger | Hardware / Key Ring = human intervention |
| Graph + Hedera + World | Selfie/Orb friction; AgentKit is Continuity-only |
| Graph + Hedera + 1inch/Uniswap | Orthogonal SwapVM/hooks; splits the 90s demo |
| Graph + Hedera + Chainlink | Smaller pool; CRE TEE complexity |
| Idea-first chat agent | DQ on Graph (mocks / single subgraph) and Hedera (no paid request) |

## Consequences

- Positive: 4 primary From-Scratch categories, one demo, one chain for money, no hardware.
- Tradeoffs: We skip Arc’s $3.5k mainnet bounty and Privy’s easy UX points.
- Follow-ups: Scaffold; user submits Check-in #1 with the canned pitch; user will record the human-narrated video later.

## References

- [topics/product.md](../topics/product.md)
- [topics/ideation-loop.md](../topics/ideation-loop.md)
- https://ethglobal.com/events/ethonline2026/info/details
- https://ethglobal.com/events/ethonline2026/prizes
