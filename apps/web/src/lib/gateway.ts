export const GATEWAY = import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:8787";

/** Default meter: 1 HBAR = 100_000_000 tinybar per protocol (gateway default). */
export const DEFAULT_PRICE_TINYBAR = 100_000_000n;

/** Same string hash used by packages/composer for queryHash demo. */
export function hashQuery(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return `q${(h >>> 0).toString(16)}`;
}

export async function gatewayFetch(path: string, init?: RequestInit) {
  const t0 = performance.now();
  const res = await fetch(`${GATEWAY}${path}`, init);
  const ms = Math.round(performance.now() - t0);
  return {
    res,
    ms,
    requestId: res.headers.get("x-request-id"),
    responseTime: res.headers.get("x-response-time"),
  };
}
