import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";

export function ArchitecturePage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">Architecture</p>
        <h1>Layered fact gateway</h1>
        <p className="lede">
          Buyer agents hit the gateway over x402; Graph composition and ENS identity sit behind the
          payment gate.
        </p>
      </header>

      <section className="doc-section">
        <h2>Layers</h2>
        <ol className="layer-list">
          <li>
            <strong>Identity</strong> — Human owner + ENSv2 agent names; EAC can revoke spend.
          </li>
          <li>
            <strong>Payment</strong> — HTTP 402 Exact on <code>hedera:testnet</code> via Blocky402.
          </li>
          <li>
            <strong>Composition</strong> — Messari yield query × N Graph deployments + block pin.
          </li>
          <li>
            <strong>Proof</strong> — <code>POST /v1/facts/yield/rederive</code> must match the cite.
          </li>
          <li>
            <strong>Audit</strong> — Optional HCS topic + HashScan explorers on receipts.
          </li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>Happy-path sequence</h2>
        <ol className="protocol numbered">
          <li>Buyer resolves seller ENS / directory and requests <code>/v1/facts/yield</code>.</li>
          <li>Gateway returns <strong>402</strong> with Exact requirements (metered tinybar).</li>
          <li>Buyer settles through Blocky402 verify + settle; retries with <code>X-PAYMENT</code>.</li>
          <li>Gateway fans Messari yield across ≥2 deployments; returns cite + receipt.</li>
          <li>Buyer (or judge) re-derives at pinned block — mismatch voids the economic claim.</li>
        </ol>
        <pre className="schema-pre ascii-diagram">{`Human owner --EAC revoke--> ENSv2 (Sepolia)
Buyer agent --x402--> Gateway (Blocky402 + HCS)
                         |
                    composer (Messari × N)
                         |
                    The Graph Studio`}</pre>
      </section>

      <p className="doc-next">
        Next: <Link to="/docs/cite-math">Cite math</Link> · <Link to="/docs/payments">Payments</Link>
      </p>
    </div>
  );
}
