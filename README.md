# AtBlock

Agents pay for live on-chain vault facts only when the answer re-derives at a pinned Graph block.

**No cite, no coin.**

ETHOnline 2026 · Classic / From Scratch · Partners: **The Graph · Hedera · ENS**

## What judges should see

1. **Pin** — ENSv2 agent name readiness + gateway directory (`/v1/directory`)
2. **Pay** — unpaid `GET /v1/facts/yield` → HTTP **402** → Blocky402 verify/settle on Hedera testnet (metered: price × protocol count)
3. **Prove** — response cite `{ blockNumber, deploymentIds, queryHash }` → `POST /v1/facts/yield/rederive` must match
4. **Extras (Hedera)** — HCS audit topic, HashScan links, discovery directory, identity card, payment `receipt`

## Payment flow

```
Buyer                    Gateway                         Blocky402              The Graph
  |                         |                                |                      |
  |-- GET /v1/facts/yield ->|                                |                      |
  |<- 402 + accepts[exact] -|                                |                      |
  |  (price × protocolCount)|                                |                      |
  |  sign @x402/hedera      |                                |                      |
  |-- GET + X-PAYMENT ----->|                                |                      |
  |                         |-- /verify + /settle ---------->|                      |
  |                         |<- settle receipt --------------|                      |
  |                         |-- Messari yield query × N --------------------------->|
  |                         |<- snapshots + _meta ----------------------------------|
  |<- fact + receipt + explorers + optional HCS audit -------|                      |
  |-- POST /rederive ------>|                                |                      |
  |<- match / no-cite-no-coin                                |                      |
```

Judge path: `npm run pay -w @atblock/gateway` (never demo header).

## Repo layout

```
apps/gateway       x402 fact API (Blocky402 + HCS + HashScan + directory + identity)
apps/web           Pin → Pay → Prove console (receipt + cite board)
packages/composer  Messari Yield Aggregator query × N deployments
packages/ens       Sepolia resolve + EAC revoke + revoke-demo CLI
docs/              Credentials checklist PDF + check-in paste
```

## Setup

```bash
cp .env.example .env   # fill keys; never commit secrets
npm install
npm run smoke:facilitator -w @atblock/gateway   # Blocky402 reachability
npm run create-topic -w @atblock/gateway        # optional HCS topic → HCS_TOPIC_ID
npm run dev:gateway
npm run pay -w @atblock/gateway                 # real payer settle (judges)
npm run probe:graph -w @atblock/gateway         # live Messari yield fan-out
npm run revoke-demo -w @atblock/ens             # after ENS Sepolia ready
npm run grant-demo -w @atblock/ens              # grant before revoke on camera
npm run pin-demo -w @atblock/ens                # grant → revoke one-shot
npm run typecheck
npm run qualify                                 # typecheck + Blocky402 smoke + env preflight
npm run dev:web
```

Facilitator URL must be `https://api.testnet.blocky402.com` (not the bare hostname).

Gateway + CLIs auto-load the repo-root `.env` when present (never commit it).

`DEMO_ACCEPT_PAYMENT=1` + `X-PAYMENT: demo` is UI wiring only — **not** valid for judges.

Discovery: `GET /v1/directory` · `GET /.well-known/agent.json` · identity: `GET /v1/identity` · schema: `GET /v1/schema/yield`.

Optional: `docker compose up` (loads `.env` when present).

## Architecture (short)

Buyer → gateway 402 → `@x402/hedera` Exact → Blocky402 `/verify` + `/settle` → composer queries ≥2 Messari yield subgraphs → cite + optional HCS message → buyer re-derives.

## AI attribution

See [AI_ATTRIBUTION.md](./AI_ATTRIBUTION.md). Built with Cursor assistance during ETHOnline 2026; human team owns check-ins, demo video narration, and direction.
