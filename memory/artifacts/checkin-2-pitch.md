# Artifact: Check-in #2 paste

> Due: **~09:29 IST Fri Sep 11, 2026**  
> User submits on the ETHGlobal dashboard. Update progress bullets if code moved further.

## Title

AtBlock

## Progress since start / Check-in #1 window

(Note: Check-in #1 was missed — not an automatic DQ; focusing on Check-in #2 + strong final submit.)

Built a production-shaped fact gateway and demo console for the Pin → Pay → Prove path.

**Hedera / Blocky402:** HTTP 402 Exact gate on Hedera testnet; verify+settle against `api.testnet.blocky402.com`; metered price × protocol count; buyer CLI (`npm run pay`); HCS audit topic helper; discovery directory + `/.well-known/agent.json`; HCS-14-inspired identity card; HashScan links; judge-facing payment receipt (`assetKind` HBAR/HTS); Idempotency-Key retries; `/v1/payments/schedule` stretch surface.

**The Graph:** One Messari Yield Aggregator query across ≥2 deployments (Yearn eth + arb); cite with block / deploymentIds / queryHash; re-derive endpoint; `/v1/schema/yield` + `SKILL.md` / `AGENTS.md` for agents; fail closed if Graph missing (no mocks).

**ENS:** Sepolia helpers for resolve + EAC grant/revoke (`pin-demo` one-shot); gateway `/v1/ens/status` with roles; Pin step in the web console.

Still wiring live keys for end-to-end settle + live Graph compose, then Sepolia name demo. Partners remain The Graph · Hedera · ENS. Classic / from scratch.

## One-liner (if asked again)

No cite, no coin — agents pay for Graph-pinned vault facts on Hedera x402, named under ENSv2.

## Partners (form)

1. The Graph  
2. Hedera  
3. ENS  
