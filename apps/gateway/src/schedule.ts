/**
 * Metering / schedule metadata for Hedera stretch storytelling.
 * Not a live HTS scheduled-transfer executor — documents how AtBlock would stream
 * or batch Exact payments once keys + HTS path are live.
 */

export type PaymentScheduleInfo = {
  status: "documented-stretch";
  metering: "per-protocol";
  current: {
    scheme: "exact";
    network: string;
    asset: string;
    assetKind: "HBAR" | "HTS";
    priceTinybarPerProtocol: string;
    settleVia: "Blocky402";
  };
  stretchIdeas: {
    id: string;
    title: string;
    note: string;
  }[];
  cameraLine: string;
};

export function buildPaymentScheduleInfo(opts: {
  network: string;
  asset: string;
  priceTinybarPerProtocol: string;
}): PaymentScheduleInfo {
  const assetKind = opts.asset === "0.0.0" ? "HBAR" : "HTS";
  return {
    status: "documented-stretch",
    metering: "per-protocol",
    current: {
      scheme: "exact",
      network: opts.network,
      asset: opts.asset,
      assetKind,
      priceTinybarPerProtocol: opts.priceTinybarPerProtocol,
      settleVia: "Blocky402",
    },
    stretchIdeas: [
      {
        id: "scheduled-exact-topup",
        title: "Scheduled Exact top-up",
        note: "Hedera scheduled tx that pre-funds the buyer for N protocol polls — still settles each fact via x402 Exact.",
      },
      {
        id: "hts-meter-token",
        title: "HTS meter token",
        note: "Swap HEDERA_ASSET to a custom HTS id; receipt already labels assetKind HTS.",
      },
      {
        id: "hcs-stream-receipts",
        title: "HCS receipt stream",
        note: "Already submit payment/cite/rederive to HCS_TOPIC_ID when configured.",
      },
    ],
    cameraLine:
      "Today we meter per protocol on Exact HBAR via Blocky402; schedule/HTS streams are one env change + scheduled tx away.",
  };
}
