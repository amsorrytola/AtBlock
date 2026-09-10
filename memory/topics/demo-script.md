# Topic: Demo script (2–4 min · human narration)

> Last updated: 2026-09-11  
> Status: draft — film only after live Blocky402 + Graph work

## Hard rules (ETHOnline)

- 2–4 minutes, ≥720p, desktop capture, **your voice** (no AI voiceover, no music-as-narration)

## Shot list (~180s)

| T | Screen | Say |
|---|--------|-----|
| 0:00–0:10 | Web wordmark AtBlock | “AtBlock: agents only pay for on-chain facts they can re-derive. No cite, no coin.” |
| 0:10–0:25 | Pin chips + ENS / EAC | “Buyer agent is an ENSv2 name. Pin shows readiness. I grant then revoke spend with EAC — `pin-demo`.” |
| 0:25–0:40 | `/.well-known/agent.json` or `/v1/directory` | “Agents discover us here — Hedera network, metering, HashScan, identity card.” |
| 0:40–0:55 | `/v1/schema/yield` | “One Messari yield query — Yearn eth + arb. Same shape, two deployments.” |
| 0:55–1:35 | `npm run pay` + receipt | “HTTP 402. Settle on Hedera testnet through Blocky402. Metered: price times protocol count. Receipt shows HBAR Exact + HashScan.” |
| 1:35–2:10 | Cite + Re-derive | “Cite has block, deployment IDs, query hash. Re-derive hits The Graph again — match. No match, no coin.” |
| 2:10–2:30 | HCS topic + optional schedule | “Payment and cite audited on HCS. Schedule/HTS extras are documented for metering stretch.” |
| 2:30–2:50 | Partners + `/qualify.html` | “Submitting under The Graph, Hedera, and ENS.” |

## Pre-roll checklist

Open `docs/atblock-judge-qualify-checklist.html` or web `/qualify.html` and tick only live rows.

## Do not show

- `DEMO_ACCEPT_PAYMENT` / `X-PAYMENT: demo`
- Empty Graph errors
- Seed phrases or `.env`
- Substreams (stretch only — not happy path)
