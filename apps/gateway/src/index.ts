import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import {
  composeYieldFact,
  compareSnapshots,
  endpointsFromIds,
  type CitedFact,
} from "@atblock/composer";
import { submitHcsAudit } from "./audit.js";
import { explorerBundle } from "./hashscan.js";
import { buildIdentityCard } from "./identity.js";
import { loadEnv } from "./load-env.js";
import { log, requestId } from "./logger.js";
import { buildReceipt } from "./receipt.js";
import { buildPaymentScheduleInfo } from "./schedule.js";

loadEnv();

/**
 * AtBlock fact gateway — production-shaped for ETHOnline judging.
 * unpaid → 402 (Hedera exact / Blocky402) → X-PAYMENT → verify+settle → cited Graph fact
 */

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "X-PAYMENT", "X-Payment", "Idempotency-Key", "idempotency-key", "X-Request-Id"],
    exposeHeaders: ["X-Request-Id"],
  }),
);

app.use("*", async (c, next) => {
  const rid = c.req.header("x-request-id") ?? requestId();
  const t0 = Date.now();
  await next();
  c.res.headers.set("X-Request-Id", rid);
  log.info("request", {
    requestId: rid,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    ms: Date.now() - t0,
  });
});

const PORT = Number(process.env.PORT ?? 8787);
const FACILITATOR_URL = (process.env.FACILITATOR_URL ?? "https://api.testnet.blocky402.com").replace(
  /\/$/,
  "",
);
const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";
const PAYEE = process.env.HEDERA_PAYEE_ACCOUNT_ID ?? "";
const ASSET = process.env.HEDERA_ASSET ?? "0.0.0";
const PRICE_TINYBAR_PER_PROTOCOL = BigInt(process.env.PRICE_TINYBAR_PER_PROTOCOL ?? "100000000");
const SERVICE_BASE = process.env.PUBLIC_GATEWAY_URL ?? `http://127.0.0.1:${PORT}`;

type PaymentRequirements = {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: Record<string, unknown>;
};

let cachedFeePayer: string | null = null;

async function hederaFeePayer(): Promise<string> {
  if (cachedFeePayer) return cachedFeePayer;
  const res = await fetch(`${FACILITATOR_URL}/supported`);
  if (!res.ok) throw new Error(`Facilitator /supported failed: ${res.status}`);
  const json = (await res.json()) as {
    kinds?: { network?: string; extra?: { feePayer?: string } }[];
    signers?: Record<string, string[]>;
  };
  const kind = json.kinds?.find((k) => k.network === NETWORK);
  cachedFeePayer = kind?.extra?.feePayer ?? json.signers?.["hedera:*"]?.[0] ?? "";
  if (!cachedFeePayer) throw new Error("No Hedera feePayer in facilitator /supported");
  return cachedFeePayer;
}

