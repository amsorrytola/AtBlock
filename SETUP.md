# SETUP — unblock AtBlock (human checklist)

Do these in order. Secrets stay in `.env` only (never commit).

## 0. Check-in #2 (due ~09:29 IST Fri Sep 11) — do first tonight/AM

Paste from [`memory/artifacts/checkin-2-pitch.md`](./memory/artifacts/checkin-2-pitch.md) into the ETHGlobal dashboard.

Confirm Check-in #1 was submitted ([`checkin-1-pitch.md`](./memory/artifacts/checkin-1-pitch.md)).

## 1. Hedera testnet accounts

1. Create **two** testnet accounts (payee/merchant + payer/buyer) via the [Hedera portal faucet](https://portal.hedera.com/).
2. Copy `.env.example` → `.env`.
3. Set:
   - `HEDERA_PAYEE_ACCOUNT_ID` / `HEDERA_PAYEE_PRIVATE_KEY`
   - `HEDERA_PAYER_ACCOUNT_ID` / `HEDERA_PAYER_PRIVATE_KEY`
   - `FACILITATOR_URL=https://api.testnet.blocky402.com`

## 2. The Graph Studio API key

1. Create an API key in [Subgraph Studio](https://thegraph.com/studio/).
2. Set `GRAPH_API_KEY=...`
3. Set recommended Messari yield IDs (prod / decentralized):

```
GRAPH_YIELD_SUBGRAPH_IDS=FDLuaz69DbMADuBjJDEcLnTuPnjhZqNbFVrkNiBLGkEg,G3JZhmKKHC4mydRzD6kSz5fCWve5WDYYCyTFSJyv3SD5
```

(yearn-v2-ethereum + yearn-v2-arbitrum — same Messari yield schema, two networks)

## 3. Smoke the money path

```bash
npm install
npm run qualify                                 # typecheck + Blocky402 smoke
npm run create-topic -w @atblock/gateway        # paste HCS_TOPIC_ID into .env
npm run dev:gateway
# other terminal:
npm run pay -w @atblock/gateway
npm run probe:graph -w @atblock/gateway
```

Expect: 402 → settle → fact (or 503 until Graph key works — payment can still prove Hedera).

## 4. ENSv2 (Sepolia) — after pay works

1. Sepolia ETH + MockUSDC mint (see ENS app-dev docs).
2. Register a parent / subname for the buyer agent.
3. Set `ENS_RPC_URL`, `ENS_PRIVATE_KEY`, `ENS_AGENT_NAME`, `ENS_EAC_CONTRACT`.
4. `npm run grant-demo -w @atblock/ens` then `npm run revoke-demo -w @atblock/ens`
   (or one-shot: `npm run pin-demo -w @atblock/ens`)

## Partners on final form

The Graph · Hedera · ENS only.

## Final submit

Sun Sep 13 2026 **12:00pm EDT** (~21:30 IST) — see `memory/topics/final-submit-countdown.md`.
Human-narrated 2–4 min ≥720p video required (no AI voice).
