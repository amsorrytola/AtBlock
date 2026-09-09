# Topic: Known Graph yield deployments (Messari Yield Aggregator)

> Last updated: 2026-09-10 · tick 5  
> Source: `messari/subgraphs` `deployment/deployment.json` (decentralized-network query-id)

## Query URL pattern

```
https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${SUBGRAPH_ID}
```

## Recommended AtBlock pair (same schema, two networks)

| Label | Network | query-id |
|-------|---------|----------|
| yearn-v2-ethereum | ethereum | `FDLuaz69DbMADuBjJDEcLnTuPnjhZqNbFVrkNiBLGkEg` |
| yearn-v2-arbitrum | arbitrum | `G3JZhmKKHC4mydRzD6kSz5fCWve5WDYYCyTFSJyv3SD5` |

```
GRAPH_YIELD_SUBGRAPH_IDS=FDLuaz69DbMADuBjJDEcLnTuPnjhZqNbFVrkNiBLGkEg,G3JZhmKKHC4mydRzD6kSz5fCWve5WDYYCyTFSJyv3SD5
```

## Optional third deployment (composition depth + metering)

Append Badger for a 3-protocol meter demo (raises 402 `maxAmountRequired`):

```
GRAPH_YIELD_SUBGRAPH_IDS=FDLuaz69DbMADuBjJDEcLnTuPnjhZqNbFVrkNiBLGkEg,G3JZhmKKHC4mydRzD6kSz5fCWve5WDYYCyTFSJyv3SD5,BchjnXAXXV5coiCBMQH4A8yCHXEFX9S88JFF6G3mfem4
```

## Other prod yield IDs (swap in if Yearn is stale)

| Label | query-id |
|-------|----------|
| badgerdao-ethereum | `BchjnXAXXV5coiCBMQH4A8yCHXEFX9S88JFF6G3mfem4` |
| rari-vaults-ethereum | `Dy1yVPfbS27HTrqEq3nLGFGi3TMYxPzSfY7Zxxj5ZJhf` |
| convex-finance-ethereum | `7rFZ2x6aLQ7EZsNx8F5yenk4xcqwqR3Dynf9rdixCSME` |
| aura-finance-ethereum | `EcNHwEGXq3KW1vCbHHj1iwvtf62ae5kxzEQhKtRqPygt` |

Hosted-service slugs are **dead** — do not use `api.thegraph.com/subgraphs/name/...`.
