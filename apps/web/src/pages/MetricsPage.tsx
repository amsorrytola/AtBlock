import { useEffect, useState } from "react";
import { GATEWAY, gatewayFetch } from "../lib/gateway";
import { Panel } from "../components/Panel";

type Metrics = {
  requests?: number;
  paymentChallenges?: number;
  paidFacts?: number;
  rederiveMatch?: number;
  uptimeSeconds?: number;
  [key: string]: unknown;
};

type Health = {
  ok?: boolean;
  ready?: boolean;
  facilitatorOk?: boolean;
  payeeConfigured?: boolean;
  graphReady?: boolean;
  checks?: Record<string, boolean | undefined>;
  [key: string]: unknown;
};

const REFRESH_MS = 5000;

export function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      const [mPack, hPack] = await Promise.all([
        gatewayFetch("/v1/metrics"),
        gatewayFetch("/v1/health"),
      ]);
      if (!mPack.res.ok) throw new Error(`metrics ${mPack.res.status}`);
      if (!hPack.res.ok && hPack.res.status !== 503) throw new Error(`health ${hPack.res.status}`);
      setMetrics((await mPack.res.json()) as Metrics);
      setHealth((await hPack.res.json()) as Health);
      setError(null);
      setUpdatedAt(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const checks = health?.checks ?? {
    facilitatorOk: health?.facilitatorOk,
    payeeConfigured: health?.payeeConfigured,
    graphReady: health?.graphReady,
  };

  return (
    <div className="docs-page metrics-page">
      <header className="page-intro">
        <p className="eyebrow">Ops</p>
        <h1>Live metrics</h1>
        <p className="lede">
          Auto-refresh every {REFRESH_MS / 1000}s from{" "}
          <span className="mono">{GATEWAY}</span>
        </p>
        <div className="hero-cta">
          <button type="button" disabled={busy} onClick={() => void refresh()}>
            Refresh now
          </button>
          {updatedAt && (
            <span className="mono muted small">Updated {updatedAt.toLocaleTimeString()}</span>
          )}
        </div>
      </header>

      {error && <p className="banner warn">{error}</p>}

      <div className="metrics-grid">
        <Panel title="/v1/metrics">
          {metrics ? (
            <dl className="kv metrics-kv">
              {(
                [
                  ["requests", metrics.requests],
                  ["paymentChallenges", metrics.paymentChallenges],
                  ["paidFacts", metrics.paidFacts],
                  ["rederiveMatch", metrics.rederiveMatch],
                  ["uptimeSeconds", metrics.uptimeSeconds],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className="mono">{v ?? "—"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="muted">Awaiting gateway…</p>
          )}
        </Panel>

        <Panel title="/v1/health">
          {health ? (
            <>
              <dl className="kv metrics-kv">
                <div>
                  <dt>ok</dt>
                  <dd className="mono">{String(health.ok ?? "—")}</dd>
                </div>
                <div>
                  <dt>ready</dt>
                  <dd className="mono">{String(health.ready ?? "—")}</dd>
                </div>
              </dl>
              <div className="signals" style={{ marginTop: "0.75rem" }}>
                {Object.entries(checks).map(([k, v]) =>
                  typeof v === "boolean" ? (
                    <span key={k} className={`signal ${v ? "on" : "off"}`}>
                      <span className="signal-dot" aria-hidden />
                      {k}
                    </span>
                  ) : null,
                )}
              </div>
              <pre className="schema-pre" style={{ marginTop: "0.85rem", maxHeight: 280 }}>
                {JSON.stringify(health, null, 2)}
              </pre>
            </>
          ) : (
            <p className="muted">Awaiting gateway…</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
