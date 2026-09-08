/**
 * Buyer helper: hit gateway unpaid → sign Hedera x402 payload → retry with X-PAYMENT.
 * Requires HEDERA_PAYER_ACCOUNT_ID + HEDERA_PAYER_PRIVATE_KEY in env.
 *
 * Usage: npm run pay -w @atblock/gateway
 */
import { ExactHederaScheme } from "@x402/hedera/exact/client";
import { createClientHederaSigner, PrivateKey } from "@x402/hedera";
import { loadEnv } from "./load-env.js";

loadEnv();

const GATEWAY = process.env.GATEWAY_URL ?? "http://127.0.0.1:8787";
const NETWORK = (process.env.HEDERA_NETWORK ?? "hedera:testnet") as "hedera:testnet";

async function main() {
  const accountId = process.env.HEDERA_PAYER_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PAYER_PRIVATE_KEY;
  if (!accountId || !privateKey) {
    throw new Error("Set HEDERA_PAYER_ACCOUNT_ID and HEDERA_PAYER_PRIVATE_KEY");
  }

  const unpaid = await fetch(`${GATEWAY}/v1/facts/yield`);
  const unpaidBody = (await unpaid.json()) as {
    accepts?: Record<string, unknown>[];
  };
  if (unpaid.status !== 402 || !unpaidBody.accepts?.[0]) {
    throw new Error(`Expected 402 with accepts, got ${unpaid.status}: ${JSON.stringify(unpaidBody)}`);
  }
  const requirements = unpaidBody.accepts[0];
  console.log("402 requirements:", JSON.stringify(requirements, null, 2));

  const signer = createClientHederaSigner(accountId, PrivateKey.fromStringECDSA(privateKey), {
    network: NETWORK,
  });
  const scheme = new ExactHederaScheme(signer);
  const signed = await scheme.createPaymentPayload(2, requirements as never);

  const paymentPayload = {
    x402Version: 2,
    scheme: "exact",
    network: NETWORK,
    accepted: requirements,
    payload: signed.payload,
  };

  const xPayment = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  const paid = await fetch(`${GATEWAY}/v1/facts/yield`, {
    headers: { "X-PAYMENT": xPayment },
  });
  const paidBody = await paid.json();
  console.log(`status=${paid.status}`);
  console.log(JSON.stringify(paidBody, null, 2));
  if (!paid.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
