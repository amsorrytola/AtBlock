import { Link } from "react-router-dom";
import { MeterCalculator } from "../components/MeterCalculator";

const features = [
  {
    title: "Pin",
    body: "ENSv2 names the seller agent. Readiness probes Blocky402, payee, Graph, and HCS before any coin moves.",
  },
  {
    title: "Pay",
    body: "Unpaid yield asks return HTTP 402 Exact on Hedera. Metering scales price × protocol count through Blocky402.",
  },
  {
    title: "Prove",
    body: "Every paid fact carries block, deploymentIds, and queryHash. Re-derive must match — or no cite, no coin.",
  },
];

export function HomePage() {
  return (
    <div className="home">
      <section className="home-hero" aria-label="AtBlock">
        <div className="home-hero-media" aria-hidden>
          <img className="home-hero-photo" src="/brand/hero.png" alt="" />
          <img className="home-hero-motion" src="/brand/hero-motion.svg" alt="" />
          <div className="home-hero-scrim" />
        </div>
        <div className="home-hero-copy">
          <p className="home-brand">AtBlock</p>
          <h1>No cite, no coin.</h1>
          <p className="lede">
            Metered Messari yield facts on Hedera x402 — provenance is the checkout rule.
          </p>
          <div className="hero-cta">
            <Link className="btn-link" to="/console">
              Open console
            </Link>
            <Link className="ghost-link" to="/docs">
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      <section className="partner-strip" aria-label="Partners">
        <span>The Graph</span>
        <span aria-hidden>·</span>
        <span>Hedera</span>
        <span aria-hidden>·</span>
        <span>ENS</span>
        <span aria-hidden>·</span>
        <span>ETHOnline 2026</span>
      </section>

      <section className="feature-band">
        <header className="section-head">
          <h2>Three load-bearing moves</h2>
          <p>One path for judges: Pin the agent, pay Exact, prove the Graph cite.</p>
        </header>
        <div className="feature-grid">
          {features.map((f) => (
            <article key={f.title} className="feature-block">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teaser-band">
        <header className="section-head">
          <h2>Metering teaser</h2>
          <p>
            <span className="mono">maxAmountRequired = priceTinybar × N</span> — drag protocols live.
          </p>
        </header>
        <MeterCalculator compact initialProtocols={2} />
        <p className="teaser-links">
          <Link to="/lab">Open protocol lab</Link>
          <Link to="/docs/cite-math">Cite math</Link>
          <Link to="/qualify">Qualify checklist</Link>
        </p>
      </section>
    </div>
  );
}
