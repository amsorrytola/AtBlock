# Artifact: Check-in #1 paste

> Date: 2026-09-08  
> User submits this on the ETHGlobal dashboard before ~09:29 IST.

## Title

AtBlock

## One-liner

Agents pay for on-chain facts only when the answer is pinned to a live Graph block — settled on Hedera x402, named and revocable via ENSv2.

## Project description (check-in)

AtBlock is a fact marketplace for agents.

A selling service answers cross-protocol **vault / yield** questions from The Graph (one Messari standardized yield query across multiple deployments — not another lending dashboard). A buying agent pays per query through an x402 gate on Hedera (Blocky402). Every response carries a cite: block number, subgraph deployment IDs, query hash. Checkout completes only if the buyer can re-derive the same result from The Graph. If the cite fails, the payment does not stand.

Agents are ENSv2 subnames on Sepolia with Enhanced Access Control: a human owner can grant spend rights and revoke them in one click. Payment receipts are written to Hedera Consensus Service so the run is auditable.

Tracks we are building toward (3 partners, all of their scratch bounties): The Graph (standardized/composable + AI use), Hedera (agentic payments), ENS (ENSv2 agent namespaces).

Classic / from scratch. Demo happy path: revoke-able agent name → paid 402 request → pinned Graph re-derive.

## Partner prizes (when the form asks)

1. The Graph  
2. Hedera  
3. ENS  
