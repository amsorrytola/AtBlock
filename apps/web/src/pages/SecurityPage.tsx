import { Link } from "react-router-dom";
import { DocsNav } from "../components/DocsNav";

export function SecurityPage() {
  return (
    <div className="docs-page">
      <DocsNav />
      <header className="page-intro">
        <p className="eyebrow">Security</p>
        <h1>Fail closed, no demo coin</h1>
        <p className="lede">
          Judges must see real Graph data and real Blocky402 settlement — never mocks or UI-only
          payment shortcuts.
        </p>
      </header>

      <section className="doc-section">
        <h2>Fail-closed Graph</h2>
        <ul className="doc-list">
          <li>
            Without <code>GRAPH_API_KEY</code> and ≥2 Messari yield deployment IDs, paid facts return
            errors / <code>503</code> — no synthetic TVL.
          </li>
          <li>Console banners when <code>graphReady</code> is false.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Demo header warning</h2>
        <p>
          The console <strong>Pay demo header</strong> sends <code>X-PAYMENT: demo</code> only to
          wire the UI when <code>demoAcceptEnabled</code> is on. It does{" "}
          <strong>not</strong> count for qualification.
        </p>
        <p className="banner warn">
          Judges must run <code>npm run pay -w @atblock/gateway</code> against Blocky402.
        </p>
      </section>

      <section className="doc-section">
        <h2>Secrets</h2>
        <ul className="doc-list">
          <li>
            <code>.env</code> is gitignored; gateway CLIs load via <code>load-env.ts</code>.
          </li>
          <li>Never commit API keys, private keys, or payee secrets.</li>
          <li>
            OpenAPI / directory / schema endpoints expose no secrets — only configuration status.
          </li>
        </ul>
      </section>

      <p className="doc-next">
        Back: <Link to="/docs">Docs index</Link> · <Link to="/qualify">Qualify checklist</Link>
      </p>
    </div>
  );
}
