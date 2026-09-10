import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";
import { CiteExplainer } from "../components/CiteExplainer";

export function CiteMathPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">Cite math</p>
        <h1>No cite, no coin</h1>
        <p className="lede">
          Payment settles a claim only if the Graph answer can be re-derived at the cited block with
          the same standardized query.
        </p>
      </header>

      <section className="doc-section">
        <h2>Definitions</h2>
        <div className="math-block">
          <p>
            Let <span className="math">Q</span> be the Messari yield query string (normalized).
          </p>
          <p className="math-line">
            <span className="math">queryHash(Q) = q‖H₃₁(Q)</span>
          </p>
          <p className="muted small">
            <span className="math">H₃₁</span> is the Java-style 31-imul rolling hash used in{" "}
            <code>packages/composer</code> (unsigned hex, prefixed with <code>q</code>).
          </p>
          <p>
            A cite is the tuple{" "}
            <span className="math">
              C = (blockNumber, deploymentIds[], queryHash, snapshots)
            </span>
            .
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>Block pinning</h2>
        <p>
          Each Graph response carries <code>_meta.block.number</code>. The composer pins a single
          <span className="math"> b </span>
          (and the set of deployment IDs) so a buyer can ask the same subgraphs at that height.
        </p>
        <div className="math-block">
          <p className="math-line">
            <span className="math">pin(C) = (b, D)</span> where{" "}
            <span className="math">D = deploymentIds</span>
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>Re-derive equality</h2>
        <div className="math-block">
          <p>
            Re-query yields <span className="math">C′</span>. The cite stands iff:
          </p>
          <p className="math-line">
            <span className="math">
              queryHash(Q) = queryHash(Q′) ∧ b = b′ ∧ D = D′ ∧ snapshots ≡ snapshots′
            </span>
          </p>
          <p className="muted small">
            Gateway exposes this as <code>POST /v1/facts/yield/rederive</code> →{" "}
            <code>match</code> / verdict.
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>Formal rule</h2>
        <div className="math-block formal">
          <p className="math-line">
            <span className="math">Settle(payment) ⇒ ReDerive(C) = true</span>
          </p>
          <p>
            Equivalently: if re-derive fails, the economic claim is void —{" "}
            <strong>no cite, no coin</strong>.
          </p>
        </div>
      </section>

      <section className="doc-section">
        <h2>Interactive hash</h2>
        <CiteExplainer />
      </section>

      <p className="doc-next">
        Next: <Link to="/docs/payments">Payments</Link> · <Link to="/lab">Protocol lab</Link>
      </p>
    </div>
  );
}