function yieldEndpoints(): string[] {
  const direct = (process.env.GRAPH_YIELD_ENDPOINTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (direct.length) return direct;
  const ids = (process.env.GRAPH_YIELD_SUBGRAPH_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const key = process.env.GRAPH_API_KEY ?? "";
  if (ids.length && key) return endpointsFromIds(ids, key);
  return [];
}

async function buildRequirements(protocolCount: number): Promise<PaymentRequirements> {
  if (!PAYEE || PAYEE === "0.0.0") {
    throw new Error("HEDERA_PAYEE_ACCOUNT_ID required for 402 requirements");
  }
  const feePayer = await hederaFeePayer();
  const amount = (PRICE_TINYBAR_PER_PROTOCOL * BigInt(Math.max(protocolCount, 1))).toString();
  return {
    scheme: "exact",
    network: NETWORK,
    maxAmountRequired: amount,
    resource: "/v1/facts/yield",
    description: "AtBlock metered yield fact (price × protocol count)",
    mimeType: "application/json",
    payTo: PAYEE,
    maxTimeoutSeconds: 60,
    asset: ASSET,
    extra: {
      feePayer,
      metering: "per-protocol",
      protocolCount,
      priceTinybarPerProtocol: PRICE_TINYBAR_PER_PROTOCOL.toString(),
      assetKind: ASSET === "0.0.0" ? "HBAR" : "HTS",
      assetTokenId: ASSET,
    },
  };
}

/** In-memory Idempotency-Key cache (process lifetime) — production agents can safely retry. */
const idempotencyCache = new Map<string, { at: number; body: unknown; status: number }>();
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;

function assetKindLabel(asset: string): "HBAR" | "HTS" {
  return asset === "0.0.0" ? "HBAR" : "HTS";
}

function decodePaymentHeader(header: string): unknown {
  try {
    return JSON.parse(Buffer.from(header, "base64").toString("utf8"));
  } catch {
    return JSON.parse(header);
  }
}

function extractSettleTx(settle: unknown): string | undefined {
  if (!settle || typeof settle !== "object") return undefined;
  const s = settle as Record<string, unknown>;
  for (const k of ["transaction", "txHash", "transactionId", "txid"]) {
    if (typeof s[k] === "string") return s[k] as string;
  }
  return undefined;
}

async function verifyAndSettle(paymentPayload: unknown, paymentRequirements: PaymentRequirements) {
  const verifyRes = await fetch(`${FACILITATOR_URL}/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      x402Version: 2,
      paymentPayload,
      paymentRequirements,
    }),
  });
  const verifyBody = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) {
    return { ok: false as const, stage: "verify" as const, status: verifyRes.status, body: verifyBody };
  }

  const settleRes = await fetch(`${FACILITATOR_URL}/settle`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      x402Version: 2,
      paymentPayload,
      paymentRequirements,
    }),
  });
  const settleBody = await settleRes.json().catch(() => ({}));
  if (!settleRes.ok) {
    return { ok: false as const, stage: "settle" as const, status: settleRes.status, body: settleBody };
  }
  return { ok: true as const, verify: verifyBody, settle: settleBody };
}

/** Agent discovery directory — Hedera extra: make the service findable. */
app.get("/v1/directory", async (c) => {
  const endpoints = yieldEndpoints();
  const protocolCount = Math.max(endpoints.length, 2);
  let price: string | null = null;
  try {
    const req = await buildRequirements(protocolCount);
    price = req.maxAmountRequired;
  } catch {
    price = null;
  }
  return c.json({
    name: "AtBlock Fact Gateway",
    version: "0.3.0",
    wedge: "no-cite-no-coin",
    description:
      "Metered Messari yield facts. Payment settles on Hedera via Blocky402. Cite must re-derive from The Graph.",
    network: NETWORK,
    facilitator: FACILITATOR_URL,
    endpoints: {
      health: `${SERVICE_BASE}/health`,
      yieldFact: `${SERVICE_BASE}/v1/facts/yield`,
      yieldSchema: `${SERVICE_BASE}/v1/schema/yield`,
      rederive: `${SERVICE_BASE}/v1/facts/yield/rederive`,
      ensPin: `${SERVICE_BASE}/v1/ens/status`,
      directory: `${SERVICE_BASE}/v1/directory`,
      identity: `${SERVICE_BASE}/v1/identity`,
      wellKnown: `${SERVICE_BASE}/.well-known/agent.json`,
      paymentSchedule: `${SERVICE_BASE}/v1/payments/schedule`,
    },
    payment: {
      scheme: "exact",
      asset: ASSET,
      assetKind: assetKindLabel(ASSET),
      metering: "per-protocol",
      indicativeMaxAmountRequired: price,
      protocolCount,
      idempotencyHeader: "Idempotency-Key",
    },
    graph: {
      schema: "messari-yield-aggregator",
      deploymentsConfigured: endpoints.length,
    },
    identity: {
      ensAgentName: process.env.ENS_AGENT_NAME ?? null,
      hcsTopicId: process.env.HCS_TOPIC_ID ?? null,
      card: `${SERVICE_BASE}/v1/identity`,
    },
    explorers: explorerBundle({
      payee: PAYEE || undefined,
      topicId: process.env.HCS_TOPIC_ID,
    }),
  });
});

app.get("/v1/identity", (c) => {
  return c.json(
    buildIdentityCard({
      serviceBase: SERVICE_BASE,
      network: NETWORK,
      facilitator: FACILITATOR_URL,
      asset: ASSET,
      payTo: PAYEE,
      hcsTopicId: process.env.HCS_TOPIC_ID,
      ensAgentName: process.env.ENS_AGENT_NAME,
    }),
  );
});

/** RFC 8615-style discovery for agent clients. */
app.get("/.well-known/agent.json", (c) => {
  return c.json({
    name: "AtBlock Fact Gateway",
    description: "No cite, no coin — metered Messari yield facts on Hedera x402 / Blocky402",
    version: "0.3.0",
    documentation: `${SERVICE_BASE}/v1/directory`,
    endpoints: {
      directory: `${SERVICE_BASE}/v1/directory`,
      identity: `${SERVICE_BASE}/v1/identity`,
      health: `${SERVICE_BASE}/health`,
      yieldFact: `${SERVICE_BASE}/v1/facts/yield`,
      yieldSchema: `${SERVICE_BASE}/v1/schema/yield`,
      rederive: `${SERVICE_BASE}/v1/facts/yield/rederive`,
      ens: `${SERVICE_BASE}/v1/ens/status`,
      paymentSchedule: `${SERVICE_BASE}/v1/payments/schedule`,
    },
    payment: {
      protocol: "x402",
      scheme: "exact",
      network: NETWORK,
      facilitator: FACILITATOR_URL,
      asset: ASSET,
      assetKind: assetKindLabel(ASSET),
      metering: "per-protocol",
    },
    authentication: {
      paymentHeader: "X-PAYMENT",
      idempotencyHeader: "Idempotency-Key",
    },
  });
});

/** Schema-only endpoint — no Graph key required; agents can inspect the Messari query. */
app.get("/v1/schema/yield", async (c) => {
  const { YIELD_QUERY } = await import("@atblock/composer");
  return c.json({
    schema: "messari-yield-aggregator",
    query: YIELD_QUERY,
    recommendedSubgraphIds: (process.env.GRAPH_YIELD_SUBGRAPH_IDS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    note: "Live compose requires GRAPH_API_KEY — this route never mocks data.",
  });
});

/** Hedera stretch: metering / schedule story (documented, not a fake stream executor). */
app.get("/v1/payments/schedule", (c) => {
  return c.json(
    buildPaymentScheduleInfo({
      network: NETWORK,
      asset: ASSET,
      priceTinybarPerProtocol: PRICE_TINYBAR_PER_PROTOCOL.toString(),
    }),
  );
});

app.get("/health", async (c) => {
  let facilitatorOk = false;
  let feePayer: string | null = null;
  try {
    const res = await fetch(`${FACILITATOR_URL}/health`);
    facilitatorOk = res.ok;
    feePayer = await hederaFeePayer();
  } catch {
    facilitatorOk = false;
  }
  const graphReady = yieldEndpoints().length >= 2 && Boolean(process.env.GRAPH_API_KEY);
  return c.json({
    ok: true,
    service: "atblock-gateway",
    version: "0.3.0",
    network: NETWORK,
    facilitator: FACILITATOR_URL,
    facilitatorOk,
    feePayer,
    payeeConfigured: Boolean(PAYEE && PAYEE !== "0.0.0"),
    graphEndpoints: yieldEndpoints().length,
    graphReady,
    hcsTopicConfigured: Boolean(process.env.HCS_TOPIC_ID),
    ensConfigured: Boolean(process.env.ENS_RPC_URL && process.env.ENS_AGENT_NAME),
    demoAcceptEnabled: process.env.DEMO_ACCEPT_PAYMENT === "1",
    assetKind: assetKindLabel(ASSET),
    identity: `${SERVICE_BASE}/v1/identity`,
    wellKnown: `${SERVICE_BASE}/.well-known/agent.json`,
    explorers: explorerBundle({
      payee: PAYEE || undefined,
      topicId: process.env.HCS_TOPIC_ID,
    }),
  });
});

app.get("/v1/ens/status", async (c) => {
  const rpc = process.env.ENS_RPC_URL;
  const name = process.env.ENS_AGENT_NAME;
  if (!rpc || !name) {
    return c.json({
      configured: false,
      hint: "Set ENS_RPC_URL + ENS_AGENT_NAME after Sepolia name is ready",
    });
  }
  try {
    const { pinStatus } = await import("@atblock/ens");
    const status = await pinStatus({
      rpcUrl: rpc,
      agentName: name,
      eacContract: process.env.ENS_EAC_CONTRACT as `0x${string}` | undefined,
      agentAccount: process.env.ENS_AGENT_ACCOUNT as `0x${string}` | undefined,
      roleBitmap: process.env.ENS_ROLE_BITMAP ? BigInt(process.env.ENS_ROLE_BITMAP) : 1n,
    });
    return c.json({ configured: true, ...status });
  } catch (err) {
    return c.json({ configured: true, error: String(err) }, 502);
  }
});

app.get("/v1/facts/yield", (c) => handleYieldFact(c));
app.post("/v1/facts/yield", (c) => handleYieldFact(c));

async function handleYieldFact(c: import("hono").Context) {
  const endpoints = yieldEndpoints();
  const protocolCount = Math.max(endpoints.length, 2);
  const paymentHeader = c.req.header("X-PAYMENT") ?? c.req.header("x-payment");
  const demoAccept = process.env.DEMO_ACCEPT_PAYMENT === "1" && paymentHeader === "demo";
  const idemKey = c.req.header("Idempotency-Key") ?? c.req.header("idempotency-key") ?? undefined;

  if (idemKey) {
    const hit = idempotencyCache.get(idemKey);
    if (hit && Date.now() - hit.at < IDEMPOTENCY_TTL_MS) {
      return c.json(hit.body, hit.status as 200);
    }
  }

  let requirements: PaymentRequirements;
  try {
    requirements = await buildRequirements(protocolCount);
  } catch (err) {
    return c.json({ error: String(err) }, 503);
  }

  if (!paymentHeader) {
    return c.json(
      {
        x402Version: 2,
        accepts: [requirements],
        directory: `${SERVICE_BASE}/v1/directory`,
        wellKnown: `${SERVICE_BASE}/.well-known/agent.json`,
      },
      402,
    );
  }

  let settlement: unknown = null;
  if (demoAccept) {
    settlement = { demo: true, warning: "DEMO_ACCEPT_PAYMENT — not valid for judges" };
  } else {
    let paymentPayload: unknown;
    try {
      paymentPayload = decodePaymentHeader(paymentHeader);
    } catch {
      return c.json(
        { error: "X-PAYMENT must be base64 JSON payment payload", accepts: [requirements] },
        402,
      );
    }
    const result = await verifyAndSettle(paymentPayload, requirements);
    if (!result.ok) {
      log.warn("blocky402_failed", { stage: result.stage, status: result.status });
      return c.json(
        {
          error: `Blocky402 ${result.stage} failed`,
          status: result.status,
          body: result.body,
          accepts: [requirements],
        },
        402,
      );
    }
    settlement = { verify: result.verify, settle: result.settle };
  }

  const settleTx =
    settlement && typeof settlement === "object" && "settle" in settlement
      ? extractSettleTx((settlement as { settle: unknown }).settle)
      : undefined;

  const audit = await submitHcsAudit({
    at: new Date().toISOString(),
    kind: "payment",
    payload: {
      demo: Boolean(demoAccept),
      settlement,
      protocolCount,
      settleTx: settleTx ?? null,
      idempotencyKey: idemKey ?? null,
    },
  });

  const receipt = buildReceipt({
    demo: Boolean(demoAccept),
    network: NETWORK,
    payTo: PAYEE,
    asset: ASSET,
    amountRequired: requirements.maxAmountRequired,
    protocolCount,
    settleTx,
    facilitator: FACILITATOR_URL,
    idempotencyKey: idemKey,
  });

  let fact: CitedFact;
  try {
    if (!endpoints.length) {
      const body = {
        error: "Graph endpoints not configured",
        hint: "Set GRAPH_API_KEY + GRAPH_YIELD_SUBGRAPH_IDS (≥2 Messari yield IDs)",
        settlement,
        audit,
        receipt,
        explorers: explorerBundle({
          payee: PAYEE,
          topicId: process.env.HCS_TOPIC_ID,
          settlementTx: settleTx,
        }),
      };
      if (idemKey) idempotencyCache.set(idemKey, { at: Date.now(), body, status: 503 });
      return c.json(body, 503);
    }
    fact = await composeYieldFact({
      endpoints,
      apiKey: process.env.GRAPH_API_KEY,
    });
  } catch (err) {
    log.error("compose_failed", { error: String(err) });
    return c.json({ error: String(err), settlement, audit, receipt }, 502);
  }

  await submitHcsAudit({
    at: new Date().toISOString(),
    kind: "cite",
    payload: {
      queryHash: fact.queryHash,
      blockNumber: fact.blockNumber,
      deploymentIds: fact.deploymentIds,
    },
  });

  const okBody = {
    ok: true,
    wedge: "no-cite-no-coin",
    payment: demoAccept ? "demo-only-not-for-judges" : "blocky402-settled",
    receipt,
    settlement,
    audit,
    comparison: compareSnapshots(fact),
    fact,
    explorers: explorerBundle({
      payee: PAYEE,
      topicId: process.env.HCS_TOPIC_ID,
      settlementTx: settleTx,
    }),
  };
  if (idemKey) idempotencyCache.set(idemKey, { at: Date.now(), body: okBody, status: 200 });
  return c.json(okBody);
}

app.post("/v1/facts/yield/rederive", async (c) => {
  const body = (await c.req.json()) as { cite?: CitedFact };
  if (!body.cite) return c.json({ error: "cite required" }, 400);
  const endpoints = yieldEndpoints();
  try {
    const again = await composeYieldFact({
      endpoints,
      apiKey: process.env.GRAPH_API_KEY,
    });
    const match =
      again.queryHash === body.cite.queryHash &&
      again.deploymentIds.slice().sort().join() === body.cite.deploymentIds.slice().sort().join();

    await submitHcsAudit({
      at: new Date().toISOString(),
      kind: "rederive",
      payload: { match, originalHash: body.cite.queryHash, againHash: again.queryHash },
    });

    return c.json({
      match,
      again,
      original: body.cite,
      verdict: match ? "cite-stands" : "no-cite-no-coin",
    });
  } catch (err) {
    return c.json({ error: String(err) }, 502);
  }
});

log.info("boot", { port: PORT, facilitator: FACILITATOR_URL, network: NETWORK });
serve({ fetch: app.fetch, port: PORT });
