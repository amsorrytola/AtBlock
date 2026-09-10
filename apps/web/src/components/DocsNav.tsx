import { NavLink } from "react-router-dom";

const items = [
  { to: "/docs", label: "Index", end: true },
  { to: "/docs/architecture", label: "Architecture" },
  { to: "/docs/cite-math", label: "Cite math" },
  { to: "/docs/payments", label: "Payments" },
  { to: "/docs/graph", label: "Graph" },
  { to: "/docs/ens", label: "ENS" },
  { to: "/docs/api", label: "API" },
  { to: "/docs/security", label: "Security" },
];

export function DocsNav() {
  return (
    <nav className="docs-nav" aria-label="Docs">
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.end}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
}
