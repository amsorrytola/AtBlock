# AtBlock Composer SKILL

> For AI agents / Cursor: how to fetch and cite AtBlock yield facts.

## When to use

Use when an agent needs **cross-protocol vault/yield** numbers that must be re-derivable from The Graph (Messari Yield Aggregator schema), not from model memory.

## Discovery

1. `GET {GATEWAY}/v1/directory` — service metadata, metering hint, HashScan links, ENS/HCS identity pointers.
2. `GET {GATEWAY}/.well-known/agent.json` — agent discovery document.
3. `GET {GATEWAY}/v1/identity` — HCS-14-inspired agent identity card.
4. `GET {GATEWAY}/v1/schema/yield` — Messari query text without needing a Graph key.
5. `GET {GATEWAY}/health` — facilitator, payee, Graph, ENS, HCS readiness.

## Paid fact path

1. `GET` or `POST {GATEWAY}/v1/facts/yield` — without payment → HTTP **402** with Hedera Exact requirements (`feePayer` from Blocky402 `/supported`).
2. Create payment with `@x402/hedera` Exact scheme against `accepts[0]`.
3. Retry with header `X-PAYMENT: <base64 JSON payment payload>`. Optional: `Idempotency-Key` for safe retries.
4. Response includes `receipt` (`assetKind` HBAR|HTS, metering, settleTx), `fact`, and `explorers`.
5. `POST {GATEWAY}/v1/facts/yield/rederive` with `{ "cite": fact }` — require `match: true` / `verdict: "cite-stands"`.

## Identity / pin

- `GET {GATEWAY}/v1/ens/status` — ENSv2 Sepolia resolve for `ENS_AGENT_NAME`.
- Operator CLI: `npm run revoke-demo -w @atblock/ens` after EAC contract is set.

## Rules

- Never invent TVL/APY. Missing Graph endpoints → fail closed (no mock for judges).
- Prefer ≥2 subgraph deployments, **one** query shape (`YIELD_QUERY` in `@atblock/composer`).
- Do not use lending-only merchandise for this product.
- Prefer HashScan links from the response `explorers` object when explaining settlement to humans.
- Local audit JSONL always; set `HCS_TOPIC_ID` to mirror to Hedera Consensus Service.

## Env the operator must set

`GRAPH_API_KEY`, `GRAPH_YIELD_SUBGRAPH_IDS` (or `GRAPH_YIELD_ENDPOINTS`), Hedera payee/payer keys, `FACILITATOR_URL=https://api.testnet.blocky402.com`.

Optional: `HCS_TOPIC_ID`, `ENS_RPC_URL`, `ENS_AGENT_NAME`, `ENS_EAC_CONTRACT`, `PUBLIC_GATEWAY_URL`.
