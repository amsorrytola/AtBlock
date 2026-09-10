import { ChallengeSimulator } from "../components/ChallengeSimulator";
import { CiteExplainer } from "../components/CiteExplainer";
import { MeterCalculator } from "../components/MeterCalculator";
import { Panel } from "../components/Panel";

export function LabPage() {
  return (
    <div className="lab docs-page">
      <header className="page-intro">
        <p className="eyebrow">Protocol lab</p>
        <h1>Simulate the physics</h1>
        <p className="lede">
          Local 402 challenge flow, metering arithmetic, and the same queryHash idea the composer
          uses — no gateway required for the toys below.
        </p>
      </header>

      <div className="lab-grid">
        <Panel title="402 challenge simulator">
          <ChallengeSimulator />
        </Panel>
        <Panel title="Metering calculator">
          <MeterCalculator />
        </Panel>
        <Panel title="Cite hash visualizer" className="lab-span">
          <CiteExplainer />
        </Panel>
      </div>
    </div>
  );
}
