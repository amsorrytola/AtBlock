import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";

export function GraphPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">The Graph</p>
        <h1>Messari yield composition</h1>
        <p className="lede">
          One standardized Messari Yield Aggregator query, fan-out across ≥2 deployments — never
          mocked for judges.
        </p>
      </header>

      <section className="doc-section">
        <h2>Schema</h2>
        <p>
          Composer schema id: <code>messari-yield-aggregator</code>. Query shape lives in{" "}
          <code>packages/composer</code> and is served (without a live Graph call) at{" "}
          <code>GET /v1/schema/yield</code>.
        </p>
        <ul className="doc-list">
          <li>
            <code>protocols</code> — TVL / versions / network
          </li>
          <li>
            <code>vaults</code> — top vaults by TVL (ERC-4626 family, not lending)
          </li>
          <li>
            <code>_meta.block</code> + deployment — pin for re-derive
          </li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Multi-deployment</h2>
        <p>
          Endpoints are built from Studio subgraph IDs + <code>GRAPH_API_KEY</code>. Composition
          requires <strong>≥2</strong> live deployments. Missing key or endpoints → fail closed (
          <code>503</code>), no synthetic rows.
        </p>
        <div className="math-block">
          <p className="math-line">
            <span className="math">
              Fact = Compose(Q, endpoint₁ … endpointₙ) → snapshots[] + queryHash
            </span>
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>Agent surface</h2>
        <ul className="doc-list">
          <li>
            <code>SKILL.md</code> — how agents should call the gateway
          </li>
          <li>
            <code>GET /v1/directory</code> — discovery + metering hint
          </li>
          <li>
            <code>npm run probe:graph -w @atblock/gateway</code> — live fan-out probe
          </li>
        </ul>
      </section>

      <p className="doc-next">
        Next: <Link to="/docs/ens">ENS</Link> · <Link to="/docs/cite-math">Cite math</Link>
      </p>
    </div>
  );
}
