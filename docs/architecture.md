# Architecture — AtBlock Fact Gateway

Production-shaped payment + citation pipeline for ETHOnline 2026 judges.

## Layers

1. **Edge** — Hono HTTP API (`apps/gateway`): CORS, `X-Request-Id`, `X-Response-Time`, in-process metrics, OpenAPI.
2. **Payments** — x402 Exact on Hedera testnet via Blocky402 (`/verify` + `/settle`). Metered: `PRICE_TINYBAR_PER_PROTOCOL × protocolCount`.
3. **Composition** — `@atblock/composer` fans one Messari Yield Aggregator GraphQL query across ≥2 deployments; refuses indexing errors.
4. **Citation** — response carries `{ blockNumber, deploymentIds, queryHash }`; `POST /rederive` must match (“no cite, no coin”).
5. **Identity / pin** — ENSv2 Sepolia + optional EAC roles; discovery via `/v1/directory`, `/.well-known/agent.json`, HCS-14-inspired `/v1/identity`.
6. **Audit** — optional HCS topic submit + local JSONL; HashScan links on receipts.

## Sequence

```
Buyer → GET /v1/facts/yield
     ← 402 + accepts[exact] (price × N)
Buyer → GET + X-PAYMENT (signed @x402/hedera)
Gateway → Blocky402 /verify + /settle
Gateway → Graph Studio (Messari yield × N)
     ← fact + receipt + explorers + optional HCS
Buyer → POST /v1/facts/yield/rederive { cite }
     ← match | no-cite-no-coin
```

## Discovery surfaces

| Path | Role |
|------|------|
| `GET /v1/directory` | Catalog + metering hint |
| `GET /.well-known/agent.json` | Agent well-known |
| `GET /v1/openapi.json` | Machine-readable API |
| `GET /v1/metrics` | Demo ops counters |
| `GET /v1/health` | Readiness (503 until live) |
| `GET /v1/schema/yield` | Schema without live Graph |

Judge payment path: `npm run pay -w @atblock/gateway` (never demo header).
