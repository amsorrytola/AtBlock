# Check-in #2 — copy/paste answers

> Submit on ETHGlobal dashboard ASAP (due ~09:29 IST Fri Sep 11, 2026).

## Already filled (keep)

| Field | Value |
| --- | --- |
| Project name | Atblock |
| Category | Artificial Intelligence |
| Emoji | 🧱 |

## GitHub repository (must be public)

```
https://github.com/amsorrytola/AtBlock
```

## Short description * (≤100 characters)

```
Agents pay for Graph-cited vault facts on Hedera x402 — no cite, no coin.
```

## Your Plan

```
Ship Pin → Pay → Prove end-to-end before final submit (Sun Sep 13):
1) Live Blocky402 settle on Hedera testnet (buyer CLI, not demo header)
2) Live Messari Yield Aggregator compose ≥2 Graph deployments + cite/rederive
3) ENS Sepolia pin-demo (grant → revoke) on camera
4) Film 2–4 min ≥720p human-voice demo; Classic / from scratch; partners Graph · Hedera · ENS
```

## Any blockers? Need help?

```
Waiting on Hedera testnet account + Blocky402 payer keys, Graph Studio API key, and ENS Sepolia name/private key. Architecture and CLIs are ready; blocked only on live credentials for end-to-end settle + compose. Missed Check-in #1 — focusing hard on #2 + final submit.
```

## Is there anything else you think we should know?

```
Wedge: unpaid GET /v1/facts/yield → 402 Exact (Hedera) → settle via api.testnet.blocky402.com → Messari yield facts with cite {block, deploymentIds, queryHash} → POST /rederive must match (“no cite, no coin”). Extras: HCS audit, HashScan, /.well-known/agent.json, directory, identity, AGENTS.md/SKILL.md. DEMO_ACCEPT_PAYMENT is UI-only — judges use npm run pay.
```

## Will you be joining us for Live Judging to qualify for Top 10 Finalist?

**Yes** — pick Yes if you can present live when called.

## Are you on track for submitting a project?

**Yes**

## Are there any prizes in particular you're going for?

1. **The Graph**
2. **Hedera**
3. **ENS**

## What progress did you make since the last check-in?

```
Built a production-shaped fact gateway + Pin → Pay → Prove console.

Hedera / Blocky402: HTTP 402 Exact on Hedera testnet; verify+settle against api.testnet.blocky402.com; metered price × protocol count; buyer CLI (npm run pay); HCS audit helper; discovery directory + /.well-known/agent.json; identity card; HashScan links; payment receipt (HBAR/HTS); Idempotency-Key; /v1/payments/schedule.

The Graph: Messari Yield Aggregator across ≥2 deployments (Yearn eth + arb); cite with block / deploymentIds / queryHash; re-derive endpoint; /v1/schema/yield + SKILL.md / AGENTS.md; fail closed if Graph missing (no mocks).

ENS: Sepolia resolve + EAC grant/revoke (pin-demo); gateway /v1/ens/status; Pin step in the web console.

Still wiring live keys for settle + Graph compose + Sepolia name demo. Partners: The Graph · Hedera · ENS. Classic / from scratch. (Check-in #1 was missed — not treating as DQ; prioritizing #2 + final submit.)
```
