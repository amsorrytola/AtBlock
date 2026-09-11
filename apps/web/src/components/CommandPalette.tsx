import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const COMMANDS = [
  { id: "home", label: "Home", path: "/", hint: "Landing" },
  { id: "console", label: "Console", path: "/console", hint: "Pin → Pay → Prove" },
  { id: "lab", label: "Protocol lab", path: "/lab", hint: "Simulators" },
  { id: "docs", label: "Docs index", path: "/docs", hint: "All guides" },
  { id: "cite", label: "Cite math", path: "/docs/cite-math", hint: "queryHash · re-derive" },
  { id: "pay", label: "Payments", path: "/docs/payments", hint: "x402 · metering" },
  { id: "arch", label: "Architecture", path: "/docs/architecture", hint: "Layers" },
  { id: "api", label: "API catalog", path: "/docs/api", hint: "OpenAPI paths" },
  { id: "graph", label: "Graph", path: "/docs/graph", hint: "Messari yield" },
  { id: "ens", label: "ENS", path: "/docs/ens", hint: "Pin · EAC" },
  { id: "sec", label: "Security", path: "/docs/security", hint: "Fail-closed" },
  { id: "qualify", label: "Qualify checklist", path: "/qualify", hint: "Judge ticks" },
  { id: "metrics", label: "Metrics", path: "/metrics", hint: "Live ops" },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(needle) ||
        c.hint.toLowerCase().includes(needle) ||
        c.path.toLowerCase().includes(needle),
    );
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQ("");
        setActive(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [q]);

  if (!open) {
    return (
      <button type="button" className="cmd-hint" onClick={() => setOpen(true)} title="Command palette">
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    );
  }

  function go(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <div
      className="cmd-backdrop"
      role="presentation"
      onClick={() => setOpen(false)}
      onKeyDown={() => undefined}
    >
      <div
        className="cmd-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && filtered[active]) {
            e.preventDefault();
            go(filtered[active].path);
          }
        }}
      >
        <input
          autoFocus
          className="cmd-input"
          placeholder="Jump to page…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter commands"
        />
        <ul className="cmd-list">
          {filtered.length === 0 && <li className="cmd-empty">No matches</li>}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={`cmd-item ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(c.path)}
              >
                <span>{c.label}</span>
                <span className="cmd-meta">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
