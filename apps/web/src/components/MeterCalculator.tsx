import { useMemo, useState } from "react";
import { DEFAULT_PRICE_TINYBAR } from "../lib/gateway";

function formatHbar(tinybar: bigint): string {
  const whole = tinybar / 100_000_000n;
  const frac = tinybar % 100_000_000n;
  if (frac === 0n) return `${whole}`;
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

export function MeterCalculator({
  compact = false,
  initialProtocols = 2,
}: {
  compact?: boolean;
  initialProtocols?: number;
}) {
  const [price, setPrice] = useState(Number(DEFAULT_PRICE_TINYBAR));
  const [protocols, setProtocols] = useState(initialProtocols);

  const total = useMemo(() => {
    const n = Math.max(1, protocols);
    return BigInt(Math.max(0, Math.floor(price))) * BigInt(n);
  }, [price, protocols]);

  return (
    <div className={compact ? "meter-calc compact" : "meter-calc"}>
      <div className="meter-fields">
        <label>
          <span>Price / protocol (tinybar)</span>
          <input
            type="number"
            min={0}
            step={1_000_000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          <span>Protocols (N)</span>
          <input
            type="range"
            min={1}
            max={8}
            value={protocols}
            onChange={(e) => setProtocols(Number(e.target.value))}
          />
          <strong className="mono">{protocols}</strong>
        </label>
      </div>
      <div className="meter-result" aria-live="polite">
        <p className="meter-formula mono">
          maxAmount = price × N = {price.toLocaleString()} × {Math.max(1, protocols)}
        </p>
        <p className="meter-total">
          <span className="mono">{total.toString()}</span>
          <span className="muted"> tinybar · {formatHbar(total)} HBAR</span>
        </p>
      </div>
    </div>
  );
}
