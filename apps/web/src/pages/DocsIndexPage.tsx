import { Link } from "react-router-dom";

const docs = [
  {
    to: "/docs/architecture",
    title: "Architecture",
    blurb: "Layers, sequence, and prize mapping across Graph · Hedera · ENS.",
  },
  {
    to: "/docs/cite-math",
    title: "Cite math",
    blurb: "queryHash, block pinning, re-derive equality, and no-cite-no-coin formally.",
  },
  {
    to: "/docs/payments",
    title: "Payments",
    blurb: "x402 Exact, Blocky402, tinybar metering, Idempotency-Key.",
  },
  {
    to: "/docs/graph",
    title: "The Graph",
    blurb: "Messari yield schema and multi-deployment composition.",
  },
  {
    to: "/docs/ens",
    title: "ENS",
    blurb: "ENSv2 pin surface and EAC grant / revoke.",
  },
  {
    to: "/docs/api",
    title: "API catalog",
    blurb: "Gateway OpenAPI paths agents and judges hit.",
  },
  {
    to: "/docs/security",
    title: "Security",
    blurb: "Fail-closed Graph, demo header warning, secrets hygiene.",
  },
];

export function DocsIndexPage() {
  return (
    <div className="docs-page">
      <header className="page-intro">
        <p className="eyebrow">Documentation</p>
        <h1>AtBlock docs</h1>
        <p className="lede">
          Protocol references for the fact gateway — enough for a judge to follow Pin → Pay → Prove
          without reading the whole monorepo.
        </p>
      </header>
      <ul className="docs-index">
        {docs.map((d) => (
          <li key={d.to}>
            <Link to={d.to}>
              <strong>{d.title}</strong>
              <span>{d.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
