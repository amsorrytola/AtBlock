import { useEffect, useEffectEvent, useState } from "react";
import { Link } from "react-router-dom";
import { GATEWAY, gatewayFetch } from "../lib/gateway";
import { Panel, Signal } from "../components/Panel";

type Health = {
  ok?: boolean;
  ready?: boolean;
  facilitatorOk?: boolean;
  payeeConfigured?: boolean;
  graphReady?: boolean;
  graphEndpoints?: number;
  ensConfigured?: boolean;
  hcsTopicConfigured?: boolean;
  demoAcceptEnabled?: boolean;
  feePayer?: string | null;
  checks?: {
    facilitatorOk?: boolean;
    payeeConfigured?: boolean;
    graphReady?: boolean;
    hcsTopicConfigured?: boolean;
    ensConfigured?: boolean;
  };
  explorers?: Record<string, string | undefined>;
};

type EnsStatus = {
  configured?: boolean;
  name?: string;
  address?: string | null;
  resolver?: string | null;
  network?: string;
  ensv2?: boolean;
  hint?: string;
  error?: string;
  roles?: { hasRoles: boolean; resource: string; roleBitmap: string } | null;
};

type Directory = {
  name?: string;
  wedge?: string;
  version?: string;
  payment?: { indicativeMaxAmountRequired?: string | null; protocolCount?: number };
  explorers?: Record<string, string | undefined>;
  endpoints?: Record<string, string>;
};

type Receipt = {
  status?: string;
  network?: string;
  amountRequired?: string;
  protocolCount?: number;
  metering?: string;
  settleTx?: string;
  warning?: string;
  assetKind?: string;
};

type FactResponse = {
  ok?: boolean;
  payment?: string;
  fact?: unknown;
  error?: string;
  hint?: string;
  accepts?: unknown;
  explorers?: Record<string, string | undefined>;
  comparison?: { protocol: string; tvlUSD: string; network: string | null }[];
  audit?: unknown;
  receipt?: Receipt;
};

type AgentCard = {
  name?: string;
  description?: string;
  version?: string;
  payment?: { protocol?: string; scheme?: string; network?: string; facilitator?: string };
};

type SchemaDoc = {
  schema?: string;
  query?: string;
  recommendedSubgraphIds?: string[];
  note?: string;
};

type Metrics = {
  requests?: number;
  paymentChallenges?: number;
  paidFacts?: number;
  rederiveMatch?: number;
  uptimeSeconds?: number;
};

type Telemetry = {
  path: string;
  status: number;
  ms: number;
  requestId: string | null;
};

type Step = "pin" | "pay" | "prove";

