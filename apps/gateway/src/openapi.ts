/** OpenAPI 3.1 surface for agent clients and judges — no secrets. */

export function buildOpenApiDocument(serviceBase: string) {
  const base = serviceBase.replace(/\/$/, "");
  return {
    openapi: "3.1.0",
    info: {
      title: "AtBlock Fact Gateway",
      version: "0.4.0",
      summary: "No cite, no coin — metered Messari yield facts on Hedera x402",
      description:
        "Unpaid requests receive HTTP 402 Exact (Hedera). After Blocky402 verify+settle, the gateway composes Messari Yield Aggregator snapshots across ≥2 Graph deployments and returns a cite that must re-derive.",
      license: { name: "MIT" },
    },
    servers: [{ url: base }],
    tags: [
      { name: "discovery" },
      { name: "health" },
      { name: "payments" },
      { name: "facts" },
      { name: "ens" },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["health"],
          summary: "Liveness + configuration probe",
          responses: { "200": { description: "Always 200 with checks object" } },
        },
      },
      "/v1/health": {
        get: {
          tags: ["health"],
          summary: "Readiness (503 until live path configured)",
          responses: {
            "200": { description: "Live-ready" },
            "503": { description: "Missing payee / Graph / facilitator" },
          },
        },
      },
      "/v1/directory": {
        get: {
          tags: ["discovery"],
          summary: "Agent discovery directory",
          responses: { "200": { description: "Service catalog" } },
        },
      },
      "/v1/identity": {
        get: {
          tags: ["discovery"],
          summary: "HCS-14-inspired identity card",
          responses: { "200": { description: "Identity card JSON" } },
        },
      },
      "/.well-known/agent.json": {
        get: {
          tags: ["discovery"],
          summary: "RFC 8615-style agent well-known",
          responses: { "200": { description: "Agent descriptor" } },
        },
      },
      "/v1/openapi.json": {
        get: {
          tags: ["discovery"],
          summary: "This OpenAPI document",
          responses: { "200": { description: "OpenAPI 3.1" } },
        },
      },
      "/v1/schema/yield": {
        get: {
          tags: ["facts"],
          summary: "Messari yield query schema (no live Graph call)",
          responses: { "200": { description: "YIELD_QUERY + recommended IDs" } },
        },
      },
      "/v1/facts/yield": {
        get: {
          tags: ["facts", "payments"],
          summary: "Metered yield fact (402 without X-PAYMENT)",
          parameters: [
            {
              name: "X-PAYMENT",
              in: "header",
              required: false,
              schema: { type: "string" },
              description: "Signed @x402/hedera payload after 402 challenge",
            },
            {
              name: "Idempotency-Key",
              in: "header",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Cited fact + receipt" },
            "402": { description: "Payment required (Exact / Hedera)" },
            "503": { description: "Graph not configured (fail closed)" },
          },
        },
        post: {
          tags: ["facts", "payments"],
          summary: "Same as GET — agent-friendly POST",
          responses: {
            "200": { description: "Cited fact + receipt" },
            "402": { description: "Payment required" },
          },
        },
      },
      "/v1/facts/yield/rederive": {
        post: {
          tags: ["facts"],
          summary: "Re-query Graph at cite block; must match or no-cite-no-coin",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { cite: { type: "object" } },
                  required: ["cite"],
                },
              },
            },
          },
          responses: {
            "200": { description: "match / mismatch verdict" },
          },
        },
      },
      "/v1/ens/status": {
        get: {
          tags: ["ens"],
          summary: "ENSv2 Sepolia pin + optional EAC roles",
          responses: { "200": { description: "Pin status" } },
        },
      },
      "/v1/payments/schedule": {
        get: {
          tags: ["payments"],
          summary: "Metering / schedule stretch documentation",
          responses: { "200": { description: "Schedule story JSON" } },
        },
      },
      "/v1/metrics": {
        get: {
          tags: ["health"],
          summary: "In-process request counters (demo ops)",
          responses: { "200": { description: "Counters" } },
        },
      },
    },
    components: {
      securitySchemes: {
        x402: {
          type: "apiKey",
          in: "header",
          name: "X-PAYMENT",
          description: "x402 Exact payment payload for Hedera via Blocky402",
        },
      },
    },
  };
}
