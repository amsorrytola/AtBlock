/** HashScan deep links for Hedera testnet / mainnet explorer UX. */

const NETWORK = process.env.HEDERA_NETWORK ?? "hedera:testnet";

function base(): string {
  return NETWORK.includes("mainnet")
    ? "https://hashscan.io/mainnet"
    : "https://hashscan.io/testnet";
}

export function hashscanAccount(accountId: string): string {
  return `${base()}/account/${accountId}`;
}

export function hashscanTopic(topicId: string): string {
  return `${base()}/topic/${topicId}`;
}

export function hashscanTransaction(txId: string): string {
  // txId may be 0.0.x@seconds.nanos — encode for URL safety
  return `${base()}/transaction/${encodeURIComponent(txId)}`;
}

export function explorerBundle(opts: {
  payee?: string;
  payer?: string;
  topicId?: string;
  settlementTx?: string;
}) {
  return {
    network: NETWORK,
    payee: opts.payee ? hashscanAccount(opts.payee) : undefined,
    payer: opts.payer ? hashscanAccount(opts.payer) : undefined,
    topic: opts.topicId ? hashscanTopic(opts.topicId) : undefined,
    settlement: opts.settlementTx ? hashscanTransaction(opts.settlementTx) : undefined,
  };
}
