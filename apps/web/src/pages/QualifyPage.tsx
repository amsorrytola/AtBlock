import { useEffect, useState } from "react";

const STORAGE_KEY = "atblock-qualify-v1";

type Section = { id: string; title: string; items: { id: string; label: string; code?: string }[] };

const sections: Section[] = [
  {
    id: "hedera",
    title: "Hedera — Agentic Payments",
    items: [
      { id: "h1", label: "Unpaid GET /v1/facts/yield returns HTTP 402", code: "GET /v1/facts/yield" },
      { id: "h2", label: "npm run pay settles via Blocky402 on hedera:testnet" },
      { id: "h3", label: "Metered: price × protocol count visible in requirements/receipt" },
      { id: "h4", label: "HashScan link for payee / settlement / HCS topic" },
      { id: "h5", label: "GET /v1/directory + /v1/identity discovery" },
      { id: "h6", label: "HCS audit topic message after pay/cite" },
    ],
  },
  {
    id: "graph",
    title: "The Graph — Standardized + AI",
    items: [
      { id: "g1", label: "Live Studio key; ≥2 Messari yield deployments" },
      { id: "g2", label: "One query shape; cite has block + deploymentIds + queryHash" },
      { id: "g3", label: "POST /rederive returns match / cite-stands" },
      { id: "g4", label: "Fail closed if Graph missing (no mock data)" },
      { id: "g5", label: "SKILL.md explains agent usage" },
    ],
  },
  {
    id: "ens",
    title: "ENS — ENSv2",
    items: [
      { id: "e1", label: "Sepolia agent name resolves in Pin / /v1/ens/status" },
      { id: "e2", label: "EAC grant then revoke demo (grant-demo / revoke-demo)" },
      { id: "e3", label: "Roles central to agent spend story on camera" },
    ],
  },
  {
    id: "process",
    title: "Process",
    items: [
      { id: "p1", label: "Check-in #1 + #2 submitted" },
      { id: "p2", label: "Partners selected: Graph, Hedera, ENS only" },
      { id: "p3", label: "Human-narrated 2–4 min ≥720p video (no AI voice)" },
      { id: "p4", label: "Public repo + AI attribution" },
    ],
  },
];

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function QualifyPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(loadChecked());
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setChecked({});
  }

  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const done = sections.reduce((n, s) => n + s.items.filter((i) => checked[i.id]).length, 0);
  const pct = Math.round((done / total) * 100);

  return (
    <div className="docs-page qualify">
      <header className="page-intro">
        <p className="eyebrow">Qualify</p>
        <h1>Judge checklist</h1>
        <p className="lede">
          Tick only what you can show live. Demo header payment does not count. Progress is saved in
          this browser.
        </p>
      </header>

      <div className="qualify-progress" aria-live="polite">
        <div className="qualify-bar" style={{ ["--p" as string]: `${pct}%` }} />
        <span className="mono">
          {done}/{total} · {pct}%
        </span>
        <button type="button" className="text-btn" onClick={reset}>
          Reset
        </button>
      </div>

      {sections.map((s) => (
        <section key={s.id} className="doc-section qualify-section">
          <h2>{s.title}</h2>
          <ul className="qualify-list">
            {s.items.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => toggle(item.id)}
                  />
                  <span>
                    {item.label}
                    {item.code ? (
                      <>
                        {" "}
                        <code>{item.code}</code>
                      </>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="muted small">
        Source: judge qualification checklist · credentials via docs/AtBlock-Credentials-Checklist.pdf
      </p>
    </div>
  );
}
