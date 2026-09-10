import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";

export function EnsPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">ENS</p>
        <h1>ENSv2 pin + EAC</h1>
        <p className="lede">
          Agent namespaces on Sepolia: pin status in the console, grant spend roles, revoke when the
          human owner says stop.
        </p>
      </header>

      <section className="doc-section">
        <h2>Pin</h2>
        <p>
          <code>GET /v1/ens/status</code> reports configured name, address, resolver, network, and
          optional EAC role bitmap. Console Pin stage surfaces these as readiness signals.
        </p>
        <p className="muted small">
          CLI: <code>npm run pin-demo -w @atblock/ens</code>
        </p>
      </section>

      <section className="doc-section">
        <h2>Grant / revoke</h2>
        <ul className="doc-list">
          <li>
            <code>grant-demo</code> — Enhanced Access Control roles for the buyer agent (spend, not
            transfer).
          </li>
          <li>
            <code>revoke-demo</code> — human owner revokes; central to the camera story.
          </li>
        </ul>
        <p>
          Roles are load-bearing for the ENS track: identity is not a hardcoded string — permissions
          can change between Pin and Pay.
        </p>
      </section>

      <p className="doc-next">
        Next: <Link to="/docs/api">API</Link> · <Link to="/console">Console</Link>
      </p>
    </div>
  );
}
