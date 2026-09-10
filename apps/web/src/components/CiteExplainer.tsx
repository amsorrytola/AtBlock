import { useMemo, useState } from "react";
import { hashQuery } from "../lib/gateway";

const DEFAULT_QUERY = `query AtBlockVaultBoard {
  protocols(first: 1) { id name totalValueLockedUSD }
  vaults(first: 8) { id symbol totalValueLockedUSD }
  _meta { block { number } deployment }
}`;

export function CiteExplainer() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [block, setBlock] = useState(22_451_002);
  const [deployment, setDeployment] = useState("QmYieldEthDemo");
  const [tamper, setTamper] = useState(false);

  const queryHash = useMemo(() => hashQuery(query.trim()), [query]);
  const rederivedHash = useMemo(() => {
    const base = query.trim();
    const text = tamper ? `${base}\n# tampered` : base;
    return hashQuery(text);
  }, [query, tamper]);

  const match = queryHash === rederivedHash;

  return (
    <div className="cite-explainer">
      <label>
        <span>Standardized yield query</span>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={7} spellCheck={false} />
      </label>
      <div className="cite-meta">
        <label>
          <span>Pinned block</span>
          <input
            type="number"
            value={block}
            onChange={(e) => setBlock(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          <span>Deployment id</span>
          <input value={deployment} onChange={(e) => setDeployment(e.target.value)} />
        </label>
      </div>
      <div className="cite-hashes">
        <div>
          <span className="muted small">queryHash</span>
          <code className="mono">{queryHash}</code>
        </div>
        <div>
          <span className="muted small">re-derive hash</span>
          <code className={`mono ${match ? "ok-text" : "warn-text"}`}>{rederivedHash}</code>
        </div>
      </div>
      <label className="cite-tamper">
        <input type="checkbox" checked={tamper} onChange={(e) => setTamper(e.target.checked)} />
        <span>Simulate query drift (mismatch → no coin)</span>
      </label>
      <p className={`cite-verdict ${match ? "ok" : "bad"}`} aria-live="polite">
        {match
          ? `Cite stands · block ${block} · ${deployment}`
          : "Mismatch — no cite, no coin"}
      </p>
    </div>
  );
}
