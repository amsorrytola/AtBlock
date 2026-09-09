import { useEffect, useState } from "react";

const GATEWAY = import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:8787";

type Health = {
  ok?: boolean;
  facilitatorOk?: boolean;
  payeeConfigured?: boolean;
  graphReady?: boolean;
  graphEndpoints?: number;
  ensConfigured?: boolean;
  hcsTopicConfigured?: boolean;
  demoAcceptEnabled?: boolean;
  feePayer?: string | null;
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

type Step = "pin" | "pay" | "prove";

export function App() {
  const [step, setStep] = useState<Step>("pin");
  const [log, setLog] = useState("Console ready. Walk Pin → Pay → Prove for the demo.");
  const [status, setStatus] = useState<"idle" | "ok" | "warn" | "bad">("idle");
  const [cite, setCite] = useState<unknown>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [comparison, setComparison] = useState<FactResponse["comparison"]>(undefined);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [ens, setEns] = useState<EnsStatus | null>(null);
  const [directory, setDirectory] = useState<Directory | null>(null);
  const [explorers, setExplorers] = useState<Record<string, string | undefined>>({});
  const [graphBlockedReason, setGraphBlockedReason] = useState<string | null>(null);

  async function refreshPinSurface() {
    setBusy(true);
    try {
      const [hRes, eRes, dRes, iRes] = await Promise.all([
        fetch(`${GATEWAY}/health`),
        fetch(`${GATEWAY}/v1/ens/status`),
        fetch(`${GATEWAY}/v1/directory`),
        fetch(`${GATEWAY}/v1/identity`),
      ]);
      const h = (await hRes.json()) as Health;
      const e = (await eRes.json()) as EnsStatus;
      const d = (await dRes.json()) as Directory;
      const identity = await iRes.json();
      setHealth(h);
      setEns(e);
      setDirectory(d);
      setExplorers({ ...(h.explorers ?? {}), ...(d.explorers ?? {}) });
      setGraphBlockedReason(
        h.graphReady
          ? null
          : "Graph not live — set GRAPH_API_KEY + ≥2 Messari yield IDs. Fail closed (no mocks).",
      );
      const readyBits = [
        h.facilitatorOk ? "facilitator" : "facilitator?",
        h.payeeConfigured ? "payee" : "payee?",
        h.graphReady ? "graph" : "graph?",
        e.configured && e.address ? "ens" : "ens?",
        h.hcsTopicConfigured ? "hcs" : "hcs?",
      ].join(" · ");
      setStatus(h.facilitatorOk && h.payeeConfigured ? "ok" : "warn");
      setLog(
        `Pin surface\n${readyBits}\n\n${JSON.stringify({ health: h, ens: e, directory: d, identity }, null, 2)}`,
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
      const res = await fetch(`${GATEWAY}/v1/facts/yield`);
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
      const res = await fetch(`${GATEWAY}/v1/facts/yield`, {
        headers: { "X-PAYMENT": "demo" },
      });
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
        `Paid path\nNOTE: demo header is wiring only — judges need npm run pay\n${JSON.stringify(body, null, 2)}`,
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
      const res = await fetch(`${GATEWAY}/v1/facts/yield/rederive`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cite }),
      });
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

  const chip = (ok: boolean | undefined, label: string) => (
    <span className={`chip ${ok ? "on" : "off"}`}>{label}</span>
  );

  return (
    <main>
      <header className="brand">
        <p className="wordmark">AtBlock</p>
        <p className="tag">ETHOnline 2026 · Graph · Hedera · ENS</p>
      </header>

      <h1>No cite, no coin.</h1>
      <p className="lede">
        Metered Messari yield facts. Hedera x402 settle via Blocky402. Cite must
        re-derive from The Graph at the pinned block.
      </p>

      <div className="rail" aria-label="demo steps">
        {(
          [
            ["pin", "01 Pin", "ENS + readiness"],
            ["pay", "02 Pay", "402 → Blocky402"],
            ["prove", "03 Prove", "Re-derive cite"],
          ] as const
        ).map(([id, title, sub]) => (
          <button
            key={id}
            type="button"
            className={`rail-step ${step === id ? "active" : ""}`}
            onClick={() => setStep(id)}
          >
            <strong>{title}</strong>
            <span>{sub}</span>
          </button>
        ))}
      </div>

      <div className="chips">
        {chip(health?.facilitatorOk, "Blocky402")}
        {chip(health?.payeeConfigured, "Payee")}
        {chip(health?.graphReady, `Graph×${health?.graphEndpoints ?? 0}`)}
        {chip(Boolean(ens?.configured && ens?.address), "ENS")}
        {chip(ens?.roles?.hasRoles, "EAC roles")}
        {chip(health?.hcsTopicConfigured, "HCS")}
        {chip(health?.demoAcceptEnabled, "Demo pay")}
      </div>

      {graphBlockedReason && <p className="fail-closed">{graphBlockedReason}</p>}

      <div className="actions">
        <button className="secondary" disabled={busy} onClick={refreshPinSurface}>
          Refresh pin
        </button>
        <button disabled={busy} onClick={askUnpaid}>
          Ask unpaid (402)
        </button>
        <button className="secondary" disabled={busy} onClick={payDemo}>
          Pay demo header
        </button>
        <button className="secondary" disabled={busy || !cite} onClick={rederive}>
          Re-derive
        </button>
      </div>

      {receipt && (
        <section className="receipt" aria-label="payment receipt">
          <strong>Receipt</strong>
          <ul>
            <li>status: {receipt.status}</li>
            <li>
              amount: {receipt.amountRequired} tinybar · {receipt.protocolCount} protocols (
              {receipt.metering})
            </li>
            {receipt.settleTx && <li>settleTx: {receipt.settleTx}</li>}
            {receipt.warning && <li className="warn-line">{receipt.warning}</li>}
          </ul>
        </section>
      )}

      {comparison && comparison.length > 0 && (
        <section className="board" aria-label="yield comparison">
          <strong>Cite board</strong>
          <ul>
            {comparison.map((row) => (
              <li key={`${row.protocol}-${row.network}`}>
                {row.protocol}
                {row.network ? ` · ${row.network}` : ""} — TVL ${row.tvlUSD}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(explorers.payee || explorers.topic || explorers.settlement) && (
        <p className="explorers">
          HashScan:{" "}
          {explorers.payee && (
            <a href={explorers.payee} target="_blank" rel="noreferrer">
              payee
            </a>
          )}
          {explorers.topic && (
            <>
              {" · "}
              <a href={explorers.topic} target="_blank" rel="noreferrer">
                HCS topic
              </a>
            </>
          )}
          {explorers.settlement && (
            <>
              {" · "}
              <a href={explorers.settlement} target="_blank" rel="noreferrer">
                settlement
              </a>
            </>
          )}
        </p>
      )}

      {directory?.payment?.indicativeMaxAmountRequired && (
        <p className="meter">
          Meter hint: {directory.payment.indicativeMaxAmountRequired} tinybar for{" "}
          {directory.payment.protocolCount ?? "?"} protocols (price × count)
        </p>
      )}

      <div className={`status ${status === "idle" ? "" : status}`}>
        {GATEWAY}
        {ens?.name ? ` · ${ens.name}` : ""}
        {health?.feePayer ? ` · feePayer ${health.feePayer}` : ""}
      </div>
      <pre>{log}</pre>

      <p className="foot">
        <a href="/qualify.html" target="_blank" rel="noreferrer">
          Judge qualify checklist
        </a>
        {" · "}
        <a href={`${GATEWAY}/.well-known/agent.json`} target="_blank" rel="noreferrer">
          agent.json
        </a>
        {" · "}
        <a href={`${GATEWAY}/v1/schema/yield`} target="_blank" rel="noreferrer">
          yield schema
        </a>
        {" · "}
        Check-in #2 due ~09:29 IST Sep 11 · Final submit Sun Sep 13 12:00pm EDT
      </p>
    </main>
  );
}
