import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";
import { GATEWAY } from "../lib/gateway";

const endpoints = [
  { method: "GET", path: "/health", summary: "Liveness + configuration probe" },
  { method: "GET", path: "/v1/health", summary: "Readiness (503 until live path configured)" },
  { method: "GET", path: "/v1/directory", summary: "Agent discovery directory" },
  { method: "GET", path: "/v1/identity", summary: "HCS-14-inspired identity card" },
  { method: "GET", path: "/.well-known/agent.json", summary: "RFC 8615-style agent well-known" },
  { method: "GET", path: "/v1/openapi.json", summary: "OpenAPI 3.1 document" },
  { method: "GET", path: "/v1/schema/yield", summary: "Messari yield query schema (no live Graph)" },
  {
    method: "GET/POST",
    path: "/v1/facts/yield",
    summary: "Metered yield fact — 402 without X-PAYMENT; Idempotency-Key optional",
  },
  {
    method: "POST",
    path: "/v1/facts/yield/rederive",
    summary: "Re-query Graph at cite block; match or no-coin",
  },
  { method: "GET", path: "/v1/ens/status", summary: "ENSv2 Sepolia pin + optional EAC roles" },
  { method: "GET", path: "/v1/payments/schedule", summary: "Metering / schedule stretch docs" },
  { method: "GET", path: "/v1/metrics", summary: "In-process request counters" },
];

export function ApiPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">API</p>
        <h1>Endpoint catalog</h1>
        <p className="lede">
          Mirrors gateway OpenAPI paths. Live document:{" "}
          <a href={`${GATEWAY}/v1/openapi.json`} target="_blank" rel="noreferrer">
            {GATEWAY}/v1/openapi.json
          </a>
        </p>
      </header>

      <div className="api-table-wrap">
        <table className="api-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((e) => (
              <tr key={e.path + e.method}>
                <td className="mono">{e.method}</td>
                <td className="mono">{e.path}</td>
                <td>{e.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="doc-next">
        Next: <Link to="/docs/security">Security</Link> · <Link to="/metrics">Live metrics</Link>
      </p>
    </div>
  );
}