export function ConsolePage() {
  const [step, setStep] = useState<Step>("pin");
  const [log, setLog] = useState("Console online. Walk Pin → Pay → Prove.");
  const [status, setStatus] = useState<"idle" | "ok" | "warn" | "bad">("idle");
  const [cite, setCite] = useState<unknown>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [comparison, setComparison] = useState<FactResponse["comparison"]>(undefined);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [ens, setEns] = useState<EnsStatus | null>(null);
  const [directory, setDirectory] = useState<Directory | null>(null);
  const [agent, setAgent] = useState<AgentCard | null>(null);
  const [schema, setSchema] = useState<SchemaDoc | null>(null);
  const [explorers, setExplorers] = useState<Record<string, string | undefined>>({});
  const [graphBlockedReason, setGraphBlockedReason] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const track = useEffectEvent((path: string, statusCode: number, ms: number, requestId: string | null) => {
    setTelemetry({ path, status: statusCode, ms, requestId });
  });

  async function refreshPinSurface() {
    setBusy(true);
    try {
      const [hPack, ePack, dPack, iPack, aPack, sPack, mPack] = await Promise.all([
        gatewayFetch("/v1/health"),
        gatewayFetch("/v1/ens/status"),
        gatewayFetch("/v1/directory"),
        gatewayFetch("/v1/identity"),
        gatewayFetch("/.well-known/agent.json"),
        gatewayFetch("/v1/schema/yield"),
        gatewayFetch("/v1/metrics"),
      ]);

      const h = (await hPack.res.json()) as Health;
      const e = (await ePack.res.json()) as EnsStatus;
      const d = (await dPack.res.json()) as Directory;
      const identity = await iPack.res.json();
      const agentJson = (await aPack.res.json()) as AgentCard;
      const schemaJson = (await sPack.res.json()) as SchemaDoc;
      const metricsJson = (await mPack.res.json()) as Metrics;

      track("/v1/health", hPack.res.status, hPack.ms, hPack.requestId);
      setHealth(h);
      setEns(e);
      setDirectory(d);
      setAgent(agentJson);
      setSchema(schemaJson);
      setMetrics(metricsJson);
      setExplorers({ ...(h.explorers ?? {}), ...(d.explorers ?? {}) });

      const graphReady = h.checks?.graphReady ?? h.graphReady;
      setGraphBlockedReason(
        graphReady
          ? null
          : "Graph not live — set GRAPH_API_KEY + ≥2 Messari yield IDs. Fail closed (no mocks).",
      );

      const facilitatorOk = h.checks?.facilitatorOk ?? h.facilitatorOk;
      const payeeConfigured = h.checks?.payeeConfigured ?? h.payeeConfigured;
      setStatus(facilitatorOk && payeeConfigured ? "ok" : "warn");
      setLog(
        `Pin surface ready\n${JSON.stringify({ health: h, ens: e, directory: d, identity }, null, 2)}`,
      );
      setStep("pin");
    } catch (err) {
      setStatus("bad");
      setLog(String(err));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refreshPinSurface();
  }, []);

  async function askUnpaid() {
    setBusy(true);
    setStep("pay");
    try {
      const { res, ms, requestId } = await gatewayFetch("/v1/facts/yield");
      track("/v1/facts/yield", res.status, ms, requestId);
      const body = (await res.json()) as FactResponse;
      if (res.status === 402) {
        setStatus("warn");
        setLog(`HTTP 402 Payment Required\n${JSON.stringify(body, null, 2)}`);
      } else {
        setStatus("bad");
        setLog(`Unexpected ${res.status}\n${JSON.stringify(body, null, 2)}`);
      }
    } catch (e) {
      setStatus("bad");
      setLog(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function payDemo() {
    setBusy(true);
    setStep("pay");
    try {
      const { res, ms, requestId } = await gatewayFetch("/v1/facts/yield", {
        headers: { "X-PAYMENT": "demo" },
      });
      track("/v1/facts/yield", res.status, ms, requestId);
      const body = (await res.json()) as FactResponse;
      if (body.receipt) setReceipt(body.receipt);
      if (body.explorers) setExplorers((prev) => ({ ...prev, ...body.explorers }));
      if (body.comparison) setComparison(body.comparison);

      if (!res.ok) {
        setStatus("bad");
        setGraphBlockedReason(body.hint ?? body.error ?? `HTTP ${res.status}`);
        setLog(`${res.status}\n${JSON.stringify(body, null, 2)}`);
        return;
      }
      setCite(body.fact ?? null);
      setGraphBlockedReason(null);
      setStatus(body.payment?.includes("demo") ? "warn" : "ok");
      setLog(
        `Paid path\nNOTE: demo header is UI wiring only — judges run npm run pay\n${JSON.stringify(body, null, 2)}`,
      );
      setStep("prove");
    } catch (e) {
      setStatus("bad");
      setLog(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function rederive() {
    if (!cite) return;
    setBusy(true);
    setStep("prove");
    try {
      const { res, ms, requestId } = await gatewayFetch("/v1/facts/yield/rederive", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cite }),
      });
      track("/v1/facts/yield/rederive", res.status, ms, requestId);
      const body = await res.json();
      setStatus(body.match ? "ok" : "bad");
      setLog(`Re-derive · verdict=${body.verdict ?? "?"}\n${JSON.stringify(body, null, 2)}`);
    } catch (e) {
      setStatus("bad");
      setLog(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function copyJson(label: string, value: unknown) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied("failed");
    }
  }

  const facilitatorOk = health?.checks?.facilitatorOk ?? health?.facilitatorOk;
  const payeeConfigured = health?.checks?.payeeConfigured ?? health?.payeeConfigured;
  const graphReady = health?.checks?.graphReady ?? health?.graphReady;
  const hcsOk = health?.checks?.hcsTopicConfigured ?? health?.hcsTopicConfigured;
  const stepIndex = step === "pin" ? 0 : step === "pay" ? 1 : 2;

  return (
    <div className="console">
      <header className="page-intro">
        <p className="eyebrow">Live console</p>
        <h1>Pin → Pay → Prove</h1>
        <p className="lede">
          Metered Messari yield facts settle on Hedera x402. The Graph cite must re-derive at the
          pinned block — or payment is worthless.
        </p>
        <div className="hero-cta">
          <button type="button" disabled={busy} onClick={refreshPinSurface}>
            Begin Pin → Pay → Prove
          </button>
          <Link className="ghost-link" to="/qualify">
            Judge checklist
          </Link>
        </div>
        <p className="partners">The Graph · Hedera · ENS · ETHOnline 2026</p>
      </header>

      <div className="telemetry" aria-live="polite">
        <span className={`pulse ${status}`}>{status}</span>
        <span className="mono">{GATEWAY}</span>
        {telemetry && (
          <>
            <span className="mono">
              {telemetry.path} · {telemetry.status} · {telemetry.ms}ms
            </span>
            {telemetry.requestId && <span className="mono truncate">req {telemetry.requestId}</span>}
          </>
        )}
        {metrics && (
          <span className="mono">
            ops {metrics.requests ?? 0} req · {metrics.paymentChallenges ?? 0}×402 ·{" "}
            {metrics.paidFacts ?? 0} paid
          </span>
        )}
      </div>

      <nav className="stages" aria-label="Demo stages">
        <div className="stage-track" style={{ ["--i" as string]: stepIndex }} />
        {(
          [
            ["pin", "01", "Pin", "ENS + readiness"],
            ["pay", "02", "Pay", "402 → Blocky402"],
            ["prove", "03", "Prove", "Re-derive cite"],
          ] as const
        ).map(([id, num, title, sub]) => (
          <button
            key={id}
            type="button"
            className={`stage ${step === id ? "active" : ""}`}
            onClick={() => setStep(id)}
          >
            <span className="stage-num">{num}</span>
            <strong>{title}</strong>
            <span className="stage-sub">{sub}</span>
          </button>
        ))}
      </nav>

      <div className="signals">
        <Signal on={facilitatorOk} label="Blocky402" />
        <Signal on={payeeConfigured} label="Payee" />
        <Signal on={graphReady} label={`Graph×${health?.graphEndpoints ?? 0}`} />
        <Signal on={Boolean(ens?.configured && ens?.address)} label="ENS" />
        <Signal on={ens?.roles?.hasRoles} label="EAC" />
        <Signal on={hcsOk} label="HCS" />
        <Signal on={health?.demoAcceptEnabled} label="Demo pay" />
      </div>

      {graphBlockedReason && <p className="banner warn">{graphBlockedReason}</p>}

      <div className="actions">
        <button type="button" className="secondary" disabled={busy} onClick={refreshPinSurface}>
          Refresh pin
        </button>
        <button type="button" disabled={busy} onClick={askUnpaid}>
          Ask unpaid (402)
        </button>
        <button type="button" className="secondary" disabled={busy} onClick={payDemo}>
          Pay demo header
        </button>
        <button type="button" className="secondary" disabled={busy || !cite} onClick={rederive}>
          Re-derive
        </button>
      </div>
      <p className="hint">
        Demo header is UI wiring only. Judges: <code>npm run pay -w @atblock/gateway</code>
      </p>

      <div className="workspace">
        <div className="col">
          {receipt && (
            <Panel
              title="Settlement receipt"
              action={
                <button type="button" className="text-btn" onClick={() => void copyJson("receipt", receipt)}>
                  {copied === "receipt" ? "Copied" : "Copy"}
                </button>
              }
            >
              <dl className="kv">
                <div>
                  <dt>Status</dt>
                  <dd>{receipt.status}</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>
                    {receipt.amountRequired} tinybar · {receipt.protocolCount} protocols
                  </dd>
                </div>
                <div>
                  <dt>Metering</dt>
                  <dd>{receipt.metering}</dd>
                </div>
                {receipt.settleTx && (
                  <div>
                    <dt>Settle tx</dt>
                    <dd className="truncate">{receipt.settleTx}</dd>
                  </div>
                )}
                {receipt.warning && (
                  <div>
                    <dt>Warning</dt>
                    <dd className="warn-text">{receipt.warning}</dd>
                  </div>
                )}
              </dl>
            </Panel>
          )}

          {comparison && comparison.length > 0 && (
            <Panel title="Cite board">
              <ul className="board-list">
                {comparison.map((row) => (
                  <li key={`${row.protocol}-${row.network}`}>
                    <span>{row.protocol}</span>
                    <span className="muted">{row.network ?? "—"}</span>
                    <span className="mono">${row.tvlUSD}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Protocol path">
            <ol className="protocol">
              <li>Unpaid yield request returns HTTP 402 Exact on Hedera.</li>
              <li>Buyer settles through Blocky402 verify + settle.</li>
              <li>Gateway composes Messari yield across ≥2 Graph deployments.</li>
              <li>Cite must re-derive at pinned block — or no coin.</li>
            </ol>
          </Panel>
        </div>

        <div className="col">
          {agent && (
            <Panel title="Agent well-known">
              <p className="agent-name">{agent.name}</p>
              <p className="muted small">{agent.description}</p>
              <p className="mono small">
                {agent.payment?.protocol}/{agent.payment?.scheme} · {agent.payment?.network}
              </p>
            </Panel>
          )}

          {schema && (
            <Panel
              title="Yield schema"
              action={
                <button type="button" className="text-btn" onClick={() => void copyJson("schema", schema)}>
                  {copied === "schema" ? "Copied" : "Copy"}
                </button>
              }
            >
              <p className="mono small">{schema.schema}</p>
              <pre className="schema-pre">
                {schema.query?.slice(0, 420)}
                {(schema.query?.length ?? 0) > 420 ? "…" : ""}
              </pre>
            </Panel>
          )}

          {(explorers.payee || explorers.topic || explorers.settlement) && (
            <Panel title="HashScan">
              <div className="links">
                {explorers.payee && (
                  <a href={explorers.payee} target="_blank" rel="noreferrer">
                    Payee account
                  </a>
                )}
                {explorers.topic && (
                  <a href={explorers.topic} target="_blank" rel="noreferrer">
                    HCS topic
                  </a>
                )}
                {explorers.settlement && (
                  <a href={explorers.settlement} target="_blank" rel="noreferrer">
                    Settlement
                  </a>
                )}
              </div>
            </Panel>
          )}

          {directory?.payment?.indicativeMaxAmountRequired && (
            <p className="meter mono">
              Meter hint: {directory.payment.indicativeMaxAmountRequired} tinybar ×{" "}
              {directory.payment.protocolCount ?? "?"} protocols
              {directory.version ? ` · gateway ${directory.version}` : ""}
            </p>
          )}
        </div>
      </div>

      <Panel
        title="Event log"
        action={
          cite ? (
            <button type="button" className="text-btn" onClick={() => void copyJson("cite", cite)}>
              {copied === "cite" ? "Cite copied" : "Copy cite"}
            </button>
          ) : null
        }
      >
        <div className={`status-line ${status === "idle" ? "" : status}`}>
          {ens?.name ? `${ens.name} · ` : ""}
          {health?.feePayer ? `feePayer ${health.feePayer}` : "awaiting facilitator feePayer"}
        </div>
        <pre className="log">{log}</pre>
      </Panel>

      <footer className="foot">
        <a href={`${GATEWAY}/.well-known/agent.json`} target="_blank" rel="noreferrer">
          agent.json
        </a>
        <a href={`${GATEWAY}/v1/openapi.json`} target="_blank" rel="noreferrer">
          openapi
        </a>
        <a href={`${GATEWAY}/v1/schema/yield`} target="_blank" rel="noreferrer">
          yield schema
        </a>
        <Link to="/metrics">metrics</Link>
        <span>Final submit Sun Sep 13 · 12:00pm EDT</span>
      </footer>
    </div>
  );
}
