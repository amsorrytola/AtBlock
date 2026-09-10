# Topic: Sponsor surface (maximize prize extras)

> Last updated: 2026-09-11 (continue without keys)  
> Status: active — deepen until live qualify, then polish demo

Use this as the build-loop backlog. Prefer items that show on camera.
**User (2026-09-11):** keys will take time — do not stall; keep shipping coded surfaces.

## Hedera (primary win bet)

| Surface | Status | Where |
|---------|--------|-------|
| x402 Exact gated API | coded | `apps/gateway` |
| Blocky402 verify + settle | coded | facilitator `api.testnet.blocky402.com` |
| Metered pricing | coded | `PRICE_TINYBAR_PER_PROTOCOL` × protocol count |
| HCS audit trail | coded | `audit.ts` + `create-topic` |
| Discovery directory | coded | `/v1/directory` |
| HashScan deep links | coded | `hashscan.ts` + web |
| Structured operator logs | coded | `logger.ts` |
| Buyer CLI (`@x402/hedera`) | coded | `pay-once.ts` |
| Judge-facing payment receipt | coded | `receipt.ts` on paid responses |
| HCS-14-inspired identity card | coded | `GET /v1/identity` (inspiredBy, not full registry) |
| HTS token (non-HBAR) | scaffolded | `assetKind` + [hts-asset-path.md](./hts-asset-path.md); default still `0.0.0` |
| Full HCS-14 registry publish | stretch | |
| Scheduled payments / streams | documented | `GET /v1/payments/schedule` stretch story |
| Agent well-known discovery | coded | `GET /.well-known/agent.json` |
| Idempotency-Key retries | coded | 15m in-memory cache |
| POST yield (agent clients) | coded | same handler as GET |

## The Graph

| Surface | Status | Where |
|---------|--------|-------|
| Messari Yield Aggregator schema | coded | `YIELD_QUERY` |
| ≥2 deployments one query | coded | Yearn eth + arb IDs |
| Indexing-error refuse | coded | composer |
| Agent SKILL.md | coded | root |
| Probe CLI | coded | `probe:graph` (+ `--dry` schema) |
| Schema-only HTTP route | coded | `GET /v1/schema/yield` |
| Live Studio key | blocked | B-003 |
| Substreams one-prompt | stretch | [substreams-stretch.md](./substreams-stretch.md) — after live qualify |

## ENS

| Surface | Status | Where |
|---------|--------|-------|
| Sepolia resolve | coded | `@atblock/ens` |
| EAC revoke helper | coded | `revokeAgentRoles` |
| EAC grant + hasRoles | coded | `grantAgentRoles` / `agentHasRoles` |
| Revoke demo CLI | coded | `revoke-demo` |
| Grant demo CLI | coded | `grant-demo` |
| Pin demo (grant→revoke) | coded | `pin-demo` |
| Gateway pin status | coded | `/v1/ens/status` (+ roles when EAC set) |
| Web Pin step | coded | `apps/web` |
| Live name + EAC contract | blocked | after pay path |

## Process / polish

| Surface | Status |
|---------|--------|
| Credentials PDF | done (`docs/`) |
| AI attribution | done |
| Progressive git commits | waiting on user ask |
| Human demo video | B-005 |
| Web receipt + cite board | coded | `apps/web` Pin/Pay/Prove |
| README payment sequence | coded | root README |
| Graph fail-closed UI copy | coded | web banner when `graphReady` false |
| Auto-load repo `.env` | coded | `load-env.ts` gateway + ens CLIs |
| `npm run qualify` gate | coded | `scripts/qualify.mjs` |
| Optional 3rd Messari ID | documented | Badger `BchjnXA…` in graph-yield-endpoints |
| Final-submit countdown | coded | `topics/final-submit-countdown.md` |
| Web qualify checklist link | coded | `/qualify.html` in web public |
| MIT LICENSE | done | root `LICENSE` |
| SETUP Check-in #2 first | done | `SETUP.md` |
| docker-compose | coded | root `docker-compose.yml` |
