# Topic: Qualification matrix (AtBlock)

> Last updated: 2026-09-11  
> Status: active — **coded** ≠ **live-qualified**  
> Partners selected (max 3): **The Graph · Hedera · ENS**

Tick this during build. A row is **done** only when it can be shown in the demo video.

## The Graph — Composable / Standardized ($5,000)

| Req | Status | Evidence |
|-----|--------|----------|
| Compose 2+ Graph products **or** meaningful standardized schema | coded | `packages/composer` fans one Messari yield query × N endpoints |
| Live data from a Graph provider (Studio / Market) | blocked | needs `GRAPH_API_KEY` + live IDs |
| Not “one subgraph, no composition” | coded | multi-endpoint registry |
| Standards leverage explained | coded | README + `SKILL.md` + `/v1/schema/yield` |
| Public repo + 2–4 min video | partial | https://github.com/amsorrytola/AtBlock public; video todo |

## The Graph — AI Tooling / Use From Scratch ($5,000)

| Req | Status | Evidence |
|-----|--------|----------|
| Graph is load-bearing (tooling **or** agent data source) | coded | gateway + `SKILL.md` + directory + `/.well-known/agent.json` |
| Live provider data | blocked | API key |
| Meaningful work (reason / decide / NL), not raw dump | coded | cite + rederive match |
| Open-source README or SKILL.md | coded | root `SKILL.md` + `AGENTS.md` |
| Correct pool: Start Fresh | done | Classic mode |
| Optional: Substreams one-prompt deploy | stretch | `topics/substreams-stretch.md` |

## Hedera — AI & Agentic Payments ($6,000 · up to 3× $2,000)

| Req | Status | Evidence |
|-----|--------|----------|
| Live x402-gated service on Hedera testnet/mainnet | coded | `apps/gateway` 402 |
| Settled through **Blocky402** facilitator | coded | `/verify` + `/settle` against `api.testnet.blocky402.com` |
| Agent/platform consumes it; ≥1 real paid request E2E | blocked | needs payer/payee keys + `npm run pay` |
| README: setup, architecture, payment flow | coded | root README |
| Video ≤5 min showing the paid request | todo | user records |
| Extra: metered (not flat) | coded | price × protocolCount in requirements.extra |
| Extra: HCS audit trail | coded | `audit.ts` + `create-topic` CLI + optional topic submit |
| Extra: ERC-8004 or HCS-14 identity | coded (inspired) | `GET /v1/identity` HCS-14-inspired card; full registry stretch |
| Extra: discovery directory | coded | `GET /v1/directory` |
| Extra: HashScan / explorer UX | coded | `hashscan.ts` in responses + web links |
| Extra: payment receipt object | coded | `receipt` on paid responses |
| Extra: HTS / scheduled stream | documented | `assetKind` + `/v1/payments/schedule` stretch (HBAR Exact happy path) |

## Hedera — Harness ($2,000) — not load-bearing

| Req | Status | Evidence |
|-----|--------|----------|
| Meaningful harness PR or inspired harness | deferred | |

## ENS — Best Use of ENSv2 ($4,500 · 4 podium slots)

| Req | Status | Evidence |
|-----|--------|----------|
| Built on ENSv2 (Sepolia) | coded | `@atblock/ens` viem/Sepolia |
| ENSv2 features **central** (hierarchy / EAC / permissioned resolver / aliasing) | coded | EAC grant/revoke + `pin-demo` / `revoke-demo` / `grant-demo` |
| Functional demo, not hardcoded values | blocked | needs live name + keys |
| Video or live demo + OSS GitHub | todo | |
| Bonus: agents as namespaces with permissions | coded (awaiting live) | Pin step + `/v1/ens/status` + roles chip |

## Cross-cutting (ETHGlobal process)

| Req | Status |
|-----|--------|
| Check-in #1 (2026-09-08 ~09:29 IST) | **missed** (not automatic DQ) |
| Check-in #2 (2026-09-11 ~09:29 IST) | **due now** — paste `artifacts/checkin-2-form.md` |
| Final submit 2026-09-13 12:00pm EDT | todo |
| Git history throughout (no one-commit) | done | progressive history on `amsorrytola/AtBlock` |
| AI attribution in repo | done (`AI_ATTRIBUTION.md`) |
| Human-narrated 2–4 min ≥720p video (no AI voice) | **user records** |
| Select exactly 3 partners on the form: Graph, Hedera, ENS | todo |
