# Topic: Architecture

> Last updated: 2026-09-10  
> Status: active

```
                 ┌─────────────────────┐
                 │ Human owner (ENS)   │
                 │ EAC revoke spend    │
                 │ revoke-demo CLI     │
                 └──────────┬──────────┘
                            │
┌──────────────┐   x402    ┌▼────────────────────────┐
│ Buyer agent  │──────────►│ apps/gateway v0.2       │
│ (pay script) │  402/pay  │ Blocky402 verify/settle │
└──────────────┘           │ /directory · /ens/status│
                           │ HashScan explorers      │
                           │ JSON request logs       │
                           └──────────┬───────────────┘
                                      │ cited fact + audit
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
           packages/composer   HCS topic (opt)    local JSONL
           Messari yield × N   create-topic CLI   .audit/
           Yearn eth + arb
                    │
                    ▼
           The Graph gateway (Studio API key)
```

## HTTP surface

| Route | Role |
|-------|------|
| `GET /health` | Facilitator / payee / Graph / ENS / HCS readiness |
| `GET /v1/directory` | Agent discovery + metering hint + explorers |
| `GET /v1/identity` | HCS-14-inspired agent identity card |
| `GET /v1/ens/status` | ENSv2 Sepolia pin |
| `GET /.well-known/agent.json` | Agent discovery document |
| `GET /v1/schema/yield` | Messari query text (no Graph key) |
| `GET/POST /v1/facts/yield` | 402 unpaid → paid Messari cite + `receipt` (+ Idempotency-Key) |
| `POST /v1/facts/yield/rederive` | Cite stands or no-coin |

## Operator CLIs

| Command | Purpose |
|---------|---------|
| `npm run smoke:facilitator -w @atblock/gateway` | Blocky402 `/supported` |
| `npm run pay -w @atblock/gateway` | Real Exact settle (judges) |
| `npm run create-topic -w @atblock/gateway` | HCS audit topic |
| `npm run probe:graph -w @atblock/gateway` | Live Messari fan-out |
| `npm run revoke-demo -w @atblock/ens` | EAC revoke on Sepolia |

## Prize mapping

| Component | Partner track |
|-----------|----------------|
| composer + SKILL.md + live Graph | The Graph standardized + AI |
| gateway x402 + Blocky402 + meter + HCS + directory | Hedera agentic payments |
| ens revoke / agent name / pin status | ENSv2 best use |
