/** Lightweight in-process metrics for demo / ops surface (not Prometheus). */

type Counters = {
  requests: number;
  byStatus: Record<string, number>;
  byPath: Record<string, number>;
  paymentChallenges: number;
  paidFacts: number;
  rederiveMatch: number;
  rederiveMismatch: number;
  startedAt: string;
};

const state: Counters = {
  requests: 0,
  byStatus: {},
  byPath: {},
  paymentChallenges: 0,
  paidFacts: 0,
  rederiveMatch: 0,
  rederiveMismatch: 0,
  startedAt: new Date().toISOString(),
};

export function noteRequest(path: string, status: number) {
  state.requests += 1;
  const s = String(status);
  state.byStatus[s] = (state.byStatus[s] ?? 0) + 1;
  const p = path.split("?")[0] || "/";
  state.byPath[p] = (state.byPath[p] ?? 0) + 1;
  if (status === 402) state.paymentChallenges += 1;
}

export function notePaidFact() {
  state.paidFacts += 1;
}

export function noteRederive(match: boolean) {
  if (match) state.rederiveMatch += 1;
  else state.rederiveMismatch += 1;
}

export function metricsSnapshot() {
  return {
    ...state,
    uptimeSeconds: Math.floor((Date.now() - Date.parse(state.startedAt)) / 1000),
  };
}
