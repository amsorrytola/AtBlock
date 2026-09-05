# ADR 0001: Prize-first win framework

- **Date:** 2026-09-08
- **Status:** accepted
- **Deciders:** user (intent: win ETHOnline) + agent (strategy proposal)

## Context

ETHOnline 2026 has ~$100k in partner prizes, Continuity tracks, and a hard Check-in #1 on Sep 8. Building an idea first and “adding sponsors later” usually fails qualification (live Graph data, end-to-end agentic payments, required feedback docs, etc.).

## Decision

Optimize for **winning sponsor prizes** using this framework:

1. Choose **≤3** sponsor targets before deep scaffolding.
2. Prefer **Pattern A** (agent + live chain data + real payments) unless Continuity leverage or World/human-gating is a better personal fit.
3. Make every sprint produce a **demoable qualification moment**, not just architecture.
4. Keep `memory/` updated so track criteria never drift.

Idea selection must map onto a concrete Pattern A/B/C from `topics/prize-strategy.md`.

## Alternatives considered

- Idea-first, prizes later — high DQ risk on Graph/Hedera/Privy.
- Spray all 11 partners — shallow integrations lose.
- Finals-only polish without check-ins — misses process gates and mentor feedback.

## Consequences

- Positive: clearer scope; higher qualify rate; better mentor conversations.
- Tradeoffs: may kill “passion-only” ideas that don’t map to prizes.
- Follow-ups: user locks mode + idea + track trio; then ADR 0002 for product concept.

## References

- [topics/prize-strategy.md](../topics/prize-strategy.md)
- [topics/ethonline-brief.md](../topics/ethonline-brief.md)
- https://ethglobal.com/events/ethonline2026/prizes
