import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";
import { MeterCalculator } from "../components/MeterCalculator";

export function PaymentsPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">Payments</p>
        <h1>x402 Exact on Hedera</h1>
        <p className="lede">
          Unpaid facts challenge with Exact requirements; Blocky402 verifies and settles on
          testnet. Metering is price × protocol count in tinybar.
        </p>
      </header>

      <section className="doc-section">
        <h2>x402 Exact</h2>
        <ul className="doc-list">
          <li>
            Scheme <code>exact</code>, network <code>hedera:testnet</code>.
          </li>
          <li>
            Unpaid <code>GET/POST /v1/facts/yield</code> → <strong>HTTP 402</strong> with{" "}
            <code>accepts[]</code>.
          </li>
          <li>
            Paid retry sends signed payload in <code>X-PAYMENT</code>.
          </li>
          <li>
            Judge path: <code>npm run pay -w @atblock/gateway</code> — not the demo header.
          </li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Blocky402</h2>
        <p>
          Facilitator: <code>https://api.testnet.blocky402.com</code>. Gateway calls verify then
          settle; readiness is exposed on <code>/v1/health</code> (
          <code>facilitatorOk</code>, <code>payeeConfigured</code>, <code>feePayer</code>).
        </p>
      </section>

      <section className="doc-section">
        <h2>Tinybar metering</h2>
        <div className="math-block">
          <p className="math-line">
            <span className="math">
              maxAmountRequired = priceTinybarPerProtocol × max(N, 1)
            </span>
          </p>
          <p className="muted small">
            Default <code>PRICE_TINYBAR_PER_PROTOCOL</code> is <code>100000000</code> (1 HBAR) when
            unset. <span className="math">N</span> is the number of Graph deployments compared.
          </p>
        </div>
        <MeterCalculator />
      </section>

      <section className="doc-section">
        <h2>Idempotency-Key</h2>
        <p>
          Optional header <code>Idempotency-Key</code> (also <code>idempotency-key</code>). The
          gateway caches paid responses for the process lifetime so agents can safely retry after
          settle without double-charging the fact path.
        </p>
      </section>

      <p className="doc-next">
        Next: <Link to="/docs/graph">The Graph</Link> · <Link to="/docs/api">API</Link>
      </p>
    </div>
  );
}
