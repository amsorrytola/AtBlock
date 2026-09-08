/** Judge-friendly payment receipt from Blocky402 settle / demo path. */

export type PaymentReceipt = {
  status: "settled" | "demo" | "unknown";
  network: string;
  scheme: "exact";
  payTo: string;
  asset: string;
  assetKind: "HBAR" | "HTS";
  amountRequired: string;
  protocolCount: number;
  metering: "per-protocol";
  settleTx?: string;
  facilitator: string;
  idempotencyKey?: string;
  warning?: string;
};

export function buildReceipt(opts: {
  demo: boolean;
  network: string;
  payTo: string;
  asset: string;
  amountRequired: string;
  protocolCount: number;
  settleTx?: string;
  facilitator: string;
  idempotencyKey?: string;
}): PaymentReceipt {
  const assetKind = opts.asset === "0.0.0" ? "HBAR" : "HTS";
  if (opts.demo) {
    return {
      status: "demo",
      network: opts.network,
      scheme: "exact",
      payTo: opts.payTo,
      asset: opts.asset,
      assetKind,
      amountRequired: opts.amountRequired,
      protocolCount: opts.protocolCount,
      metering: "per-protocol",
      facilitator: opts.facilitator,
      idempotencyKey: opts.idempotencyKey,
      warning: "DEMO_ACCEPT_PAYMENT — not valid for judges",
    };
  }
  return {
    status: opts.settleTx ? "settled" : "unknown",
    network: opts.network,
    scheme: "exact",
    payTo: opts.payTo,
    asset: opts.asset,
    assetKind,
    amountRequired: opts.amountRequired,
    protocolCount: opts.protocolCount,
    metering: "per-protocol",
    settleTx: opts.settleTx,
    facilitator: opts.facilitator,
    idempotencyKey: opts.idempotencyKey,
  };
}
