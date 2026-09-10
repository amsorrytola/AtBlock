import { useState } from "react";

type Phase = "idle" | "unpaid" | "accepts" | "paid";

const FAKE_ACCEPTS = {
  x402Version: 1,
  accepts: [
    {
      scheme: "exact",
      network: "hedera:testnet",
      maxAmountRequired: "200000000",
      resource: "/v1/facts/yield",
      description: "AtBlock metered yield fact (price × protocol count)",
      extra: { metering: "per-protocol", protocolCount: 2 },
    },
  ],
};

export function ChallengeSimulator() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState("Idle — request a yield fact without payment.");

  function askUnpaid() {
    setPhase("unpaid");
    setLog("GET /v1/facts/yield → HTTP 402 Payment Required");
    window.setTimeout(() => {
      setPhase("accepts");
      setLog(`402 body (local sim)\n${JSON.stringify(FAKE_ACCEPTS, null, 2)}`);
    }, 280);
  }

  function acceptPay() {
    setPhase("paid");
    setLog(
      "Client attaches X-PAYMENT after Blocky402 settle → 200 cited fact + receipt\n(Judges: npm run pay -w @atblock/gateway — not the demo header)",
    );
  }

  function reset() {
    setPhase("idle");
    setLog("Idle — request a yield fact without payment.");
  }

  const stepIndex = phase === "idle" || phase === "unpaid" ? 0 : phase === "accepts" ? 1 : 2;

  return (
    <div className="challenge-sim">
      <nav className="stages lab-stages" aria-label="402 stages">
        <div className="stage-track" style={{ ["--i" as string]: stepIndex }} />
        {(
          [
            ["01", "Unpaid", "HTTP 402"],
            ["02", "Accepts", "Exact / Hedera"],
            ["03", "Paid", "Cite + receipt"],
          ] as const
        ).map(([num, title, sub], i) => (
          <div key={num} className={`stage ${stepIndex === i && phase !== "idle" ? "active" : ""}`}>
            <span className="stage-num">{num}</span>
            <strong>{title}</strong>
            <span className="stage-sub">{sub}</span>
          </div>
        ))}
      </nav>
      <div className="actions">
        <button type="button" onClick={askUnpaid}>
          Ask unpaid
        </button>
        <button type="button" className="secondary" disabled={phase !== "accepts"} onClick={acceptPay}>
          Simulate accept
        </button>
        <button type="button" className="secondary" onClick={reset}>
          Reset
        </button>
      </div>
      <pre className="log">{log}</pre>
    </div>
  );
}
