import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/console", label: "Console" },
  { to: "/lab", label: "Lab" },
  { to: "/docs", label: "Docs" },
  { to: "/qualify", label: "Qualify" },
  { to: "/metrics", label: "Metrics" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <NavLink to="/" className="site-brand" end onClick={() => setOpen(false)}>
        <img src="/brand/logo.png" alt="" width={36} height={36} />
        <span>AtBlock</span>
      </NavLink>
      <div className="header-tools">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <nav id="site-nav" className={`site-nav ${open ? "open" : ""}`} aria-label="Primary">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>AtBlock</strong>
        <p>No cite, no coin — Graph · Hedera · ENS</p>
      </div>
      <div className="site-footer-links">
        <a href="https://github.com/amsorrytola/AtBlock" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <NavLink to="/docs/architecture">Architecture</NavLink>
        <NavLink to="/docs/security">Security</NavLink>
        <NavLink to="/docs/payments">Payments</NavLink>
        <NavLink to="/docs/api">API</NavLink>
      </div>
    </footer>
  );
}
