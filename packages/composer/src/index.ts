export type VaultRow = {
  id: string;
  name: string | null;
  symbol: string | null;
  totalValueLockedUSD: string;
  inputToken?: { symbol?: string; id?: string } | null;
};

export type YieldSnapshot = {
  protocol: string;
  protocolSlug: string | null;
  schemaVersion: string | null;
  methodologyVersion: string | null;
  deploymentId: string;
  endpoint: string;
  networkHint: string | null;
  vaultCount: number;
  totalValueLockedUSD: string;
  topVaults: VaultRow[];
  blockNumber: number;
  blockTimestamp: number | null;
};

export type CitedFact = {
  schema: "messari-yield-aggregator";
  query: string;
  snapshots: YieldSnapshot[];
  blockNumber: number;
  deploymentIds: string[];
  queryHash: string;
  fetchedAt: string;
  standardsNote: string;
};

function hashQuery(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return `q${(h >>> 0).toString(16)}`;
}

/** Messari Yield Aggregator schema — one query shape across every conforming deployment. */
export const YIELD_QUERY = `
query AtBlockVaultBoard {
  protocols(first: 1) {
    id
    name
    slug
    schemaVersion
    subgraphVersion
    methodologyVersion
    network
    totalValueLockedUSD
  }
  vaults(first: 8, orderBy: totalValueLockedUSD, orderDirection: desc) {
    id
    name
    symbol
    totalValueLockedUSD
    inputToken { id symbol }
  }
  _meta {
    block { number timestamp }
    deployment
    hasIndexingErrors
  }
}
`.trim();

export type ComposerConfig = {
  endpoints: string[];
  apiKey?: string;
};

export function endpointsFromIds(
  ids: string[],
  apiKey: string,
  gatewayBase = "https://gateway.thegraph.com/api",
): string[] {
  return ids
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => `${gatewayBase.replace(/\/$/, "")}/${apiKey}/subgraphs/id/${id}`);
}

type GraphPayload = {
  data?: {
    protocols?: {
      id?: string;
      name?: string;
      slug?: string;
      schemaVersion?: string;
      methodologyVersion?: string;
      network?: string;
      totalValueLockedUSD?: string;
    }[];
    vaults?: {
      id: string;
      name?: string;
      symbol?: string;
      totalValueLockedUSD?: string;
      inputToken?: { id?: string; symbol?: string } | null;
    }[];
    _meta?: {
      block?: { number?: number; timestamp?: number };
      deployment?: string;
      hasIndexingErrors?: boolean;
    };
  };
  errors?: unknown;
};

/**
 * Fan one Messari yield query across N live Graph endpoints.
 * Empty endpoints must not be mocked for prize demos.
 */
export async function composeYieldFact(config: ComposerConfig): Promise<CitedFact> {
  if (!config.endpoints.length) {
    throw new Error("No GRAPH_YIELD_ENDPOINTS configured — live Graph required");
  }

  const snapshots: YieldSnapshot[] = [];
  for (const endpoint of config.endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify({ query: YIELD_QUERY }),
    });
    if (!res.ok) {
      throw new Error(`Graph query failed (${res.status}) for ${endpoint}`);
    }
    const json = (await res.json()) as GraphPayload;
    if (json.errors) throw new Error(`Graph errors at ${endpoint}: ${JSON.stringify(json.errors)}`);
    if (json.data?._meta?.hasIndexingErrors) {
      throw new Error(`Graph indexing errors at ${endpoint} — refusing stale cite`);
    }

    const proto = json.data?.protocols?.[0];
    const blockNumber = json.data?._meta?.block?.number ?? 0;
    const deploymentId = json.data?._meta?.deployment ?? endpoint;
    const vaults = json.data?.vaults ?? [];
    const tvl = proto?.totalValueLockedUSD ?? vaults[0]?.totalValueLockedUSD ?? "0";

    snapshots.push({
      protocol: proto?.name ?? "unknown",
      protocolSlug: proto?.slug ?? null,
      schemaVersion: proto?.schemaVersion ?? null,
      methodologyVersion: proto?.methodologyVersion ?? null,
      deploymentId,
      endpoint,
      networkHint: proto?.network ?? null,
      vaultCount: vaults.length,
      totalValueLockedUSD: String(tvl),
      topVaults: vaults.map((v) => ({
        id: v.id,
        name: v.name ?? null,
        symbol: v.symbol ?? null,
        totalValueLockedUSD: String(v.totalValueLockedUSD ?? "0"),
        inputToken: v.inputToken ?? null,
      })),
      blockNumber,
      blockTimestamp: json.data?._meta?.block?.timestamp ?? null,
    });
  }

  const liveBlocks = snapshots.map((s) => s.blockNumber).filter(Boolean);
  const blockNumber = liveBlocks.length ? Math.min(...liveBlocks) : 0;
  const deploymentIds = snapshots.map((s) => s.deploymentId);
  const queryHash = hashQuery(YIELD_QUERY + "|" + deploymentIds.sort().join("|"));

  return {
    schema: "messari-yield-aggregator",
    query: YIELD_QUERY,
    snapshots,
    blockNumber,
    deploymentIds,
    queryHash,
    fetchedAt: new Date().toISOString(),
    standardsNote:
      "One Messari Yield Aggregator query shape × N deployments — adding a protocol is a registry entry, not new adapters.",
  };
}

export async function rederiveMatches(cite: CitedFact, config: ComposerConfig): Promise<boolean> {
  const again = await composeYieldFact(config);
  if (again.deploymentIds.slice().sort().join() !== cite.deploymentIds.slice().sort().join()) {
    return false;
  }
  // TVL can move between calls; pin identity is queryHash + deployments.
  // For strict demo, also require same queryHash (query text + deployment set).
  return again.queryHash === cite.queryHash;
}

export function compareSnapshots(cite: CitedFact): {
  protocol: string;
  tvlUSD: string;
  network: string | null;
}[] {
  return cite.snapshots.map((s) => ({
    protocol: s.protocol,
    tvlUSD: s.totalValueLockedUSD,
    network: s.networkHint,
  }));
}
