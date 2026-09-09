/**
 * Probe Messari yield subgraph endpoints without payment.
 * Usage:
 *   npm run probe:graph -w @atblock/gateway
 *   npm run probe:graph -w @atblock/gateway -- --dry
 */
import { composeYieldFact, endpointsFromIds, YIELD_QUERY } from "@atblock/composer";
import { loadEnv } from "./load-env.js";

loadEnv();

async function main() {
  const dry = process.argv.includes("--dry");
  if (dry) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "dry",
          schema: "messari-yield-aggregator",
          query: YIELD_QUERY,
          recommendedIds: (process.env.GRAPH_YIELD_SUBGRAPH_IDS ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          note: "Dry mode never mocks TVL — live compose still needs GRAPH_API_KEY",
        },
        null,
        2,
      ),
    );
    return;
  }

  const direct = (process.env.GRAPH_YIELD_ENDPOINTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const ids = (process.env.GRAPH_YIELD_SUBGRAPH_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const key = process.env.GRAPH_API_KEY ?? "";
  const endpoints =
    direct.length > 0 ? direct : key && ids.length ? endpointsFromIds(ids, key) : [];

  if (!endpoints.length) {
    throw new Error(
      "Set GRAPH_API_KEY + GRAPH_YIELD_SUBGRAPH_IDS (or GRAPH_YIELD_ENDPOINTS). Or pass --dry for schema-only.",
    );
  }

  console.log(
    JSON.stringify(
      {
        endpointCount: endpoints.length,
        queryPreview: YIELD_QUERY.slice(0, 120) + "…",
      },
      null,
      2,
    ),
  );

  const fact = await composeYieldFact({ endpoints, apiKey: key || undefined });
  console.log(
    JSON.stringify(
      {
        ok: true,
        queryHash: fact.queryHash,
        blockNumber: fact.blockNumber,
        deploymentIds: fact.deploymentIds,
        snapshots: fact.snapshots.map((s) => ({
          protocol: s.protocol,
          network: s.networkHint,
          tvlUSD: s.totalValueLockedUSD,
          vaultCount: s.vaultCount,
          schemaVersion: s.schemaVersion,
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
