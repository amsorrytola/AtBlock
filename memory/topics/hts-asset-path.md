# Topic: HTS asset path (Hedera stretch)

> Last updated: 2026-09-11  
> Status: scaffolded — default remains HBAR `0.0.0` for Blocky402 Exact

## Why this exists

Hedera agentic-payments extras call out HTS / non-HBAR assets. AtBlock meters Exact payments; the asset id is already pluggable via `HEDERA_ASSET`.

## Current behavior (coded)

| Env | Meaning |
|-----|---------|
| `HEDERA_ASSET=0.0.0` (default) | Native HBAR; receipt `assetKind: "HBAR"` |
| `HEDERA_ASSET=0.0.x` | HTS token id; receipt `assetKind: "HTS"` |

402 `accepts[].extra` includes `assetKind` + `assetTokenId`. Facilitator + payer must support that token on testnet.

## Demo note

Film with HBAR first (qualify path). Mention HTS switch as one-line env change if judges ask about extras — do not block happy path on minting a custom token.

## Not in happy path yet

- Creating/minting an AtBlock HTS token
- Scheduled HBAR/HTS streams

Those stay stretch after live Blocky402 pay works.
