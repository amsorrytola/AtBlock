/**
 * Agent identity card for discovery (Hedera stretch: HCS-14-inspired).
 * Not a full HCS-14 registry implementation — camera-ready metadata agents can fetch.
 * See https://hol.org/docs/standards/hcs-14/
 */

export type AgentIdentityCard = {
  standard: "atblock-identity/0.1";
  inspiredBy: "HCS-14";
  name: string;
  description: string;
  network: string;
  endpoints: {
    directory: string;
    yieldFact: string;
    ensStatus: string;
  };
  payment: {
    scheme: "exact";
    facilitator: string;
    asset: string;
    payTo: string | null;
  };
  audit: {
    hcsTopicId: string | null;
  };
  ens: {
    agentName: string | null;
  };
  wedge: "no-cite-no-coin";
};

export function buildIdentityCard(opts: {
  serviceBase: string;
  network: string;
  facilitator: string;
  asset: string;
  payTo: string;
  hcsTopicId?: string;
  ensAgentName?: string;
}): AgentIdentityCard {
  const base = opts.serviceBase.replace(/\/$/, "");
  return {
    standard: "atblock-identity/0.1",
    inspiredBy: "HCS-14",
    name: "AtBlock Fact Gateway",
    description:
      "Metered Messari yield facts. Hedera x402 via Blocky402. Cite must re-derive from The Graph.",
    network: opts.network,
    endpoints: {
      directory: `${base}/v1/directory`,
      yieldFact: `${base}/v1/facts/yield`,
      ensStatus: `${base}/v1/ens/status`,
    },
    payment: {
      scheme: "exact",
      facilitator: opts.facilitator,
      asset: opts.asset,
      payTo: opts.payTo && opts.payTo !== "0.0.0" ? opts.payTo : null,
    },
    audit: {
      hcsTopicId: opts.hcsTopicId || null,
    },
    ens: {
      agentName: opts.ensAgentName || null,
    },
    wedge: "no-cite-no-coin",
  };
}
